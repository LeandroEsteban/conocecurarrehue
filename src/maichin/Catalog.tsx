import type { FormEvent } from "react"
import { Icon, SectionTitle } from "../components/ui"
import { normalizeSearch } from "../search"
import { conaf, foodPhotos, photos, published } from "./content"
import { MapPanel } from "./Maps"
import { administrations, difficulties, type Access, type Catalog as CatalogName, type Entry, type Provider } from "./model"
import { sections } from "./sections"
import {
  assetHref, ContactActions, container, Credits, DifficultyTag, durationLabel, EmptyState,
  entryHref, External, externalMap, fieldClass, FilterSelect, Gallery, kilometers, maichinHref,
  mapHref, outlined, PhotoImage, primary, Sources, surface, textLink,
} from "./ui"

type Listing = CatalogName | "lugares"

const presetCategories: Partial<Record<CatalogName, string[]>> = {
  alojamiento: ["Cabañas", "Camping", "Hostales", "Hospedajes rurales", "Otros alojamientos"],
  experiencias: ["Caminatas guiadas", "Cabalgatas", "Excursiones", "Recorridos interpretativos", "Experiencias de naturaleza"],
  servicios: ["Gastronomía", "Alojamiento", "Guías turísticos", "Cabalgatas", "Transporte", "Atractivos naturales", "Camping", "Otros servicios"],
}

function photoCollection(entry: Entry) {
  return (entry.kind === "gastronomia" ? foodPhotos : photos).filter((photo) => entry.photoIds?.includes(photo.id))
}

export function EntryCard({ entry, showAdministration = false, standalone = false }: { entry: Entry; showAdministration?: boolean; standalone?: boolean }) {
  const photo = photoCollection(entry)[0]
  const headingText = entry.name
  return (
    <article className={surface + " group relative flex h-full flex-col overflow-hidden shadow-[0_6px_18px_rgba(26,61,47,0.06)]"}>
      {photo && (
        <PhotoImage
          photo={photo}
          sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
          className="aspect-[2/1] w-full object-cover"
        />
      )}
      <div className="flex h-full flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {!photo && <Icon name={sections[entry.kind].icon} className="h-[1.15rem] w-[1.15rem] shrink-0 text-[#1d5a43]" />}
          <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8a3046]">{entry.category}</span>
          {entry.kind === "trekking" && <DifficultyTag level={entry.difficulty} />}
          {showAdministration && entry.kind === "atractivos" && entry.administration && (
            <span className="rounded-full bg-[#edf2e9] px-3 py-1 text-xs font-bold text-[#32563f]">{entry.administration}</span>
          )}
        </div>
        <h3 className="text-xl font-extrabold leading-tight tracking-tight">
          <a href={entryHref(entry, standalone)} data-route className="rounded after:absolute after:inset-0 group-hover:underline group-focus-within:underline">{headingText}</a>
        </h3>
        <p className="text-sm leading-relaxed text-[#43564a]">{entry.summary}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#173e31]/15 pt-3 text-sm">
          {entry.location && <span className="inline-flex items-center gap-1.5 font-semibold text-[#43564a]"><Icon name="pin" className="h-4 w-4 shrink-0" />{entry.location.label}</span>}
          {entry.kind === "trekking" && <span className="text-[#43564a]">{kilometers(entry.distanceKm)} · {durationLabel(entry.durationMinutes)}</span>}
          <span className="ml-auto flex items-center gap-1.5 font-bold text-[#1d5a43]" aria-hidden="true">Ver ficha <Icon name="arrow" className="h-4 w-4" /></span>
        </div>
      </div>
    </article>
  )
}

const distances = [3, 6, 10, 15].map((km) => ({ value: String(km), label: "Hasta " + km + " km" }))
const durations = [60, 120, 240, 360].map((minutes) => ({ value: String(minutes), label: "Hasta " + durationLabel(minutes) }))

function choiceList(options: Iterable<string>) {
  return [...new Set(options)].sort((a, b) => a.localeCompare(b, "es-CL"))
}

