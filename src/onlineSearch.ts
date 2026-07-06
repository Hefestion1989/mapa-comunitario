import type { Category, Resource } from "./types";

type NominatimPlace = {
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
};

type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: Record<string, string>;
};

export type OnlineSearchResult = {
  placeLabel: string;
  resources: Resource[];
};

const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const SEARCH_RADIUS_METERS = 2600;
const MAX_ONLINE_RESULTS = 28;

const relevantAmenityLabels: Record<string, string> = {
  clinic: "Clinica / policlinica",
  community_centre: "Centro comunitario",
  doctors: "Consultorio medico",
  hospital: "Centro de salud",
  kindergarten: "Educacion inicial",
  library: "Biblioteca",
  police: "Policia",
  school: "Centro educativo",
  social_centre: "Centro social",
  social_facility: "Servicio social",
  townhall: "Oficina publica",
};

function buildSearchUrl(query: string) {
  const url = new URL(NOMINATIM_ENDPOINT);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("countrycodes", "uy");
  url.searchParams.set("limit", "1");
  url.searchParams.set("accept-language", "es");
  url.searchParams.set("q", `${query}, Uruguay`);
  return url.toString();
}

function buildOverpassQuery(lat: number, lon: number) {
  const amenityPattern =
    "^(hospital|clinic|doctors|social_facility|community_centre|social_centre|school|kindergarten|library|police|townhall)$";

  return `
    [out:json][timeout:25];
    (
      node(around:${SEARCH_RADIUS_METERS},${lat},${lon})["amenity"~"${amenityPattern}"];
      way(around:${SEARCH_RADIUS_METERS},${lat},${lon})["amenity"~"${amenityPattern}"];
      relation(around:${SEARCH_RADIUS_METERS},${lat},${lon})["amenity"~"${amenityPattern}"];
      node(around:${SEARCH_RADIUS_METERS},${lat},${lon})["healthcare"];
      way(around:${SEARCH_RADIUS_METERS},${lat},${lon})["healthcare"];
      relation(around:${SEARCH_RADIUS_METERS},${lat},${lon})["healthcare"];
      node(around:${SEARCH_RADIUS_METERS},${lat},${lon})["office"="government"];
      way(around:${SEARCH_RADIUS_METERS},${lat},${lon})["office"="government"];
      relation(around:${SEARCH_RADIUS_METERS},${lat},${lon})["office"="government"];
    );
    out center tags ${MAX_ONLINE_RESULTS};
  `;
}

function getElementPosition(element: OverpassElement) {
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  return typeof lat === "number" && typeof lon === "number" ? { lat, lon } : null;
}

function distanceMeters(fromLat: number, fromLon: number, toLat: number, toLon: number) {
  const radius = 6371000;
  const dLat = ((toLat - fromLat) * Math.PI) / 180;
  const dLon = ((toLon - fromLon) * Math.PI) / 180;
  const lat1 = (fromLat * Math.PI) / 180;
  const lat2 = (toLat * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return Math.round(radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function mapCategory(tags: Record<string, string>): Category {
  if (tags.amenity === "police") return "emergencia";
  if (tags.amenity === "school" || tags.amenity === "kindergarten" || tags.amenity === "library") {
    return "educacion";
  }
  if (tags.amenity === "hospital" || tags.amenity === "clinic" || tags.amenity === "doctors" || tags.healthcare) {
    return "salud-mental";
  }
  if (tags.amenity === "social_facility" || tags.amenity === "community_centre" || tags.amenity === "social_centre") {
    return "tramites";
  }
  return "tramites";
}

function describeKind(tags: Record<string, string>) {
  if (tags.healthcare) return `Salud: ${tags.healthcare}`;
  if (tags.office === "government") return "Oficina publica";
  if (tags.amenity) return relevantAmenityLabels[tags.amenity] || tags.amenity;
  return "Recurso comunitario";
}

function buildAddress(tags: Record<string, string>) {
  const street = tags["addr:street"];
  const number = tags["addr:housenumber"];
  const city = tags["addr:city"];
  return [street, number, city].filter(Boolean).join(" ");
}

function toResource(
  element: OverpassElement,
  place: NominatimPlace,
  searchTerm: string,
  centerLat: number,
  centerLon: number,
): Resource | null {
  const tags = element.tags || {};
  const name = tags.name || tags.official_name || tags.operator;
  const position = getElementPosition(element);
  if (!name || !position) return null;

  const category = mapCategory(tags);
  const address = buildAddress(tags);
  const kind = describeKind(tags);
  const distance = distanceMeters(centerLat, centerLon, position.lat, position.lon);
  const phone = tags.phone || tags["contact:phone"];
  const website = tags.website || tags["contact:website"];
  const sourceUrl = `https://www.openstreetmap.org/${element.type}/${element.id}`;
  const verifiedAt = new Date().toISOString().slice(0, 10);
  const scope = `${Math.round(distance / 100) / 10} km de ${place.name || place.display_name.split(",")[0]}`;

  return {
    id: `osm-${element.type}-${element.id}`,
    name,
    organization: tags.operator || kind,
    category,
    urgency: category === "emergencia" ? "alta" : "orientacion",
    scope,
    audience: ["vecinos", "referentes", "comunidad"],
    situations: [
      name,
      kind,
      searchTerm,
      place.display_name,
      tags.amenity || "",
      tags.healthcare || "",
      address,
      phone || "",
    ].filter(Boolean),
    phone,
    website,
    hours: tags.opening_hours || "No informado en OpenStreetMap",
    address,
    distanceMeters: distance,
    isOnline: true,
    notes:
      "Resultado consultado en fuentes abiertas. Puede servir para ubicar recursos barriales, pero conviene confirmar telefono, horario y vigencia antes de derivar.",
    referral: `Consultar ${name}${phone ? ` al ${phone}` : ""}${address ? `, ${address}` : ""}. Dato obtenido de OpenStreetMap; verificar antes de derivar.`,
    sourceName: "OpenStreetMap / Overpass",
    sourceUrl,
    verifiedAt,
  };
}

export async function searchOnlineResources(query: string): Promise<OnlineSearchResult> {
  const trimmed = query.trim();
  if (trimmed.length < 3) {
    throw new Error("Escribi una zona o barrio con al menos 3 caracteres.");
  }

  const placeResponse = await fetch(buildSearchUrl(trimmed));
  if (!placeResponse.ok) throw new Error("No se pudo ubicar la zona consultada.");
  const places = (await placeResponse.json()) as NominatimPlace[];
  const place = places[0];
  if (!place) throw new Error("No encontre esa zona en Uruguay.");

  const lat = Number(place.lat);
  const lon = Number(place.lon);
  const body = new URLSearchParams({ data: buildOverpassQuery(lat, lon) });
  let payload: { elements?: OverpassElement[] } | null = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const resourceResponse = await fetch(endpoint, {
        method: "POST",
        body,
      });
      if (!resourceResponse.ok) continue;
      payload = (await resourceResponse.json()) as { elements?: OverpassElement[] };
      break;
    } catch {
      payload = null;
    }
  }

  if (!payload) throw new Error("La fuente online no respondio. Proba de nuevo en un momento.");
  const unique = new Map<string, Resource>();

  for (const element of payload.elements || []) {
    const resource = toResource(element, place, trimmed, lat, lon);
    if (resource) unique.set(resource.id, resource);
  }

  const resources = Array.from(unique.values())
    .sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0))
    .slice(0, MAX_ONLINE_RESULTS);

  return {
    placeLabel: place.display_name,
    resources,
  };
}
