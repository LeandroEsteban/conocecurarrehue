import type { Catalog } from "./model"

export const maichinSlug = "cuenca-del-maichin"

export const serviceLinks = [
  ["Gastronomía", "gastronomia"],
  ["Alojamiento", "alojamiento"],
  ["Trekking", "trekking"],
  ["Servicios", "servicios"],
  ["Mapa", "mapa"],
] as const

export function hasStandaloneService(slug: string) {
  return serviceLinks.some(([, route]) => route === slug)
}

export const sections = {
  "historia-y-como-llegar": {
    title: "Historia y cómo llegar",
    short: "Cómo llegar",
    description: "Conoce el valle, su historia y las rutas desde Pucón y Vilcún.",
    icon: "compass",
  },
  atractivos: {
    title: "Atractivos naturales",
    short: "Atractivos",
    description: "Ríos, saltos y paisajes registrados en la cuenca.",
    icon: "leaf",
  },
  lugares: {
    title: "Lugares para visitar",
    short: "Lugares",
    description: "Revisa quién administra cada espacio y sus condiciones de ingreso.",
    icon: "pin",
  },
  galeria: {
    title: "Galería fotográfica",
    short: "Galería",
    description: "Imágenes del territorio con procedencia y créditos.",
    icon: "camera",
  },
  gastronomia: {
    title: "Gastronomía local",
    short: "Gastronomía",
    description: "Preparaciones y productos para conocer los sabores locales.",
    icon: "food",
  },
  alojamiento: {
    title: "Alojamientos",
    short: "Alojamiento",
    description: "Busca dónde quedarte por tipo de alojamiento y servicios.",
    icon: "bed",
  },
  trekking: {
    title: "Trekking autodirigido",
    short: "Trekking",
    description: "Consulta las opciones para caminar y los requisitos de acceso en la cuenca.",
    icon: "mountain",
  },
  experiencias: {
    title: "Caminatas y cabalgatas guiadas",
    short: "Experiencias",
    description: "Encuentra actividades para recorrer el valle con guías locales.",
    icon: "people",
  },
  servicios: {
    title: "Directorio de servicios turísticos",
    short: "Servicios",
    description: "Consulta los servicios disponibles y sus canales públicos de contacto.",
    icon: "list",
  },
  mapa: {
    title: "Mapa turístico de la cuenca",
    short: "Mapa",
    description: "Ubica los lugares y revisa los recorridos de acceso.",
    icon: "map",
  },
} as const

export type MaichinSection = keyof typeof sections

export const catalogs: Catalog[] = [
  "atractivos",
  "gastronomia",
  "alojamiento",
  "trekking",
  "experiencias",
  "servicios",
]

export function isMaichinSection(value: string): value is MaichinSection {
  return Object.prototype.hasOwnProperty.call(sections, value)
}

export const maichinTitle = "Descubre la Cuenca del Maichín"
export const maichinDescription =
  "Entre ríos, bosques y comunidades rurales de Curarrehue. Conoce el valle y encuentra información para planificar tu visita."
