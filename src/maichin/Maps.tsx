import { useEffect, useMemo, useRef, useState } from "react"
import type { LayerGroup, Map as LeafletMap, Marker } from "leaflet"
import { Icon, SectionTitle } from "../components/ui"
import { curarrehue, published, reigolil } from "./content"
import { directions, journeyLine, journeys, pucon, routeCredits, vilcun } from "./journeys"
import type { MapLine, MapPoint } from "./model"
import { container, EmptyState, entryHref, External, externalMap, FilterSelect, maichinHref, outlined, primary, surface, textLink } from "./ui"

const pointTypes = {
  "atractivos": { label: "Atractivos", icon: "◆", color: "#21664c" },
  "alojamiento": { label: "Alojamientos", icon: "■", color: "#345777" },
  "servicios": { label: "Servicios", icon: "✦", color: "#6a4b18" },
  "experiencias": { label: "Puntos de actividades", icon: "▲", color: "#8a3046" },
  "trekking": { label: "Senderos", icon: "↟", color: "#3e4b29" },
  "referencia": { label: "Localidades", icon: "●", color: "#233d36" },
} as const

type PointCategory = keyof typeof pointTypes
type Leaflet = typeof import("leaflet")
type MapView = { leaflet: Leaflet; map: LeafletMap; layers: LayerGroup }

const markerPoints = (standalone: boolean): MapPoint[] => published.flatMap((entry) => {
  const location = entry.location
  if (!location?.coordinates || entry.kind === "gastronomia") return []
  return [{ id: entry.kind + ":" + entry.id, name: entry.name, category: entry.kind, location: { ...location, coordinates: location.coordinates }, href: entryHref(entry, standalone) }]
})

const trailLines: MapLine[] = published.flatMap((entry) =>
  entry.kind === "trekking" && entry.track?.length
    ? [{ id: entry.id, name: entry.name, points: entry.track, color: pointTypes.trekking.color }]
    : [],
)

const references: MapPoint[] = [
  { id: "curarrehue", name: "Curarrehue", category: "referencia", location: curarrehue },
  { id: "reigolil", name: "Reigolil", category: "referencia", location: reigolil },
]

export function accessPoints(route: typeof journeys[number]) {
  return [...references, { id: route.id, name: route.origin.label, category: "referencia", location: route.id === "pucon" ? pucon : vilcun }]
}

function pointStyle(category: string) {
  return pointTypes[category as PointCategory] ?? pointTypes.referencia
}

function popup(point: MapPoint) {
  const content = document.createElement("div")
  const title = document.createElement("strong")
  title.textContent = point.name
  content.append(title)

  const location = document.createElement("p")
  location.className = "my-2!"
  location.textContent = point.location.label + (point.location.sectorReference ? " · ubicación referencial" : "")
  content.append(location)

  const external = externalMap(point.location)
  for (const link of [
    { href: point.href, label: "Ver ficha", internal: true },
    { href: external, label: "Abrir en Google Maps", internal: false },
  ]) {
    if (!link.href) continue
    const anchor = document.createElement("a")
    anchor.href = link.href
    anchor.textContent = link.label
    anchor.className = "block min-h-7 font-semibold underline"
    if (link.internal) anchor.dataset.route = ""
    content.append(anchor)
  }
  return content
}