export function Catalog({ section, location, replaceLocation, standalone = false }: { section: Listing; location: URL; replaceLocation: (href: string) => void; standalone?: boolean }) {
  if (section === "gastronomia") {
    const foods = published.filter((entry) => entry.kind === "gastronomia")
    return (
      <>
        <section className="border-b border-[#173e31]/10 bg-[#e9eee4] py-10 sm:py-14">
          <div className={container}>
            <SectionTitle heading="h1" eyebrow={standalone ? "Servicios" : "Cuenca del Maichín"} title={sections.gastronomia.title} body={sections.gastronomia.description} />
          </div>
        </section>
        {[
          { title: "Platos típicos", entries: foods.filter((entry) => !entry.venue) },
          { title: "Lugares para comer", entries: foods.filter((entry) => entry.venue) },
        ].map(({ title, entries }) => (
          <section key={title} className={container + " py-8 sm:py-12"}>
            <h2 className="mb-5 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => <EntryCard key={entry.id} entry={entry} standalone={standalone} />)}
            </div>
          </section>
        ))}
      </>
    )
  }
  const isPlaces = section === "lugares"
  const catalogName = isPlaces ? "atractivos" : section
  const all = published.filter((entry) => entry.kind === catalogName ||
    (catalogName === "servicios" && entry.kind === "gastronomia" && entry.venue))
  const categoryInListing = (entry: Entry) => catalogName === "servicios" && entry.kind === "gastronomia" ? "Gastronomía" : entry.category
  const options = choiceList([...all.map(categoryInListing), ...(presetCategories[catalogName] ?? [])])
  const amenities = choiceList(all.flatMap((entry) => entry.kind === "alojamiento" ? (entry.amenities ?? []) : []))
  const search = location.searchParams.get("buscar") ?? ""
  const category = location.searchParams.get("categoria") ?? ""
  const administration = location.searchParams.get("administracion") ?? ""
  const amenity = location.searchParams.get("servicio") ?? ""
  const difficulty = location.searchParams.get("dificultad") ?? ""
  const distance = location.searchParams.get("distancia") ?? ""
  const duration = location.searchParams.get("duracion") ?? ""
  const terms = normalizeSearch(search).split(" ")
  const filtered = all.filter((entry) => {
    const listingCategory = categoryInListing(entry)
    const text = normalizeSearch([entry.name, entry.summary, entry.category, listingCategory, entry.location?.label].filter(Boolean).join(" "))
    if (!terms.every((term) => text.includes(term)) || (category && category !== listingCategory)) return false
    if (entry.kind === "atractivos" && isPlaces && administration) return administration === entry.administration
    if (entry.kind === "alojamiento" && amenity) return entry.amenities?.includes(amenity)
    if (entry.kind === "trekking") {
      return (!difficulty || difficulty === entry.difficulty) &&
        (!distance || entry.distanceKm <= Number(distance)) &&
        (!duration || entry.durationMinutes <= Number(duration))
    }
    return true
  })

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(window.location.search)
    if (value) params.set(key, value)
    else params.delete(key)
    replaceLocation(maichinHref(section, undefined, standalone) + (params.size ? "?" + params : ""))
  }

  function reset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    event.currentTarget.querySelector("input")?.focus()
    replaceLocation(maichinHref(section, undefined, standalone))
  }

  return (
    <>
      <section className="border-b border-[#173e31]/10 bg-[#e9eee4] py-10 sm:py-14">
        <div className={container}>
          <SectionTitle heading="h1" eyebrow={standalone ? "Servicios" : "Cuenca del Maichín"} title={sections[section].title} body={sections[section].description} />
          <form className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="search" aria-label={"Buscar en " + sections[section].title} onSubmit={(event) => event.preventDefault()} onReset={reset}>
            <label className="block min-w-0">
              <span className="mb-2 block text-sm font-bold">Buscar por nombre o sector</span>
              <input type="search" className={fieldClass} value={search} onChange={(event) => setFilter("buscar", event.target.value)} />
            </label>
            {section !== "trekking" && <FilterSelect label={section === "alojamiento" ? "Tipo de alojamiento" : "Categoría"} value={category} options={options} onChange={(value) => setFilter("categoria", value)} all="Todas las categorías" />}
            {isPlaces && <FilterSelect label="Administración" value={administration} options={administrations} onChange={(value) => setFilter("administracion", value)} all="Todas las administraciones" />}
            {section === "alojamiento" && <FilterSelect label="Servicio disponible" value={amenity} options={amenities} onChange={(value) => setFilter("servicio", value)} all="Todos los servicios" />}
            {section === "trekking" && (
              <>
                <FilterSelect label="Dificultad" value={difficulty} options={difficulties} onChange={(value) => setFilter("dificultad", value)} all="Cualquier dificultad" />
                <FilterSelect label="Distancia máxima" value={distance} options={distances} onChange={(value) => setFilter("distancia", value)} all="Cualquier distancia" />
                <FilterSelect label="Duración máxima" value={duration} options={durations} onChange={(value) => setFilter("duracion", value)} all="Cualquier duración" />
              </>
            )}
            {(search || category || administration || amenity || difficulty || distance || duration) && <button type="reset" className={textLink + " self-end"}>Limpiar filtros</button>}
          </form>
        </div>
      </section>
      <section className={container + " py-8 sm:py-12"} aria-label="Resultados del catálogo">
        <h2 className="sr-only">Resultados del catálogo</h2>
        {section === "trekking" && (
          <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Niveles de dificultad">
            {difficulties.map((level) => <DifficultyTag key={level} level={level} />)}
          </div>
        )}
        <p className="mb-5 text-sm font-semibold text-[#43564a]" role="status">
          {filtered.length === 1 ? "1 resultado" : filtered.length + " resultados"}
        </p>
        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => <EntryCard key={entry.id} entry={entry} showAdministration={isPlaces} standalone={standalone} />)}
          </div>
        ) : section === "trekking" && !all.length ? (
          <EmptyState title="Opciones para caminar en la cuenca">
            <p>Para recorrer la zona, elige una actividad guiada o consulta los accesos habilitados con CONAF.</p>
            <div className="mt-2 flex flex-wrap justify-center gap-x-5">
              <a data-route href={maichinHref("experiencias")} className={textLink}>Ver actividades guiadas</a>
              <External href={conaf.href}>Consultar a CONAF</External>
            </div>
          </EmptyState>
        ) : <EmptyState title="Sin resultados para estos filtros"><p>Prueba otra búsqueda o limpia los filtros.</p></EmptyState>}
      </section>
    </>
  )
}

