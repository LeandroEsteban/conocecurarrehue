export type Catalog = "atractivos" | "gastronomia" | "alojamiento" | "trekking" | "experiencias" | "servicios"
export type Coordinates = [latitude: number, longitude: number]

export interface Source {
  label: string
  href: string
}

export interface Location {
  label: string
  coordinates?: Coordinates
  mapQuery?: string
  sectorReference?: boolean
}

export interface Photo {
  id: string
  alt: string
  caption: string
  place: string
  category: string
  file: string
  widths: number[]
  credit: string
  license?: Source
  source?: Source
}

export interface Contact {
  phone?: string
  whatsapp?: string
  email?: string
  website?: string
  social?: Source[]
}

export interface Access {
  conditions?: string
  schedule?: string
  price?: string
  booking?: string
  restrictions?: string
  advice?: string
}

interface EntryBase {
  id: string
  name: string
  category: string
  summary: string
  status: "published" | "draft"
  sources: Source[]
  description?: string
  location?: Location
  photoIds?: string[]
  providerIds?: string[]
  contact?: Contact
}

export const administrations = ["Privado", "CONAF", "Otra administración"] as const
export type Administration = (typeof administrations)[number]

export interface Attraction extends EntryBase {
  kind: "atractivos"
  administration?: Administration
  manager?: string
  access?: Access
  amenities?: string[]
}

export interface Food extends EntryBase {
  kind: "gastronomia"
  venue?: { menu: string; whatsapp: string; maps: string; mapEmbed: string }
  ingredients?: string[]
  context?: string
  localAvailability?: string
}

export interface Accommodation extends EntryBase {
  kind: "alojamiento"
  amenities?: string[]
  capacity?: string
  price?: string
}

export const difficulties = ["Baja", "Media", "Alta"] as const
export type Difficulty = (typeof difficulties)[number]

export interface Trail extends EntryBase {
  kind: "trekking"
  selfGuided: boolean
  difficulty: Difficulty
  distanceKm: number
  durationMinutes: number
  access: Access
  elevationGain?: number
  altitude?: string
  terrain?: string
  routeType?: string
  start?: string
  end?: string
  season?: string
  gear?: string
  amenities?: string[]
  track?: Coordinates[]
  gpx?: string
}

export interface Experience extends EntryBase {
  kind: "experiencias"
  difficulty?: Difficulty
  durationMinutes?: number
  requirements?: string
  capacity?: string
  gear?: string
  price?: string
  safety?: string
}

export interface Provider extends EntryBase {
  kind: "servicios"
  representative?: string
  schedule?: string
}

export type Entry = Attraction | Food | Accommodation | Trail | Experience | Provider
export type JourneyId = "pucon" | "vilcun"

export interface Journey {
  id: JourneyId
  origin: Location
  via: Location[]
  roads: string
  advice: string
  source: Source
  geometry?: Coordinates[]
  distanceKm?: number
  durationMinutes?: number
}

export interface MapPoint {
  id: string
  name: string
  category: string
  location: Location & { coordinates: Coordinates }
  href?: string
}

export interface MapLine {
  id: string
  name: string
  points: Coordinates[]
  color: string
}