function MapCanvas({ points, lines, selected }: { points: MapPoint[]; lines: MapLine[]; selected?: string }) {
  const host = useRef<HTMLDivElement>(null)
  const pointsById = useRef(new Map<string, Marker>())
  const [view, setView] = useState<MapView>()
  const [failed, setFailed] = useState(false)
  const [tileState, setTileState] = useState<"loading" | "ready" | "unavailable">("loading")

  useEffect(() => {
    let cancelled = false
    let map: LeafletMap | undefined
    let observer: ResizeObserver | undefined
    let timeout: ReturnType<typeof setTimeout> | undefined
    Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css")]).then(([leaflet]) => {
      if (cancelled || !host.current) return
      map = leaflet.map(host.current, {
        scrollWheelZoom: false, zoomControl: false, keyboard: true, fadeAnimation: false,
      }).setView(curarrehue.coordinates, 10)
      leaflet.control.zoom({ zoomInTitle: "Acercar", zoomOutTitle: "Alejar" }).addTo(map)
      map.attributionControl.setPrefix(false)
      const tiles = leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 5, maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      tiles.once("tileload", () => {
        if (timeout) clearTimeout(timeout)
        if (!cancelled) setTileState("ready")
      })
      tiles.addTo(map)
      timeout = setTimeout(() => {
        if (!cancelled) setTileState((current) => current === "ready" ? current : "unavailable")
      }, 5500)
      const layers = leaflet.layerGroup().addTo(map)
      observer = new ResizeObserver(() => map?.invalidateSize({ animate: false, pan: false }))
      observer.observe(host.current)
      setView({ leaflet, map, layers })
    }).catch(() => { if (!cancelled) setFailed(true) })

    return () => {
      cancelled = true
      if (timeout) clearTimeout(timeout)
      observer?.disconnect()
      map?.remove()
    }
  }, [])

  useEffect(() => {
    if (!view) return
    const { leaflet, layers, map } = view
    layers.clearLayers()
    pointsById.current.clear()
    const bounds = leaflet.latLngBounds([])
    lines.forEach((line) => {
      leaflet.polyline(line.points, { color: line.color, weight: 5, opacity: 0.9, interactive: false }).addTo(layers)
      line.points.forEach((point) => bounds.extend(point))
    })
    points.forEach((point) => {
      const style = pointStyle(point.category)
      const symbol = document.createElement("span")
      symbol.setAttribute("aria-hidden", "true")
      symbol.textContent = style.icon
      const marker = leaflet.marker(point.location.coordinates, {
        title: point.name,
        keyboard: true,
        icon: leaflet.divIcon({ className: "maichin-pin", html: symbol, iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -15] }),
      }).bindPopup(popup(point), { closeButton: true, minWidth: 140 }).addTo(layers)
      const element = marker.getElement()
      if (element) {
        element.style.backgroundColor = style.color
        element.setAttribute("aria-label", point.name + " · " + style.label)
        function closeOnEscape(event: KeyboardEvent) {
          if (event.key !== "Escape" || !marker.isPopupOpen()) return
          event.preventDefault()
          event.stopPropagation()
          marker.closePopup()
          element?.focus({ preventScroll: true })
        }
        element.addEventListener("keydown", (event) => {
          closeOnEscape(event)
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault()
            event.stopPropagation()
            marker.openPopup()
            marker.getPopup()?.getElement()?.querySelector<HTMLElement>(".leaflet-popup-content a, .leaflet-popup-close-button")?.focus({ preventScroll: true })
          }
        })
        marker.on("popupopen", () => {
          const panel = marker.getPopup()?.getElement()
          const close = panel?.querySelector<HTMLElement>(".leaflet-popup-close-button")
          close?.setAttribute("aria-label", "Cerrar información")
          if (panel) panel.onkeydown = closeOnEscape
        })
      }
      pointsById.current.set(point.id, marker)
      bounds.extend(point.location.coordinates)
    })
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [25, 30], maxZoom: 13, animate: false })
    else map.setView(curarrehue.coordinates, 10, { animate: false })
  }, [view, points, lines])

  useEffect(() => {
    if (!view || !selected) return
    const marker = pointsById.current.get(selected)
    if (marker) {
      view.map.setView(marker.getLatLng(), Math.max(view.map.getZoom(), 12), { animate: false })
      marker.openPopup()
    }
  }, [selected, view, points, lines])

  return (
    <div className="maichin-map">
      <div ref={host} className={"relative z-0 isolate h-[330px] w-full bg-[#dfe9dc] sm:h-[410px] " + (failed ? "hidden" : "")} role="region" aria-label="Mapa interactivo de la Cuenca del Maichín" />
      {failed ? (
        <p role="status" className="px-4 py-3 text-sm font-semibold text-[#43564a]">El mapa interactivo no está disponible. Puedes seguir usando las fichas y los enlaces a Google Maps.</p>
      ) : tileState !== "ready" && (
        <p role="status" className="px-4 py-3 text-sm font-semibold text-[#43564a]">
          {tileState === "loading" ? "Cargando cartografía…" : "No se pudo cargar el mapa base. Los puntos y trazados siguen disponibles."}
        </p>
      )}
    </div>
  )
}

