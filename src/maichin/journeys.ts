import { curarrehue, reigolil } from "./content"
import routes from "./journey-geometry.json"
import type { Coordinates, Journey, Location, MapLine } from "./model"

export const pucon: Location & { coordinates: Coordinates } = {
  label: "Pucón", coordinates: [-39.2731173, -71.9777605], mapQuery: "Pucón, Chile",
}
export const vilcun: Location & { coordinates: Coordinates } = {
  label: "Vilcún", coordinates: [-38.6703956, -72.2240806], mapQuery: "Vilcún, La Araucanía, Chile",
}
const freire: Location = { label: "Freire", mapQuery: "Freire, La Araucanía, Chile" }
const geopark = { label: "Georruta 2 · Kütralkura", href: "https://www.kutralkura.cl/georrutas/georruta-2?lang=es" }

export const routeCredits = {
  label: "OSRM · OpenStreetMap",
  href: "https://www.openstreetmap.org/copyright",
}

function geometry(data: (typeof routes)[keyof typeof routes]) {
  return {
    distanceKm: data.distanceKm,
    durationMinutes: data.durationMinutes,
    geometry: data.geometry.map(([latitude, longitude]): Coordinates => [latitude, longitude]),
  }
}

export const journeys: Journey[] = [
  {
    id: "pucon", origin: pucon, via: [curarrehue], ...geometry(routes.pucon),
    roads: "Toma la CH-199 hacia Curarrehue y continúa por la S-965 hasta Reigolil.",
    advice: "La S-965 incluye tramos de ripio. Confirma su estado antes de salir.", source: geopark,
  },
  {
    id: "vilcun", origin: vilcun, via: [freire, pucon, curarrehue], ...geometry(routes.vilcun),
    roads: "Itinerario vía Freire, Villarrica y Pucón. Sigue por la CH-199 hasta Curarrehue y continúa por la S-965 a Reigolil.",
    advice: "El trazado muestra el itinerario por la zona lacustre. Considera tiempo adicional en el tramo de ripio.", source: geopark,
  },
]

export function directions(journey: Journey) {
  const query = new URLSearchParams({
    api: "1",
    origin: journey.origin.mapQuery ?? journey.origin.label,
    destination: reigolil.mapQuery ?? reigolil.label,
    waypoints: journey.via.map((point) => point.mapQuery ?? point.label).join("|"),
    travelmode: "driving",
  })
  return "https://www.google.com/maps/dir/?" + query
}

export function embeddedDirections(journey: Journey) {
  const stops = [...journey.via, reigolil].map((point) => point.mapQuery ?? point.label)
  const query = new URLSearchParams({
    saddr: journey.origin.mapQuery ?? journey.origin.label,
    daddr: stops.join(" to:"),
    dirflg: "d",
    output: "embed",
    hl: "es",
  })
  return "https://www.google.com/maps?" + query
}

export function journeyLine(journey: Journey): MapLine | undefined {
  if (!journey.geometry?.length) return undefined
  return {
    id: journey.id,
    name: "Desde " + journey.origin.label,
    points: journey.geometry,
    color: journey.id === "pucon" ? "#21664c" : "#9a3b58",
  }
}
