import type { Entry, Location, Photo, Source } from "./model"

export const tourismPlan: Source = {
  label: "Plan de Desarrollo Turístico de Curarrehue",
  href: "https://curarrehue.cl/on/wp-content/uploads/2024/06/PLADETUR-CURARREHUE-2023-2026.pdf",
}
const municipalHistory = { label: "Historia y geografía de Curarrehue", href: "https://curarrehue.cl/on/historia/" }
const reigolilPlan = { label: "Plan de Desarrollo de Reigolil", href: "https://curarrehue.cl/on/wp-content/uploads/2025/03/plan-desarrollo-localidad-reigolil-2024-programa-pequenas-localidades-curarrehue.pdf" }
const municipalDevelopment = { label: "Plan de Desarrollo Comunal de Curarrehue", href: "https://curarrehue.cl/on/wp-content/uploads/2024/06/pladeco-2024-2029.pdf" }
const ruralTourism = { label: "Ficha de turismo rural de Curarrehue", href: "https://www.sitrural.cl/wp-content/uploads/2022/05/Curarrehue_turismo.pdf" }
export const conaf = { label: "Ficha de la reserva en CONAF", href: "https://www.conaf.cl/parque_nacionales/reserva-nacional-villarrica-o-hualalafquen/" }
const saltos = { label: "Saltos Maichín en Turismo Curarrehue", href: "https://www.turismocurarrehue.cl/servicio/saltos-maichin" }
const malalco = { label: "Centro Turístico Malalco en Turismo Curarrehue", href: "https://www.turismocurarrehue.cl/servicio/centro-turistico-malalco" }
const cabalgatas = { label: "Cabalgatas Curipillan en Turismo Curarrehue", href: "https://www.turismocurarrehue.cl/servicio/cabalgatas-curipillan" }
const kayak = { label: "Kayak Maichín en Turismo Curarrehue", href: "https://www.turismocurarrehue.cl/servicio/kayak-maichin" }
const corral = { label: "Sitio de Corral del Agua", href: "https://corraldelagua.cl/" }
const rabbitRecipe = { label: "Receta de conejo al ajillo en RTVE", href: "https://www.rtve.es/television/20130118/recetas-de-mi-familia-conejo-al-ajillo/603685.shtml" }
const localTourism = { label: "Gastronomía y turismo local en Sernatur", href: "https://www.sernatur.cl/conoce-los-atractivos-turisticos-que-puedes-visitar-en-la-zona-centro-y-sur-de-chile/" }
const regionalHerbs = { label: "Guía de hierbas de FUCOA", href: "https://www.fucoa.cl/publicaciones/hierbas_medicinales/" }
const shareAlike4 = { label: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" }

export const reigolil: Location & { coordinates: [number, number] } = {
  label: "Reigolil", coordinates: [-39.1176923, -71.4745933], mapQuery: "Reigolil, Curarrehue, Chile",
}
export const curarrehue: Location & { coordinates: [number, number] } = {
  label: "Curarrehue", coordinates: [-39.35898, -71.5873592], mapQuery: "Curarrehue, La Araucanía, Chile",
}
const saltosLocation: Location = {
  label: "Maichín Bajo", coordinates: [-39.326292, -71.559782], mapQuery: "Saltos Maichín, Curarrehue, Chile", sectorReference: true,
}
const malalcoLocation: Location = { label: "Quiñenahuín", coordinates: [-39.235543, -71.429523], mapQuery: "Centro Turístico Malalco, Curarrehue, Chile", sectorReference: true }
const cabalgatasLocation: Location = { label: "Maite", coordinates: [-39.318532, -71.482427], mapQuery: "Cabalgatas Curipillan, Maite, Curarrehue, Chile", sectorReference: true }
const corralLocation: Location = { label: "Maite Alto", coordinates: [-39.248005, -71.432247], mapQuery: "Corral del Agua, Curarrehue, Chile", sectorReference: true }

export const history = [
  {
    title: "Del cordón andino al Trancura",
    text: "El río Maichín baja hacia Curarrehue, donde se une al Trancura. El valle reúne sectores como Puente Basas, Maite, Quiñenahuín, Reigolil y Flor del Valle. En Reigolil, los caseríos se distribuyen junto al río, las quebradas y el camino S-965.",
    sources: [tourismPlan, reigolilPlan],
  },
  {
    title: "La historia de las comunidades",
    text: "La historia comunal vincula la formación de localidades como Reigolil y Maite con el reasentamiento de familias mapuche en la precordillera a fines del siglo XIX y comienzos del XX, durante la ocupación militar de La Araucanía. Curarrehue pasó a ser comuna en 1980 y su municipio se instaló en 1981.",
    sources: [municipalHistory],
  },
  {
    title: "Tradiciones campesinas y mapuche",
    text: "El plan turístico local registra encuentros como la muestra campesina de Puente Basas y las fiestas de tradiciones de Maite y Flor del Valle. Sus fechas y programas varían. Las actividades comunitarias se visitan según la convocatoria de sus organizadores.",
    sources: [tourismPlan],
  },
]

export const visitAdvice = [
  "Consulta el estado del camino S-965 y las condiciones de acceso antes de salir, especialmente después de lluvias o nevadas.",
  "Confirma los horarios y reserva cuando el prestador o la administración lo solicite. Pide autorización para ingresar a predios privados.",
  "Lleva el itinerario guardado, calzado adecuado y agua. Respeta los senderos señalizados y retira tus residuos.",
]

export const photos: Photo[] = [
  {
    id: "panorama-cuenca", file: "panorama-cuenca", widths: [480, 960, 1600],
    place: "Cuenca del Maichín", category: "Valle y río",
    alt: "Vista aérea del relieve, los bosques y el valle de la cuenca del Maichín en otoño",
    caption: "Panorámica de la cuenca del Maichín en otoño.",
    credit: "Archivo de ConoceCurarrehue",
  },
  {
    id: "sollipulli-aereo", file: "sollipulli", widths: [480, 960, 1600],
    place: "Nevados de Sollipulli", category: "Cordillera",
    alt: "Vista aérea de la caldera de Sollipulli, con nieve y laderas rocosas",
    caption: "Caldera de Sollipulli vista desde el aire.",
    credit: "Dropus", license: { label: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" },
    source: { label: "Original en Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Sollipulli_Caldera,_Southern_Chile.jpg" },
  },
  {
    id: "sollipulli-cumbre", file: "cumbre", widths: [480, 960],
    place: "Nevados de Sollipulli", category: "Cordillera",
    alt: "Cordones andinos nevados vistos desde la cumbre de Sollipulli",
    caption: "Vista desde la cumbre del volcán Sollipulli.",
    credit: "Yerklomano", license: { label: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" },
    source: { label: "Original en Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Cumbre_Volcan_Sollipulli-Chile.jpg" },
  },
]

const gastronomicTopics = [
  ["conejo-al-ajillo", "Conejo al ajillo", "Platos de fondo", "Conejo dorado en trozos y cocinado con ajo. El pimentón y el vinagre aportan aroma y acidez en la versión del recetario de RTVE.", ["Conejo", "Ajo", "Pimentón", "Vinagre"], rabbitRecipe],
  ["cazuelas", "Cazuelas", "Platos de fondo", "Caldo servido con papas, zapallo y verduras. La carne y los demás ingredientes varían según la receta.", ["Papas", "Zapallo", "Verduras"], localTourism],
  ["asados", "Asados tradicionales", "Platos de fondo", "Preparaciones de carne cocinada al calor de las brasas.", ["Carne"], tourismPlan],
  ["jugos-de-frutos-silvestres", "Jugos de frutos silvestres", "Bebidas", "El maqui es un ejemplo de fruto nativo que se puede usar en bebidas de fruta. La oferta depende de la cosecha.", ["Fruta apta para consumo", "Agua"], regionalHerbs],
  ["infusiones-locales", "Infusiones de hierbas locales", "Bebidas", "Bebidas preparadas al dejar reposar hierbas aptas para consumo en agua caliente.", ["Hierbas aptas para consumo", "Agua"], regionalHerbs],
] as const

export const foodPhotos: Photo[] = [
  {
    id: "conejo-al-ajillo", file: "conejo-ajillo", widths: [480, 960], place: "Torreblanca, España", category: "Platos de fondo",
    alt: "Conejo al ajillo servido en trozos",
    caption: "Conejo al ajillo preparado en Torreblanca, España. Fotografía referencial de la preparación.",
    credit: "Juan Emilio Prades Bel", license: shareAlike4,
    source: { label: "Original en Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Conejo_al_ajillo%2C_t%C3%ADpico_de_la_gastronom%C3%ADa_popular_espa%C3%B1ola.jpg" },
  },
  {
    id: "cazuelas", file: "cazuela-chilena", widths: [480, 960], place: "Gastronomía chilena", category: "Platos de fondo",
    alt: "Cazuela de pollo con verduras en un plato hondo",
    caption: "Cazuela de pollo chilena. Fotografía referencial de la preparación.",
    credit: "Pozytyv", license: shareAlike4,
    source: { label: "Original en Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Chilean_cazuela.jpg" },
  },
  {
    id: "asados", file: "asado-chileno", widths: [480, 960], place: "Gastronomía chilena", category: "Platos de fondo",
    alt: "Cortes de carne cocinándose en una parrilla",
    caption: "Asado chileno. Fotografía referencial de la preparación.",
    credit: "Claire Provost", license: { label: "CC BY-SA 3.0", href: "https://creativecommons.org/licenses/by-sa/3.0/" },
    source: { label: "Original en Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Asado_chileno.JPG" },
  },
  {
    id: "jugos-de-frutos-silvestres", file: "fruto-maqui", widths: [480], place: "Gastronomía chilena", category: "Frutos nativos",
    alt: "Frutos de maqui de color morado oscuro entre hojas verdes",
    caption: "Frutos de maqui, uno de los ingredientes que se puede usar en jugos.",
    credit: "Morrana", license: shareAlike4,
    source: { label: "Original en Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Maqui_chileno.jpg" },
  },
  {
    id: "infusiones-locales", file: "infusion-hierbas", widths: [480, 960], place: "Gastronomía", category: "Bebidas",
    alt: "Infusión de hierbas servida en una taza de vidrio",
    caption: "Infusión de hierbas. Fotografía referencial de la preparación.",
    credit: "PagesAndPathsPH", license: { label: "CC0 1.0", href: "https://creativecommons.org/publicdomain/zero/1.0/" },
    source: { label: "Original en Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Herbal_Tea_01.jpg" },
  },
]

export const entries: Entry[] = [
  {
    kind: "gastronomia", id: "restobar-cupal-curarrehue", name: "Restobar Cupal Curarrehue",
    category: "Restobar y cafetería", status: "published",
    summary: "Comida casera, sándwiches, pizzas y cafetería en Curarrehue.",
    location: { label: "Bernardo O’Higgins 1368, Curarrehue" },
    venue: {
      menu: "https://menu.fu.do/restobarycafeteriacupal/qr-menu",
      whatsapp: "https://api.whatsapp.com/send/?phone=56953080413",
      maps: "https://maps.app.goo.gl/BwKUKBisTXdeqWZa6",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3084.4351256590517!2d-71.58682201575473!3d-39.36902679846999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96147f5ac1db4795%3A0x49192952db3829ff!2sCupal%20Restobar%20y%20Cafeter%C3%ADa!5e0!3m2!1ses!2scl!4v1728782579962!5m2!1ses!2scl",
    },
    sources: [],
  },
  {
    kind: "atractivos", id: "rio-maichin", name: "Río Maichín", category: "Ríos", status: "published",
    summary: "El río que recorre el valle de Reigolil y se une al Trancura cerca de Curarrehue.",
    location: { ...reigolil, label: "Valle de Reigolil", sectorReference: true }, sources: [tourismPlan, reigolilPlan], photoIds: ["panorama-cuenca"],
    access: { conditions: "Reigolil es una referencia territorial. Consulta por un acceso público antes de acercarte al cauce.", advice: "Pregunta por las condiciones del río y coordina los descensos con un prestador local." },
  },
  {
    kind: "atractivos", id: "saltos-maichin", name: "Saltos Maichín", category: "Cascadas", status: "published",
    summary: "Dos saltos de agua en Maichín Bajo, con senderos, escaleras y pasarelas.",
    location: saltosLocation, providerIds: ["saltos-maichin"], sources: [saltos, tourismPlan],
    amenities: ["Senderos", "Pasarelas"], manager: "Saltos Maichín", administration: "Privado",
    access: { conditions: "La ficha del prestador indica acceso en vehículo desde Curarrehue.", schedule: "Horario publicado de domingo a viernes, 11:00 a 19:30. Confirma antes de ir.", price: "$3.000 por persona según la ficha del prestador. Confirma la tarifa y las condiciones vigentes.", advice: "Usa calzado con buen agarre para transitar por escaleras y pasarelas." },
  },
  {
    kind: "atractivos", id: "malalco", name: "Salto y miradores de Malalco", category: "Miradores", status: "published",
    summary: "Miradores sobre el salto de Malalco y un recorrido que pasa por cascadas y puentes en Quiñenahuín.",
    location: malalcoLocation, providerIds: ["centro-turistico-malalco"], manager: "Centro Turístico Malalco", administration: "Privado", sources: [malalco, tourismPlan],
    amenities: ["Miradores", "Puentes peatonales"], access: { booking: "Consulta al prestador por reservas, tarifas y acceso al sendero Las Quilas." },
  },
  {
    kind: "atractivos", id: "reserva-villarrica-hualalafquen", name: "Reserva Nacional Villarrica · Hualalafquén", category: "Bosques y lagunas", status: "published",
    summary: "Sector de la reserva con acceso descrito desde Curarrehue por el camino hacia Reigolil.",
    administration: "CONAF", manager: "Corporación Nacional Forestal", sources: [conaf, tourismPlan],
    location: { label: "Sector Hualalafquén", mapQuery: "Laguna Hualalafquén, Reserva Nacional Villarrica, Curarrehue, Chile" },
    access: { conditions: "CONAF describe un desvío de tierra desde la ruta hacia Reigolil.", booking: "Consulta con la administración si es necesario reservar o coordinar el ingreso.", restrictions: "Verifica el estado del acceso y de los senderos con la administración antes de salir." },
    contact: { email: "reserva.villarrica@conaf.cl", website: conaf.href },
  },
  {
    kind: "atractivos", id: "bosque-corral-del-agua", name: "Bosque de Corral del Agua", category: "Bosques y lagunas", status: "published",
    summary: "Espacio privado con bosque nativo y actividades junto al río Maichín.",
    administration: "Privado", manager: "Corral del Agua", location: corralLocation, providerIds: ["corral-del-agua"], sources: [corral, municipalDevelopment],
    access: { conditions: "La visita al predio se coordina con el prestador.", booking: "Consulta disponibilidad y requisitos de ingreso antes de ir." },
  },
  {
    kind: "atractivos", id: "nevados-de-sollipulli", name: "Nevados de Sollipulli", category: "Montañas", status: "published",
    summary: "Caldera volcánica de la cordillera, vinculada a la Reserva Nacional Villarrica y al entorno alto del Maichín.",
    location: { label: "Cumbre de Sollipulli", coordinates: [-38.960556, -71.500458], sectorReference: true },
    photoIds: ["sollipulli-aereo", "sollipulli-cumbre"], sources: [conaf, tourismPlan],
    access: { conditions: "El punto del mapa identifica la cumbre. Consulta con CONAF las rutas habilitadas y los requisitos para ascender." },
  },
  {
    kind: "alojamiento", id: "cabanas-corral-del-agua", name: "Cabañas Corral del Agua", category: "Cabañas", status: "published",
    summary: "Cabañas equipadas en un bosque de robles próximo al río Maichín.",
    location: corralLocation, providerIds: ["corral-del-agua"], sources: [corral, tourismPlan],
    capacity: "Hasta 6 personas por cabaña, según el prestador.",
    amenities: ["Cocina equipada", "Baño privado", "Terraza", "Fogón"],
  },
  {
    kind: "experiencias", id: "cabalgata-hualalafquen", name: "Cabalgata a orillas de Hualalafquén", category: "Cabalgatas", status: "published",
    summary: "Salida a caballo ofrecida por Cabalgatas Curipillan desde el sector de Maite.",
    location: cabalgatasLocation, sources: [cabalgatas], providerIds: ["cabalgatas-curipillan"],
    safety: "Confirma el punto de encuentro, la duración y los requisitos con el guía antes de reservar.",
  },
  {
    kind: "experiencias", id: "caminatas-corral-del-agua", name: "Caminatas en Corral del Agua", category: "Caminatas guiadas", status: "published",
    summary: "Senderismo y observación del entorno en actividades que se coordinan con el prestador.",
    location: corralLocation, sources: [corral], providerIds: ["corral-del-agua"],
    safety: "Consulta qué recorrido guiado está disponible y qué equipamiento requiere.",
  },
  {
    kind: "experiencias", id: "descenso-rio-maichin", name: "Descenso guiado por el río Maichín", category: "Experiencias de naturaleza", status: "published",
    summary: "Salida fluvial que parte en el sector de Quilonco y termina en Pichi Curarrehue.",
    location: { label: "Quilonco · inicio del descenso" }, sources: [kayak], providerIds: ["kayak-maichin"],
    durationMinutes: 90, requirements: "La ficha indica 18 años o más para el kayak inflable.",
    gear: "El prestador informa que entrega equipamiento.", safety: "Consulta la modalidad, el caudal y la disponibilidad con el guía.",
  },
  {
    kind: "servicios", id: "corral-del-agua", name: "Corral del Agua", category: "Alojamiento", status: "published",
    summary: "Cabañas y actividades de naturaleza junto al Maichín.", location: corralLocation, sources: [corral],
    contact: { phone: "+56992212776", email: "info@corraldelagua.cl", website: corral.href },
  },
  {
    kind: "servicios", id: "cabalgatas-curipillan", name: "Cabalgatas Curipillan", category: "Cabalgatas", status: "published",
    summary: "Prestador de recorridos a caballo en el sector Maite.", location: cabalgatasLocation, sources: [cabalgatas],
    contact: { whatsapp: "+56989327074" },
  },
  {
    kind: "servicios", id: "saltos-maichin", name: "Saltos Maichín", category: "Atractivos naturales", status: "published",
    summary: "Atención a visitantes y acceso a los saltos en Maichín Bajo.", location: saltosLocation, sources: [saltos],
    contact: { whatsapp: "+56977253456" },
  },
  {
    kind: "servicios", id: "centro-turistico-malalco", name: "Centro Turístico Malalco", category: "Atractivos naturales", status: "published",
    summary: "Información de acceso a miradores y cascadas en Quiñenahuín.", location: malalcoLocation, sources: [malalco],
    contact: { whatsapp: "+56934641180" },
  },
  {
    kind: "servicios", id: "kayak-maichin", name: "Kayak Maichín", category: "Guías turísticos", status: "published",
    summary: "Descensos guiados y equipamiento para experiencias en el río.", location: { ...curarrehue, label: "Salida desde Curarrehue", sectorReference: true },
    sources: [kayak], contact: { whatsapp: "+56944866133" },
  },
  {
    kind: "gastronomia", id: "preparaciones-tradicionales", name: "Gastronomía campesina en Maite", category: "Preparaciones tradicionales", status: "published",
    summary: "La Fiesta de Tradiciones Campesinas de Maite ha incluido degustaciones de cocina mapuche y campesina.",
    location: { label: "Maite", mapQuery: "Maite, Curarrehue, Chile", sectorReference: true },
    context: "La fiesta es un encuentro de gastronomía, artesanía y actividades campesinas registrado en la oferta cultural de la comuna.",
    localAvailability: "Consulta a la organización por la programación, los puestos y los platos de la próxima edición.",
    sources: [tourismPlan, ruralTourism],
  },
  ...gastronomicTopics.map(([id, name, category, summary, ingredients, source]): Entry => ({
    kind: "gastronomia", id, name, category, summary, status: "published",
    ingredients: [...ingredients],
    photoIds: foodPhotos.some((photo) => photo.id === id) ? [id] : undefined,
    localAvailability: "Consulta las cartas de los locales y la programación de las ferias gastronómicas de Curarrehue.",
    sources: source === localTourism ? [source] : [source, localTourism],
  })),
]

export const featuredAttractions = ["rio-maichin", "saltos-maichin", "nevados-de-sollipulli"]
export const featuredExperiences = ["cabalgata-hualalafquen", "caminatas-corral-del-agua"]

export const published = entries.filter((entry) =>
  entry.status === "published" &&
  (entry.kind !== "trekking" || (entry.selfGuided && entry.access.conditions && entry.access.advice && entry.sources.length)),
)
