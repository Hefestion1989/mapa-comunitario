import { useEffect, useMemo, useState } from "react";
import { getMontevideoAreaSuggestions, montevideoAreas, type MontevideoArea } from "./data/montevideoAreas";
import { categoryLabels, resources, urgencyLabels } from "./data/resources";
import { searchOnlineResources } from "./onlineSearch";
import type { Category, LocalNote, Resource } from "./types";
import { buildReferralText, classNames, matchesResource } from "./utils";

const STORAGE_FAVORITES = "mapa-comunitario:favorites";
const STORAGE_NOTES = "mapa-comunitario:notes";
const STORAGE_CUSTOM = "mapa-comunitario:custom-resources";

const categoryOrder: Array<Category | "todos"> = [
  "todos",
  "salud-mental",
  "violencia",
  "calle",
  "consumo",
  "trabajo",
  "educacion",
  "tramites",
  "emergencia",
];

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function toTelHref(phone: string) {
  const primaryNumber = phone.split("/")[0].trim();
  return `tel:${primaryNumber.replace(/[^\d*#+]/g, "")}`;
}

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "todos">("todos");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => readJson(STORAGE_FAVORITES, []));
  const [notes, setNotes] = useState<Record<string, LocalNote>>(() => readJson(STORAGE_NOTES, {}));
  const [customResources, setCustomResources] = useState<Resource[]>(() => readJson(STORAGE_CUSTOM, []));
  const [onlineResources, setOnlineResources] = useState<Resource[]>([]);
  const [onlineStatus, setOnlineStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [onlineMessage, setOnlineMessage] = useState("");
  const [onlinePlace, setOnlinePlace] = useState("");
  const [selectedId, setSelectedId] = useState(resources[0].id);
  const [draftNote, setDraftNote] = useState("");
  const [copyState, setCopyState] = useState("");
  const [customName, setCustomName] = useState("");
  const [customPhone, setCustomPhone] = useState("");
  const [customArea, setCustomArea] = useState("Montevideo");

  const allResources = useMemo(
    () => [...resources, ...onlineResources, ...customResources],
    [customResources, onlineResources],
  );

  const filteredResources = useMemo(() => {
    return allResources.filter((resource) => {
      const categoryMatch = category === "todos" || resource.category === category;
      const favoriteMatch = !onlyFavorites || favorites.includes(resource.id);
      return categoryMatch && favoriteMatch && matchesResource(resource, query);
    });
  }, [allResources, category, favorites, onlyFavorites, query]);

  const selectedResource = useMemo(() => {
    return (
      allResources.find((resource) => resource.id === selectedId) ||
      filteredResources[0] ||
      allResources[0]
    );
  }, [allResources, filteredResources, selectedId]);

  const areaSuggestions = useMemo(
    () => getMontevideoAreaSuggestions(query, query.trim() ? 10 : 8),
    [query],
  );

  useEffect(() => {
    if (!filteredResources.some((resource) => resource.id === selectedId) && filteredResources[0]) {
      setSelectedId(filteredResources[0].id);
    }
  }, [filteredResources, selectedId]);

  useEffect(() => {
    if (selectedResource) {
      setDraftNote(notes[selectedResource.id]?.text || "");
    }
  }, [notes, selectedResource]);

  useEffect(() => {
    localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CUSTOM, JSON.stringify(customResources));
  }, [customResources]);

  const stats = {
    verified: resources.length,
    online: onlineResources.length,
    favorites: favorites.length,
    localNotes: Object.keys(notes).length,
  };

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  async function copyReferral(resource: Resource) {
    await navigator.clipboard.writeText(buildReferralText(resource));
    setCopyState("Derivacion copiada");
    window.setTimeout(() => setCopyState(""), 1800);
  }

  async function runOnlineSearch(searchValue?: string) {
    const trimmed = (searchValue || query).trim();
    if (searchValue !== undefined) {
      setQuery(searchValue);
    }
    setOnlineStatus("loading");
    setOnlineMessage("Buscando recursos online...");
    setOnlineResources([]);
    setOnlinePlace("");
    setOnlyFavorites(false);
    try {
      const result = await searchOnlineResources(trimmed);
      setOnlineResources(result.resources);
      setOnlinePlace(result.placeLabel);
      setOnlineStatus("success");
      setOnlineMessage(
        result.resources.length
          ? `${result.resources.length} recursos online cerca de ${result.placeLabel}`
          : `No aparecieron recursos online cerca de ${result.placeLabel}`,
      );
      if (result.resources[0]) {
        setCategory("todos");
        setSelectedId(result.resources[0].id);
      }
    } catch (error) {
      setOnlineStatus("error");
      setOnlineMessage(
        error instanceof Error
          ? error.message
          : "No se pudo completar la busqueda online. Proba otra zona o repetilo en un momento.",
      );
    }
  }

  function clearOnlineResults() {
    setOnlineResources([]);
    setOnlineStatus("idle");
    setOnlineMessage("");
    setOnlinePlace("");
    setSelectedId(resources[0].id);
  }

  function saveNote() {
    if (!selectedResource) return;
    const text = draftNote.trim();
    setNotes((current) => {
      const next = { ...current };
      if (!text) {
        delete next[selectedResource.id];
      } else {
        next[selectedResource.id] = {
          resourceId: selectedResource.id,
          text,
          updatedAt: new Date().toISOString(),
        };
      }
      return next;
    });
  }

  function addCustomResource() {
    const name = customName.trim();
    if (!name) return;
    const id = `local-${Date.now()}`;
    const resource: Resource = {
      id,
      name,
      organization: "Recurso local",
      category: "tramites",
      urgency: "orientacion",
      scope: customArea.trim() || "Local",
      audience: ["referentes", "vecinos", "comunidad"],
      situations: [name, customArea, customPhone],
      phone: customPhone.trim() || undefined,
      hours: "Completar",
      notes: "Recurso agregado localmente en este navegador. Verificar antes de compartir.",
      referral: `Consultar ${name}${customPhone ? ` al ${customPhone}` : ""}. Verificar datos antes de derivar.`,
      sourceName: "Dato local",
      sourceUrl: "",
      verifiedAt: new Date().toISOString().slice(0, 10),
    };
    setCustomResources((current) => [resource, ...current]);
    setSelectedId(id);
    setCustomName("");
    setCustomPhone("");
    setCustomArea("Montevideo");
  }

  function printResource() {
    window.print();
  }

  function startAreaSearch(area: MontevideoArea) {
    void runOnlineSearch(area.name);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Navegacion y filtros">
        <div className="brand">
          <div className="brand-mark">MC</div>
          <div>
            <h1>Mapa Comunitario</h1>
            <p>Recursos para orientar y derivar con cuidado.</p>
          </div>
        </div>

        <section className="emergency-box">
          <span className="section-label">Acceso rapido</span>
          <a className="quick-action emergency" href="tel:911">
            <span>Emergencia</span>
            <strong>911</strong>
          </a>
          <a className="quick-action" href="tel:08000767">
            <span>Linea Vida</span>
            <strong>0800 0767</strong>
          </a>
          <a className="quick-action" href="tel:08004141">
            <span>Violencia domestica</span>
            <strong>0800 4141</strong>
          </a>
        </section>

        <section className="filter-group">
          <span className="section-label">Categorias</span>
          {categoryOrder.map((item) => (
            <button
              key={item}
              className={classNames("filter-button", category === item && "is-active")}
              onClick={() => setCategory(item)}
            >
              <span>{item === "todos" ? "Todos" : categoryLabels[item]}</span>
              <small>
                {item === "todos"
                  ? allResources.length
                  : allResources.filter((resource) => resource.category === item).length}
              </small>
            </button>
          ))}
        </section>

        <section className="local-add">
          <span className="section-label">Agregar recurso local</span>
          <input
            value={customName}
            onChange={(event) => setCustomName(event.target.value)}
            placeholder="Nombre del recurso"
          />
          <div className="two-fields">
            <input
              value={customPhone}
              onChange={(event) => setCustomPhone(event.target.value)}
              placeholder="Telefono"
            />
            <input
              value={customArea}
              onChange={(event) => setCustomArea(event.target.value)}
              placeholder="Zona"
            />
          </div>
          <button className="primary compact" onClick={addCustomResource}>
            Guardar local
          </button>
        </section>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              list="montevideo-areas"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void runOnlineSearch();
                }
              }}
              placeholder="Barrio, CCZ, municipio, recurso o situacion"
              aria-label="Buscar recursos"
            />
            <datalist id="montevideo-areas">
              {montevideoAreas.map((area) => (
                <option key={`${area.type}-${area.name}`} value={area.name} />
              ))}
            </datalist>
          </div>
          <button
            className={classNames("toggle-favorites", onlyFavorites && "is-active")}
            onClick={() => setOnlyFavorites((value) => !value)}
          >
            Favoritos
          </button>
          <button
            className="primary online-button"
            onClick={() => void runOnlineSearch()}
            disabled={onlineStatus === "loading"}
          >
            {onlineStatus === "loading" ? "Buscando..." : "Buscar online"}
          </button>
        </header>

        <section className="online-guide">
          <div>
            <strong>Busqueda online para Montevideo</strong>
            <span>Barrios, zonas, CCZ y municipios. Escribi y toca Buscar online, o elegi un ejemplo.</span>
          </div>
          <div className="area-suggestions" aria-label="Sugerencias de busqueda online">
            {areaSuggestions.map((area) => (
              <button key={`${area.type}-${area.name}`} className="area-chip" onClick={() => startAreaSearch(area)}>
                <span>{area.name}</span>
                <small>{area.type === "ccz" ? "zonal" : area.type}</small>
              </button>
            ))}
          </div>
        </section>

        {(onlineMessage || onlineResources.length > 0) && (
          <section className={classNames("online-strip", onlineStatus)}>
            <div>
              <strong>{onlineStatus === "error" ? "Busqueda online" : "Fuente online"}</strong>
              <span>{onlineMessage}</span>
              {onlinePlace && <small>OpenStreetMap / Overpass</small>}
            </div>
            {onlineResources.length > 0 && (
              <button className="secondary compact" onClick={clearOnlineResults}>
                Limpiar online
              </button>
            )}
          </section>
        )}

        <section className="stats-row" aria-label="Resumen">
          <Metric label="Recursos verificados" value={stats.verified} />
          <Metric label="Online" value={stats.online} />
          <Metric label="Favoritos" value={stats.favorites} />
          <Metric label="Notas locales" value={stats.localNotes} />
          <Metric label="Resultados" value={filteredResources.length} />
        </section>

        <section className="content-grid">
          <div className="resource-list" aria-label="Listado de recursos">
            <div className="list-heading">
              <div>
                <h2>Recursos encontrados</h2>
                <p>Selecciona una ficha para preparar una derivacion breve.</p>
              </div>
              <span>{filteredResources.length} visibles</span>
            </div>

            {onlineStatus === "loading" ? (
              <div className="empty-state">
                <strong>Buscando recursos online.</strong>
                <p>Esto puede demorar unos segundos porque consulta fuentes abiertas externas.</p>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="empty-state">
                <strong>No aparecieron recursos.</strong>
                <p>Proba con otro barrio, un CCZ cercano o limpia los filtros.</p>
              </div>
            ) : (
              filteredResources.map((resource) => (
                <ResourceRow
                  key={resource.id}
                  resource={resource}
                  selected={resource.id === selectedResource?.id}
                  favorite={favorites.includes(resource.id)}
                  hasNote={Boolean(notes[resource.id])}
                  onSelect={() => setSelectedId(resource.id)}
                  onFavorite={() => toggleFavorite(resource.id)}
                />
              ))
            )}
          </div>

          {selectedResource && (
            <DetailPanel
              resource={selectedResource}
              favorite={favorites.includes(selectedResource.id)}
              note={draftNote}
              copyState={copyState}
              onFavorite={() => toggleFavorite(selectedResource.id)}
              onCopy={() => copyReferral(selectedResource)}
              onPrint={printResource}
              onNoteChange={setDraftNote}
              onSaveNote={saveNote}
            />
          )}
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ResourceRow({
  resource,
  selected,
  favorite,
  hasNote,
  onSelect,
  onFavorite,
}: {
  resource: Resource;
  selected: boolean;
  favorite: boolean;
  hasNote: boolean;
  onSelect: () => void;
  onFavorite: () => void;
}) {
  return (
    <article className={classNames("resource-row", selected && "is-selected")}>
      <button className="row-main" onClick={onSelect}>
        <span className={classNames("urgency", resource.urgency)}>{urgencyLabels[resource.urgency]}</span>
        <div>
          <h3>{resource.name}</h3>
          <p>{resource.organization}</p>
        </div>
        <span className="scope">{resource.scope}</span>
      </button>
      <div className="row-meta">
        <span>{categoryLabels[resource.category]}</span>
        {resource.phone && <span>{resource.phone}</span>}
        {hasNote && <span>Nota local</span>}
        {resource.isOnline && <span>Online</span>}
        <button
          className={classNames("icon-button", favorite && "is-active")}
          onClick={onFavorite}
          aria-label={favorite ? "Quitar favorito" : "Marcar favorito"}
        >
          ★
        </button>
      </div>
    </article>
  );
}

