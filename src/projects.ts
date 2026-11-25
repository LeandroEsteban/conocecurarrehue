export const categories = [
  "Turismo y patrimonio",
  "Producción local",
] as const

export type Category = typeof categories[number]

export type Project = {
  id: string
  name: string
  category: Category
  description: string
  sector: string
  image: string
  marker: [number, number]
}

export const images = {
  landscape:
    "https://images.unsplash.com/photo-1758409571024-20dcf43d52bf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1800",
  mountain:
    "https://images.unsplash.com/photo-1758409571145-b1f545707b14?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
  bridge:
    "https://images.unsplash.com/photo-1554992985-8ab04fbe59b8?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
  berries:
    "https://images.unsplash.com/photo-1626851723920-5ef45faed864?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
  berriesTall:
    "https://images.unsplash.com/photo-1788952424158-61221df5eb3e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
  forest:
    "https://images.unsplash.com/photo-1647641244393-899e5809badb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
  foliage:
    "https://images.unsplash.com/photo-1633717130646-68a9e7b3b6ea?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
}

export const projects: Project[] = [
  {
    id: "parque-maite",
    name: "Parque Ecológico Maite Quiñenehuin",
    category: "Turismo y patrimonio",
    description:
      "Un espacio para caminar, conocer el bosque nativo y proteger la biodiversidad local.",
    sector: "Quiñenehuin",
    image: images.landscape,
    marker: [37, 37],
  },
  {
    id: "puente-aguas-blancas",
    name: "Puente Colgante Aguas Blancas",
    category: "Turismo y patrimonio",
    description:
      "Recuperación de un hito local con potencial turístico, cultural y de encuentro.",
    sector: "Aguas Blancas",
    image: images.bridge,
    marker: [57, 28],
  },
  {
    id: "conejos",
    name: "Crianza y comercialización de conejos",
    category: "Producción local",
    description:
      "Crianza responsable para mascotas y una alternativa gastronómica de origen local.",
    sector: "Maite",
    image:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    marker: [44, 59],
  },
  {
    id: "calafate",
    name: "Producción de calafate",
    category: "Producción local",
    description:
      "Manejo de huertos de calafate para crear productos con identidad territorial.",
    sector: "Maite",
    image: images.berries,
    marker: [73, 48],
  },
  {
    id: "maqui-arrayan",
    name: "Producción de maqui, chin-chin y arrayán",
    category: "Producción local",
    description:
      "Manejo consciente de áreas naturales para la recolección y venta de frutos.",
    sector: "Maite",
    image: images.berriesTall,
    marker: [24, 50],
  },
  {
    id: "murtilla",
    name: "Producción de murtilla y murtillón",
    category: "Producción local",
    description:
      "Frutos nativos para consumo fresco, conservas y preparaciones artesanales.",
    sector: "Maite",
    image: images.foliage,
    marker: [28, 70],
  },
  {
    id: "yeuque",
    name: "Comercialización de frutos de yeuque",
    category: "Producción local",
    description:
      "Producción y comercialización de un fruto local de gran valor cultural.",
    sector: "Maite",
    image: images.forest,
    marker: [48, 44],
  },
  {
    id: "rosa-mosqueta",
    name: "Producción de rosa mosqueta",
    category: "Producción local",
    description:
      "Cosecha de rosa mosqueta para infusiones, aceites y productos naturales.",
    sector: "Maite",
    image: images.berriesTall,
    marker: [41, 76],
  },
]

export function imageSources(image: string) {
  return [480, 800, 1200, 1800]
    .map((width) => `${image.replace(/&w=\d+$/, `&w=${width}`)} ${width}w`)
    .join(", ")
}
