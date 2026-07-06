export type MontevideoAreaType = "barrio" | "ccz" | "municipio" | "zona";

export type MontevideoArea = {
  name: string;
  query: string;
  type: MontevideoAreaType;
  lat: number;
  lon: number;
  aliases?: string[];
};

const barrioRows: Array<[string, number, number, string[]?]> = [
  ["Aguada", -34.891049, -56.188547],
  ["Aires Puros", -34.8523, -56.189007],
  ["Atahualpa", -34.865672, -56.189332],
  ["Barrio Sur", -34.911494, -56.190104],
  ["Banados de Carrasco", -34.840148, -56.092673],
  ["Belvedere", -34.849968, -56.225262],
  ["Brazo Oriental", -34.862421, -56.178701],
  ["Buceo", -34.899393, -56.128522],
  ["Capurro Bella Vista", -34.875302, -56.205344, ["Capurro", "Bella Vista"]],
  ["Carrasco", -34.88436, -56.048441],
  ["Carrasco Norte", -34.873183, -56.063846],
  ["Casabo Pajas Blancas", -34.878512, -56.294811, ["Casabo", "Pajas Blancas"]],
  ["Casavalle", -34.830966, -56.16934],
  ["Castro Castellanos", -34.858538, -56.161151],
  ["Centro", -34.903601, -56.192618],
  ["Cerrito", -34.855894, -56.17144, ["Cerrito de la Victoria"]],
  ["Cerro", -34.88352, -56.257163],
  ["Ciudad Vieja", -34.907612, -56.205593],
  ["Colon Centro y Noroeste", -34.796043, -56.235504, ["Colon"]],
  ["Colon Sureste Abayuba", -34.777601, -56.195687, ["Abayuba"]],
  ["Conciliacion", -34.822603, -56.238319],
  ["Cordon", -34.901596, -56.175367],
  ["Figurita", -34.876263, -56.177435, ["La Figurita"]],
  ["Flor de Maronas", -34.852703, -56.124319],
  ["Ituzaingo", -34.849886, -56.143858],
  ["Jacinto Vera", -34.874999, -56.171387],
  ["Jardines del Hipodromo", -34.836652, -56.133551],
  ["La Blanqueada", -34.887197, -56.152392],
  ["La Comercial", -34.887296, -56.169642],
  ["La Paloma Tomkinson", -34.856193, -56.261988, ["Tomkinson"]],
  ["La Teja", -34.870825, -56.229968],
  ["Larranaga", -34.878592, -56.162291],
  ["Las Acacias", -34.840753, -56.160499],
  ["Las Canteras", -34.870755, -56.104681],
  ["Lezica Melilla", -34.788438, -56.285361, ["Lezica", "Melilla"]],
  ["Malvin", -34.893801, -56.105128],
  ["Malvin Norte", -34.878892, -56.119217],
  ["Manga", -34.81338, -56.148819],
  ["Manga Toledo Chico", -34.783639, -56.16685, ["Toledo Chico"]],
  ["Maronas Parque Guarani", -34.863303, -56.123835, ["Maronas", "Parque Guarani"]],
  ["Mercado Modelo y Bolivar", -34.867382, -56.162026, ["Mercado Modelo", "Bolivar"]],
  ["Nuevo Paris", -34.845527, -56.249763],
  ["Palermo", -34.910596, -56.178798],
  ["Parque Rodo", -34.913191, -56.166958],
  ["Paso de la Arena", -34.814499, -56.325927],
  ["Paso de las Duranas", -34.847092, -56.202487],
  ["Penarol Lavalleja", -34.824587, -56.197476, ["Penarol", "Lavalleja"]],
  ["Piedras Blancas", -34.824322, -56.141976],
  ["Pocitos", -34.910382, -56.148548],
  ["Parque Batlle Villa Dolores", -34.895658, -56.14948, ["Parque Batlle", "Villa Dolores"]],
  ["Prado Nueva Savona", -34.861466, -56.206835, ["Prado", "Nueva Savona"]],
  ["Puerto", -34.899485, -56.203914],
  ["Punta Carretas", -34.92484, -56.16031],
  ["Punta Gorda", -34.894559, -56.078178],
  ["Punta Rieles Bella Italia", -34.824554, -56.101328, ["Punta Rieles", "Bella Italia"]],
  ["Reducto", -34.877557, -56.188183],
  ["Sayago", -34.830435, -56.215224],
  ["Tres Cruces", -34.894109, -56.165775],
  ["Tres Ombues Pueblo Victoria", -34.854718, -56.24578, ["Tres Ombues", "Pueblo Victoria"]],
  ["Union", -34.877708, -56.138905],
  ["Villa Espanola", -34.862827, -56.144772],
  ["Villa Garcia Manga Rural", -34.801274, -56.089876, ["Villa Garcia"]],
  ["Villa Munoz Retiro", -34.888131, -56.17802, ["Villa Munoz", "Retiro"]],
];

