# Mapa Comunitario

Directorio local de recursos comunitarios para orientar y derivar en Uruguay.

La idea es simple: buscar una situacion, encontrar un recurso verificado u online, copiar una derivacion breve y guardar notas locales.

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

## Aviso importante

Esta herramienta no reemplaza atencion profesional, asesoramiento legal ni servicios de emergencia. Si hay riesgo inmediato para la vida, violencia en curso o una emergencia, llamar al 911 o al servicio de urgencia correspondiente.

Los datos de contacto pueden cambiar. Antes de usar la app en un contexto institucional, conviene revisar las fuentes oficiales y actualizar `src/data/resources.ts`.

Los resultados online salen de OpenStreetMap mediante Nominatim y Overpass. Son utiles para ampliar cobertura barrial, pero pueden estar incompletos o desactualizados si la comunidad aun no corrigio el dato.

La app incluye una lista local de barrios y zonales para facilitar la busqueda. Esa lista solo ayuda a ubicar la zona; los recursos se consultan online al momento de buscar.

## Desarrollo local

```bash
npm install
npm run dev
```

Para generar una version publicable:

```bash
npm run build
```

## Privacidad

La app no tiene servidor propio. Favoritos, notas y recursos agregados se guardan en el navegador de la persona usuaria mediante `localStorage`.

Al usar "Buscar online", el texto de busqueda se consulta contra servicios publicos de OpenStreetMap para ubicar la zona y traer recursos cercanos.

## Fuentes iniciales

- [Nominatim Search API](https://nominatim.org/release-docs/latest/api/Search/)
- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
- [Overpass API / Overpass QL](https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL)
- [GeoJSON Montevideo: barrios.geojson](https://github.com/vierja/geojson_montevideo)
- [Centros comunales - Intendencia de Montevideo](https://montevideo.gub.uy/institucional/centros-comunales)
- [Linea Vida y apoyo emocional](https://www.gub.uy/ministerio-educacion-cultura/comunicacion/noticias/prevencion-del-suicidio-0)
- [Servicio telefonico por violencia domestica](https://www.gub.uy/ministerio-desarrollo-social/node/9758)
- [Guia MSP de valoracion del riesgo suicida](https://www.gub.uy/ministerio-salud-publica/comunicacion/publicaciones/valoracion-del-riesgo-suicida-5-pasos-para-evaluacion-triage-guia-para)
- [Telefonos MIDES para situacion de calle](https://www.gub.uy/ministerio-desarrollo-social/comunicacion/comunicados/ministerio-desarrollo-social-renueva-telefonos-para-recibir-informacion)
- [Atencion ciudadana MIDES](https://www.gub.uy/ministerio-desarrollo-social/comunicacion/comunicados/unificacion-numero-informacion-general-del-ministerio-desarrollo-social)
- [Via Trabajo](https://viatrabajo.mtss.gub.uy/)
- [INEFOP](https://www.inefop.org.uy/categoria/Sugerencias--Reclamos-68)
- [Uruguay Estudia](https://www.gub.uy/presidencia/comunicacion/noticias/uruguay-estudia-brinda-orientacion-educativa-traves-del-0800-2637)

## Licencia

MIT.