type DetailField = [label: string, value: string | undefined]

function list(values?: string[]) { return values?.length ? values.join(" · ") : undefined }

function accessFields(access?: Access): DetailField[] {
  return [
    ["Condiciones de acceso", access?.conditions], ["Horario", access?.schedule],
    ["Tarifa referencial", access?.price], ["Autorización o reserva", access?.booking],
    ["Restricciones", access?.restrictions], ["Recomendación", access?.advice],
  ]
}

function fieldsFor(entry: Entry): DetailField[] {
  switch (entry.kind) {
    case "atractivos":
      return [
        ["Tipo de administración", entry.administration], ["Administrador", entry.manager],
        ["Servicios", list(entry.amenities)], ...accessFields(entry.access),
      ]
    case "gastronomia":
      return [["Ingredientes principales", list(entry.ingredients)], ["Contexto cultural", entry.context], ["Dónde encontrar", entry.localAvailability]]
    case "alojamiento":
      return [["Tipo de alojamiento", entry.category], ["Capacidad", entry.capacity], ["Servicios", list(entry.amenities)], ["Precio referencial", entry.price]]
    case "trekking":
      return [
        ["Distancia total", kilometers(entry.distanceKm)], ["Duración estimada", durationLabel(entry.durationMinutes)],
        ["Desnivel acumulado", entry.elevationGain === undefined ? undefined : entry.elevationGain + " m"],
        ["Altitud", entry.altitude], ["Dificultad", entry.difficulty], ["Terreno", entry.terrain],
        ["Tipo de recorrido", entry.routeType], ["Inicio", entry.start], ["Término", entry.end],
        ["Temporada recomendada", entry.season], ["Equipamiento", entry.gear], ["Servicios", list(entry.amenities)],
        ...accessFields(entry.access),
      ]
    case "experiencias":
      return [
        ["Tipo de actividad", entry.category], ["Duración", entry.durationMinutes === undefined ? undefined : durationLabel(entry.durationMinutes)],
        ["Dificultad", entry.difficulty], ["Requisitos", entry.requirements], ["Capacidad", entry.capacity],
        ["Equipamiento", entry.gear], ["Precio referencial", entry.price], ["Seguridad", entry.safety],
      ]
    case "servicios":
      return [["Servicio", entry.category], ["Responsable", entry.representative], ["Horario", entry.schedule]]
  }
}