const cczRows: Array<[string, number, number, string[]?]> = [
  ["CCZ 1", -34.9069, -56.2002, ["Zonal 1", "Centro Comunal Zonal 1"]],
  ["CCZ 2", -34.9022, -56.1773, ["Zonal 2", "Centro Comunal Zonal 2"]],
  ["CCZ 3", -34.8817, -56.1838, ["Zonal 3", "Centro Comunal Zonal 3"]],
  ["CCZ 4", -34.8895, -56.1522, ["Zonal 4", "Centro Comunal Zonal 4"]],
  ["CCZ 5", -34.9094, -56.1487, ["Zonal 5", "Centro Comunal Zonal 5"]],
  ["CCZ 6", -34.8844, -56.1303, ["Zonal 6", "Centro Comunal Zonal 6"]],
  ["CCZ 7", -34.895098, -56.099176, ["Zonal 7", "Centro Comunal Zonal 7"]],
  ["CCZ 8", -34.878274, -56.088454, ["Zonal 8", "Centro Comunal Zonal 8"]],
  ["CCZ 9", -34.858751, -56.133527, ["Zonal 9", "Centro Comunal Zonal 9"]],
  ["CCZ 10", -34.821627, -56.140952, ["Zonal 10", "Centro Comunal Zonal 10"]],
  ["CCZ 11", -34.845563, -56.154312, ["Zonal 11", "Centro Comunal Zonal 11"]],
  ["CCZ 12", -34.8051, -56.2359, ["Zonal 12", "Centro Comunal Zonal 12"]],
  ["CCZ 13", -34.8312, -56.2118, ["Zonal 13", "Centro Comunal Zonal 13"]],
  ["CCZ 14", -34.8552, -56.2053, ["Zonal 14", "Centro Comunal Zonal 14"]],
  ["CCZ 15", -34.8627, -56.1742, ["Zonal 15", "Centro Comunal Zonal 15"]],
  ["CCZ 16", -34.865917, -56.208461, ["Zonal 16", "Centro Comunal Zonal 16"]],
  ["CCZ 17", -34.8848, -56.2527, ["Zonal 17", "Centro Comunal Zonal 17"]],
  ["CCZ 18", -34.8172, -56.3231, ["Zonal 18", "Centro Comunal Zonal 18"]],
];

const extraRows: Array<[string, number, number, string[]?]> = [
  ["El Tobogan", -34.866871, -56.248468, ["Tobogan"]],
  ["Municipio A", -34.856, -56.272, ["Municipal A"]],
  ["Municipio B", -34.904, -56.185, ["Municipal B"]],
  ["Municipio C", -34.872, -56.187, ["Municipal C"]],
  ["Municipio CH", -34.896, -56.132, ["Municipal CH"]],
  ["Municipio D", -34.832, -56.145, ["Municipal D"]],
  ["Municipio E", -34.885, -56.075, ["Municipal E"]],
  ["Municipio F", -34.848, -56.108, ["Municipal F"]],
  ["Municipio G", -34.817, -56.224, ["Municipal G"]],
];

function toArea(type: MontevideoAreaType, row: [string, number, number, string[]?]): MontevideoArea {
  const [name, lat, lon, aliases] = row;
  return {
    name,
    query: `${name} Montevideo`,
    type,
    lat,
    lon,
    aliases,
  };
}

export const montevideoAreas: MontevideoArea[] = [
  ...barrioRows.map((row) => toArea("barrio", row)),
  ...cczRows.map((row) => toArea("ccz", row)),
  ...extraRows.map((row) => toArea(row[0].startsWith("Municipio") ? "municipio" : "zona", row)),
];

export const featuredMontevideoAreas = [
  "Cerro",
  "Las Acacias",
  "El Tobogan",
  "Pocitos",
  "Casavalle",
  "CCZ 11",
  "CCZ 17",
  "Municipio A",
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function areaTerms(area: MontevideoArea) {
  return [area.name, area.query, ...(area.aliases || [])].map(normalize);
}

export function findMontevideoArea(value: string) {
  const key = normalize(value);
  if (!key) return undefined;

  return montevideoAreas.find((area) =>
    areaTerms(area).some((term) => term === key || term === `${key} montevideo`),
  );
}

export function getMontevideoAreaSuggestions(value: string, limit = 10) {
  const key = normalize(value);
  const base = key
    ? montevideoAreas
        .map((area) => {
          const terms = areaTerms(area);
          const exact = terms.some((term) => term === key);
          const starts = terms.some((term) => term.startsWith(key));
          const includes = terms.some((term) => term.includes(key));
          const score = exact ? 0 : starts ? 1 : includes ? 2 : 99;
          return { area, score };
        })
        .filter((item) => item.score < 99)
        .sort((a, b) => a.score - b.score || a.area.name.localeCompare(b.area.name, "es"))
        .map((item) => item.area)
    : featuredMontevideoAreas
        .map((name) => montevideoAreas.find((area) => area.name === name))
        .filter((area): area is MontevideoArea => Boolean(area));

  return base.slice(0, limit);
}