export function MapPanel({ points, lines, startOpen = false, selected }: { points: MapPoint[]; lines: MapLine[]; startOpen?: boolean; selected?: string }) {
  const [enabled, setEnabled] = useState(startOpen)
  return (
    <div className={surface + " overflow-hidden"} tabIndex={-1} role="group" aria-label="Cartografía de la visita">
      {enabled ? <MapCanvas points={points} lines={lines} selected={selected} /> : (
        <div className="bg-[#e9eee4] p-6 text-center">
          <Icon name="map" className="mx-auto mb-3 h-8 w-8 text-[#1d5a43]" />
          <button type="button" className={primary} onClick={(event) => {
            event.currentTarget.closest<HTMLElement>("[tabindex='-1']")?.focus({ preventScroll: true })
            setEnabled(true)
          }}>Cargar mapa interactivo</button>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-x-4 border-t border-[#173e31]/15 px-4 py-1">
        {lines.length > 0 && <p className="text-xs font-semibold text-[#43564a]">Trazado referencial, sin información de tránsito ni cierres.</p>}
        <a className={textLink} href="https://www.openstreetmap.org/fixthemap">Informar un error del mapa</a>
      </div>
    </div>
  )
}

export function MapPage({ location, replaceLocation, standalone = false }: { location: URL; replaceLocation: (href: string) => void; standalone?: boolean }) {
  const mapArea = useRef<HTMLDivElement>(null)
  const category = location.searchParams.get("categoria") ?? ""
  const routeKey = location.searchParams.get("ruta") ?? ""
  const selected = location.searchParams.get("punto") ?? undefined
  const route = journeys.find((journey) => journey.id === routeKey)
  const journeyPath = useMemo(() => {
    const line = route && journeyLine(route)
    const visibleTrails = !category || category === "trekking" ? trailLines : []
    return line ? [line, ...visibleTrails] : visibleTrails
  }, [route, category])

  const points = useMemo(() => {
    const source = [...markerPoints(standalone), ...(route ? accessPoints(route) : references)]
    const distinct = new Set<string>()
    const selectedPoint = source.find((point) => point.id === selected)
    const inOrder = selectedPoint ? [selectedPoint, ...source.filter((point) => point.id !== selected)] : source
    return inOrder.filter((point) => {
      const coordinate = point.location.coordinates.join(",")
      if ((category && point.category !== category) || distinct.has(coordinate)) return false
      distinct.add(coordinate)
      return true
    })
  }, [category, selected, route, standalone])

  function setOption(key: string, value: string) {
    const params = new URLSearchParams(window.location.search)
    if (key !== "punto") params.delete("punto")
    if (value) params.set(key, value)
    else params.delete(key)
    replaceLocation(maichinHref("mapa", undefined, standalone) + (params.size ? "?" + params : ""))
  }

  function showLocation(point: MapPoint) {
    setOption("punto", point.id)
    mapArea.current?.focus({ preventScroll: true })
    mapArea.current?.scrollIntoView({ block: "start", behavior: "auto" })
  }

  return (
    <section className={container + " py-9 sm:py-14"}>
      <SectionTitle heading="h1" eyebrow={standalone ? "Servicios" : "Cuenca del Maichín"} title="Mapa turístico de la cuenca" body="Filtra los puntos del mapa o selecciona un recorrido de acceso. La lista debajo ofrece otra forma de explorar las ubicaciones." />
      <div className="mt-7 grid max-w-2xl gap-4 sm:grid-cols-2">
        <FilterSelect label="Tipo de ubicación" value={category} options={Object.entries(pointTypes).map(([value, type]) => ({ value, label: type.label }))} onChange={(value) => setOption("categoria", value)} all="Todos los tipos" />
        <FilterSelect label="Ruta de acceso" value={routeKey} options={journeys.map((journey) => ({ value: journey.id, label: "Desde " + journey.origin.label }))} onChange={(value) => setOption("ruta", value)} all="Sin ruta seleccionada" />
      </div>
      <div className="mb-4 mt-4 flex flex-wrap items-center gap-x-4">
        <a href="#puntos-del-mapa" className={textLink}>Saltar a la lista de ubicaciones</a>
        {route && <External href={directions(route)}>Abrir ruta desde {route.origin.label}</External>}
      </div>
      <div ref={mapArea} tabIndex={-1} role="group" aria-label="Vista del mapa">
        <MapPanel points={points} lines={journeyPath} selected={selected} startOpen />
      </div>
      {route && <p className="mt-2 text-xs text-[#43564a]">Trazado estimado con <a href={routeCredits.href} className="underline">{routeCredits.label}</a>.</p>}
      <section id="puntos-del-mapa" tabIndex={-1} aria-labelledby="titulo-ubicaciones" className="mt-8">
        <h2 id="titulo-ubicaciones" className="text-2xl font-extrabold">Ubicaciones</h2>
        <p className="mb-4 mt-2 text-sm font-semibold text-[#43564a]" role="status">{points.length === 1 ? "1 ubicación" : points.length + " ubicaciones"}</p>
        {points.length ? (
          <ul className="grid gap-3 md:grid-cols-2">
            {points.map((point) => {
              const style = pointStyle(point.category)
              const external = externalMap(point.location)
              return (
                <li key={point.id} className={surface + " p-4"}>
                  <h3 className="font-extrabold">{point.name}</h3>
                  <p className="mt-1 text-sm text-[#43564a]"><span aria-hidden="true">{style.icon} </span>{style.label} · {point.location.label}{point.location.sectorReference ? " · Referencia" : ""}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4">
                    <button className={textLink} type="button" aria-pressed={selected === point.id} onClick={() => showLocation(point)}>Mostrar en mapa<span className="sr-only">: {point.name}</span></button>
                    {point.href && <a href={point.href} className={textLink} data-route>Ver ficha<span className="sr-only">: {point.name}</span></a>}
                    {external && <External href={external}>Google Maps<span className="sr-only">: {point.name}</span></External>}
                  </div>
                </li>
              )
            })}
          </ul>
        ) : <EmptyState title="No hay ubicaciones verificadas de este tipo" />}
      </section>
    </section>
  )
}