export function EntryDetail({ entry, standalone = false }: { entry: Entry; standalone?: boolean }) {
  const venue = entry.kind === "gastronomia" ? entry.venue : undefined
  const gallery = photoCollection(entry)
  const fields = fieldsFor(entry).filter(([, value]) => value)
  const providers = published.filter((item): item is Provider => item.kind === "servicios" && Boolean(entry.providerIds?.includes(item.id)))
  const related = entry.kind === "servicios" ? published.filter((other) => other.providerIds?.includes(entry.id)) : providers
  const contact = entry.contact ?? providers[0]?.contact
  const location = entry.location
  const external = location && externalMap(location)
  const mapPoint = entry.kind + ":" + entry.id
  const track = entry.kind === "trekking" ? entry.track : undefined
  const booking = entry.kind === "alojamiento" || entry.kind === "experiencias"
  return (
    <>
      <section className="border-b border-[#173e31]/10 bg-[#e9eee4] py-8 sm:py-12">
        <div className={container}>
          <a data-route href={maichinHref(entry.kind, undefined, standalone)} className={textLink}><Icon name="back" className="h-4 w-4" /> Volver a {sections[entry.kind].short.toLocaleLowerCase("es-CL")}</a>
          <div className={"mt-4 grid items-center gap-6 " + (gallery.length ? "lg:grid-cols-2 lg:gap-12" : "")}>
            <div>
              <SectionTitle heading="h1" eyebrow={entry.category} title={entry.name} body={entry.summary} />
              {entry.kind === "trekking" && <div className="mt-4"><DifficultyTag level={entry.difficulty} /></div>}
              {location && !venue && <p className="mt-4 flex items-center gap-2 text-sm font-bold text-[#43564a]"><Icon name="pin" className="h-4 w-4" /> {location.label}</p>}
            </div>
            {gallery[0] && (
              <figure className={surface + " overflow-hidden"}>
                <PhotoImage photo={gallery[0]} eager sizes="(min-width: 1024px) 560px, 100vw" className="aspect-[16/9] w-full object-cover" />
                <figcaption className="px-4 py-3 text-xs text-[#43564a]"><Credits photo={gallery[0]} /></figcaption>
              </figure>
            )}
          </div>
        </div>
      </section>
      <div className={container + " grid gap-6 py-8 sm:py-12 lg:grid-cols-[1.35fr_0.65fr]"}>
        <section className={surface + " min-w-0 p-5 sm:p-7" + (location || contact || venue || related.length ? "" : " lg:col-span-2")}>
          <h2 className="text-2xl font-extrabold tracking-tight">{venue ? "Fotos y mapa" : "Datos de la ficha"}</h2>
          {entry.description && <p className="mt-3 leading-relaxed text-[#43564a]">{entry.description}</p>}
          {venue ? (
            <div className="mt-4 grid gap-4">
              <iframe
                className="h-72 w-full rounded-xl border-0"
                src={venue.mapEmbed}
                title={`Ubicación de ${entry.name} en Google Maps`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div><External href={venue.maps}>Ver fotos en Google Maps</External></div>
            </div>
          ) : fields.length ? (
            <dl className="mt-3 divide-y divide-[#173e31]/15">
              {fields.map(([label, value]) => (
                <div className="grid gap-1 py-3 text-sm sm:grid-cols-[10rem_1fr] sm:gap-3" key={label}>
                  <dt className="font-extrabold">{label}</dt>
                  <dd className="leading-relaxed text-[#43564a]">{value}</dd>
                </div>
              ))}
            </dl>
          ) : <p className="mt-3 leading-relaxed text-[#43564a]">{entry.summary}</p>}
          <Sources sources={entry.sources} />
        </section>
        {(location || contact || venue || related.length > 0) && <aside className={surface + " h-fit min-w-0 p-5 sm:p-7"} aria-label="Ubicación y contactos">
          <h2 className="text-2xl font-extrabold tracking-tight">{entry.kind === "experiencias" ? "Punto de encuentro y contacto" : "Ubicación y contacto"}</h2>
          {location && (
            <p className="mt-3 text-sm text-[#43564a]">{location.label}{location.sectorReference ? " · referencia del sector" : ""}</p>
          )}
          {venue ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <External href={venue.menu} className={primary}>Ver menú</External>
              <External href={venue.whatsapp} className={outlined}>WhatsApp</External>
              <External href={venue.maps} className={outlined}>Google Maps</External>
            </div>
          ) : (location?.coordinates || external) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {location?.coordinates && <a data-route className={outlined} href={mapHref(mapPoint, standalone)}><Icon name="map" className="h-4 w-4" /> Ver en el mapa</a>}
              {external && <External href={external} className={outlined}>Abrir Google Maps</External>}
            </div>
          )}
          {!venue && contact && <div className="mt-5 border-t border-[#173e31]/15 pt-4">
            <ContactActions contact={contact} availability={booking} />
          </div>}
          {related.length > 0 && (
            <div className="mt-5 border-t border-[#173e31]/15 pt-4">
              <h3 className="text-sm font-extrabold">{providers.length ? "Prestadores" : "Servicios relacionados"}</h3>
              <ul>
                {related.map((item) => <li key={entryHref(item, standalone)}><a data-route className={textLink} href={entryHref(item, standalone)}>{item.name}</a></li>)}
              </ul>
            </div>
          )}
        </aside>}
      </div>
      {entry.kind === "trekking" && (track?.length || entry.gpx) ? (
        <section className={container + " pb-10"}>
          <h2 className="mb-4 text-2xl font-extrabold">Recorrido del sendero</h2>
          {track?.length ? <MapPanel points={[]} lines={[{ id: entry.id, name: entry.name, points: track, color: "#8a3046" }]} /> : null}
          {entry.gpx && <a href={assetHref(entry.gpx)} download className={primary + " mt-4"}>Descargar recorrido GPX</a>}
        </section>
      ) : null}
      {gallery.length > 0 && <section className={container + " pb-10 sm:pb-16"}>
        <h2 className="mb-5 text-2xl font-extrabold tracking-tight">Galería de la ficha</h2>
        <Gallery photos={gallery} />
      </section>}
    </>
  )
}