function DetailPanel({
  resource,
  favorite,
  note,
  copyState,
  onFavorite,
  onCopy,
  onPrint,
  onNoteChange,
  onSaveNote,
}: {
  resource: Resource;
  favorite: boolean;
  note: string;
  copyState: string;
  onFavorite: () => void;
  onCopy: () => void;
  onPrint: () => void;
  onNoteChange: (value: string) => void;
  onSaveNote: () => void;
}) {
  return (
    <aside className="detail-panel" aria-label="Detalle del recurso">
      <div className="print-card">
        <div className="detail-header">
          <span className={classNames("urgency", resource.urgency)}>{urgencyLabels[resource.urgency]}</span>
          <button className={classNames("icon-button", favorite && "is-active")} onClick={onFavorite}>
            ★
          </button>
        </div>
        <h2>{resource.name}</h2>
        <p className="organization">{resource.organization}</p>

        <div className="contact-stack">
          {resource.phone && (
            <a className="contact-action" href={toTelHref(resource.phone)}>
              <span>Telefono</span>
              <strong>{resource.phone}</strong>
            </a>
          )}
          {resource.whatsapp && (
            <div className="contact-action muted">
              <span>Marcacion / WhatsApp</span>
              <strong>{resource.whatsapp}</strong>
            </div>
          )}
          {resource.address && (
            <div className="contact-action muted">
              <span>Direccion</span>
              <strong>{resource.address}</strong>
            </div>
          )}
          {resource.website && (
            <a className="contact-action" href={resource.website} target="_blank" rel="noreferrer">
              <span>Sitio oficial</span>
              <strong>Abrir web</strong>
            </a>
          )}
        </div>

        <section className="detail-section">
          <h3>Cuándo usarlo</h3>
          <p>{resource.notes}</p>
        </section>

        <section className="detail-section">
          <h3>Derivacion breve</h3>
          <p>{resource.referral}</p>
        </section>

        <section className="detail-section">
          <h3>Situaciones relacionadas</h3>
          <div className="tags">
            {resource.situations.slice(0, 8).map((situation) => (
              <span key={situation}>{situation}</span>
            ))}
          </div>
        </section>

        <section className="source-line">
          <span>Fuente: {resource.sourceName}</span>
          {resource.sourceUrl && (
            <a href={resource.sourceUrl} target="_blank" rel="noreferrer">
              Ver fuente
            </a>
          )}
          <span>{resource.isOnline ? "Consultado" : "Verificado"}: {resource.verifiedAt}</span>
        </section>
      </div>

      <div className="detail-actions">
        <button className="primary" onClick={onCopy}>
          {copyState || "Copiar derivacion"}
        </button>
        <button className="secondary" onClick={onPrint}>
          Imprimir ficha
        </button>
      </div>

      <section className="note-box">
        <label htmlFor="local-note">Nota local</label>
        <textarea
          id="local-note"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Ej: referente, horario real, direccion del barrio, cuidado a tener..."
        />
        <button className="secondary" onClick={onSaveNote}>
          Guardar nota
        </button>
      </section>
    </aside>
  );
}

export default App;
