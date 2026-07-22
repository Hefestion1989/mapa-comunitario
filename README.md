# Mapa Comunitario

Directorio abierto y liviano para conectar personas con recursos comunitarios y servicios de Uruguay.

**[Abrir Mapa Comunitario](https://hefestion1989.github.io/mapa-comunitario/)**

La idea es simple: buscar una situación, encontrar una vía de contacto verificada u online, copiar una orientación breve y guardar notas locales. No diagnostica ni decide por la persona: ayuda a encontrar el siguiente contacto posible.

## Qué incluye

- Búsqueda por situación, institución, público, zona o teléfono.
- Búsqueda online por barrio, zona, CCZ o municipio de Montevideo usando fuentes abiertas.
- Sugerencias para 63 barrios, 18 centros comunales zonales y municipios de Montevideo.
- Filtros por salud mental, violencia, calle, consumo, trabajo, educación, trámites y emergencia.
- Fichas con teléfono, horarios, fuente oficial y fecha de verificación.
- Favoritos y notas locales guardadas en el navegador.
- Carga de recursos barriales o institucionales propios.
- Botón para copiar una derivación breve.
- Vista imprimible de cada ficha.
- Enlace para informar datos desactualizados desde cada recurso verificado.

## Aviso importante

Esta herramienta no reemplaza atención profesional, asesoramiento legal ni servicios de emergencia. Si hay riesgo inmediato para la vida, violencia en curso o una emergencia, llamar al 911 o al servicio de urgencia correspondiente.

Los datos de contacto pueden cambiar. Cada ficha indica su fuente y fecha de verificación. Antes de usar la app en un contexto institucional, conviene abrir la fuente oficial; cualquier persona puede informar un cambio mediante los issues del repositorio.

Los resultados online salen de OpenStreetMap mediante Nominatim y Overpass. Son útiles para ampliar cobertura barrial, pero pueden estar incompletos o desactualizados si la comunidad aún no corrigió el dato.

La app incluye una lista local de barrios y zonales para facilitar la búsqueda. Esa lista solo ayuda a ubicar la zona; los recursos se consultan online al momento de buscar.

## Desarrollo local

```bash
npm install
npm run check
npm run dev
```

Para generar una versión publicable:

```bash
npm run build
```

## Mantenimiento de recursos

Los recursos iniciales se mantienen en `src/data/resources.ts`. Para proponer una corrección:

1. abrir la ficha en la aplicación;
2. elegir **Informar un dato desactualizado**;
3. indicar el dato que cambió y, si es posible, una fuente oficial actual.

No incluyas nombres, historias clínicas ni otra información personal en el reporte.

## Privacidad

La app no tiene servidor propio. Favoritos, notas y recursos agregados se guardan en el navegador de la persona usuaria mediante `localStorage`.

Al usar "Buscar online", el texto de búsqueda se consulta contra servicios públicos de OpenStreetMap para ubicar la zona y traer recursos cercanos.

## Fuentes iniciales

- [Nominatim Search API](https://nominatim.org/release-docs/latest/api/Search/)
- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
- [Overpass API / Overpass QL](https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL)
- [GeoJSON Montevideo: barrios.geojson](https://github.com/vierja/geojson_montevideo)
- [Centros comunales - Intendencia de Montevideo](https://montevideo.gub.uy/institucional/centros-comunales)
- [Líneas de salud mental del MSP](https://www.gub.uy/ministerio-salud-publica/salud-mental)
- [Servicio telefónico por violencia doméstica](https://guiaderecursos.mides.gub.uy/66589/servicio-telefonico-y-ayuda-a-mujer-en-situacion-de-violencia-domestica-0800-4141)
- [Guía MSP de valoración del riesgo suicida](https://www.gub.uy/ministerio-salud-publica/comunicacion/publicaciones/valoracion-del-riesgo-suicida-5-pasos-para-evaluacion-triage-guia-para)
- [Teléfonos MIDES para situación de calle](https://www.gub.uy/ministerio-desarrollo-social/comunicacion/comunicados/ministerio-desarrollo-social-renueva-telefonos-para-recibir-informacion)
- [Atención ciudadana MIDES](https://www.gub.uy/presidencia/comunicacion/noticias/nuevos-canales-comunicacion-del-ministerio-desarrollo-social)
- [Línea gratuita de la Junta Nacional de Drogas](https://www.gub.uy/junta-nacional-drogas/tramites-y-servicios/servicios/linea-gratuita-1020)
- [Vía Trabajo](https://viatrabajo.mtss.gub.uy/)
- [INEFOP](https://www.inefop.uy/contacto)
- [Orientación Educativa de ANEP](https://pcentrales.anep.edu.uy/node/362)
- [Uruguay Estudia](https://pue.edu.uy/)

## Licencia

MIT.
