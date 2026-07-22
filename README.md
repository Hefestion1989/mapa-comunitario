# Mapa Comunitario

Directorio abierto y liviano para conectar personas con recursos comunitarios y servicios de Uruguay.

**[Abrir Mapa Comunitario](https://hefestion1989.github.io/mapa-comunitario/)**

La idea es simple: buscar una situacion, encontrar una via de contacto verificada u online, copiar una orientacion breve y guardar notas locales. No diagnostica ni decide por la persona: ayuda a encontrar el siguiente contacto posible.

## Que incluye

- Busqueda por situacion, institucion, publico, zona o telefono.
- Busqueda online por barrio, zona, CCZ o municipio de Montevideo usando fuentes abiertas.
- Sugerencias para 63 barrios, 18 centros comunales zonales y municipios de Montevideo.
- Filtros por salud mental, violencia, calle, consumo, trabajo, educacion, tramites y emergencia.
- Fichas con telefono, horarios, fuente oficial y fecha de verificacion.
- Favoritos y notas locales guardadas en el navegador.
- Carga de recursos barriales o institucionales propios.
- Boton para copiar una derivacion breve.
- Vista imprimible de cada ficha.
- Enlace para informar datos desactualizados desde cada recurso verificado.

## Aviso importante

Esta herramienta no reemplaza atencion profesional, asesoramiento legal ni servicios de emergencia. Si hay riesgo inmediato para la vida, violencia en curso o una emergencia, llamar al 911 o al servicio de urgencia correspondiente.

Los datos de contacto pueden cambiar. Cada ficha indica su fuente y fecha de verificacion. Antes de usar la app en un contexto institucional, conviene abrir la fuente oficial; cualquier persona puede informar un cambio mediante los issues del repositorio.

Los resultados online salen de OpenStreetMap mediante Nominatim y Overpass. Son utiles para ampliar cobertura barrial, pero pueden estar incompletos o desactualizados si la comunidad aun no corrigio el dato.

La app incluye una lista local de barrios y zonales para facilitar la busqueda. Esa lista solo ayuda a ubicar la zona; los recursos se consultan online al momento de buscar.

## Desarrollo local

```bash
npm install
npm run check
npm run dev
```

Para generar una version publicable:

```bash
npm run build
```

## Mantenimiento de recursos

Los recursos iniciales se mantienen en `src/data/resources.ts`. Para proponer una correccion:

1. abrir la ficha en la aplicacion;
2. elegir **Informar un dato desactualizado**;
3. indicar el dato que cambio y, si es posible, una fuente oficial actual.

No incluyas nombres, historias clinicas ni otra informacion personal en el reporte.

## Privacidad

La app no tiene servidor propio. Favoritos, notas y recursos agregados se guardan en el navegador de la persona usuaria mediante `localStorage`.

Al usar "Buscar online", el texto de busqueda se consulta contra servicios publicos de OpenStreetMap para ubicar la zona y traer recursos cercanos.

## Fuentes iniciales

- [Nominatim Search API](https://nominatim.org/release-docs/latest/api/Search/)
- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
- [Overpass API / Overpass QL](https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL)
- [GeoJSON Montevideo: barrios.geojson](https://github.com/vierja/geojson_montevideo)
- [Centros comunales - Intendencia de Montevideo](https://montevideo.gub.uy/institucional/centros-comunales)
- [Lineas de salud mental del MSP](https://www.gub.uy/ministerio-salud-publica/salud-mental)
- [Servicio telefonico por violencia domestica](https://guiaderecursos.mides.gub.uy/66589/servicio-telefonico-y-ayuda-a-mujer-en-situacion-de-violencia-domestica-0800-4141)
- [Guia MSP de valoracion del riesgo suicida](https://www.gub.uy/ministerio-salud-publica/comunicacion/publicaciones/valoracion-del-riesgo-suicida-5-pasos-para-evaluacion-triage-guia-para)
- [Telefonos MIDES para situacion de calle](https://www.gub.uy/ministerio-desarrollo-social/comunicacion/comunicados/ministerio-desarrollo-social-renueva-telefonos-para-recibir-informacion)
- [Atencion ciudadana MIDES](https://www.gub.uy/presidencia/comunicacion/noticias/nuevos-canales-comunicacion-del-ministerio-desarrollo-social)
- [Linea gratuita de la Junta Nacional de Drogas](https://www.gub.uy/junta-nacional-drogas/tramites-y-servicios/servicios/linea-gratuita-1020)
- [Via Trabajo](https://viatrabajo.mtss.gub.uy/)
- [INEFOP](https://www.inefop.uy/contacto)
- [Orientacion Educativa de ANEP](https://pcentrales.anep.edu.uy/node/362)
- [Uruguay Estudia](https://pue.edu.uy/)

## Licencia

MIT.
