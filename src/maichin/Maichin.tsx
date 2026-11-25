import { useId, useLayoutEffect, useRef, useState } from "react"
import { Icon, SectionTitle } from "../components/ui"
import { Catalog, EntryCard, EntryDetail } from "./Catalog"
import { featuredAttractions, featuredExperiences, history, photos, published, visitAdvice } from "./content"
import { directions, embeddedDirections, journeys, routeCredits } from "./journeys"
import { MapPage } from "./Maps"
import { catalogs, isMaichinSection, maichinDescription, maichinTitle, sections, type MaichinSection } from "./sections"
import {
  container, Credits, durationLabel, External, FilterSelect, Gallery, kilometers,
  maichinHref, outlined, PhotoImage, primary, Sources, surface, textLink,
} from "./ui"
import "./map.css"

interface MaichinProps {
  location: URL
  path: readonly string[]
  standalone?: boolean
  focusOnEntry: boolean
  focusContent: () => void
  replaceLocation: (href: string) => void
}

const sectionKeys = Object.keys(sections) as MaichinSection[]

function SectionLinks({ active }: { active: MaichinSection }) {
  return sectionKeys.map((section) => (
    <a
      key={section}
      data-route
      aria-current={section === active ? "page" : undefined}
      href={maichinHref(section)}
      className={"inline-flex min-h-11 items-center rounded-full px-3 text-sm font-bold " + (
        section === active ? "bg-[#1d5a43] text-white" : "text-[#43564a] hover:bg-[#e6ede3]"
      )}
    >
      {sections[section].short}
    </a>
  ))
}

function SectionNavigation({ active, pathname }: { active: MaichinSection; pathname: string }) {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const navigationId = useId()
  useLayoutEffect(() => { setOpen(false) }, [pathname])
  return (
    <div className="border-b border-[#173e31]/15 bg-[#f8f6ef]">
      <div className={container + " flex flex-wrap items-center justify-between gap-x-5 gap-y-1 py-2"}>
        <a data-route className={textLink} href={maichinHref()}><Icon name="back" className="h-4 w-4" /> Portada del Maichín</a>
        <button
          type="button"
          ref={toggle}
          aria-expanded={open}
          aria-controls={navigationId}
          className={outlined + " xl:hidden"}
          onClick={() => setOpen((value) => !value)}
        >
          Secciones de la cuenca <Icon name={open ? "minus" : "plus"} className="h-4 w-4" />
        </button>
        <nav
          id={navigationId}
          aria-label="Secciones de la Cuenca del Maichín"
          className={(open ? "flex" : "hidden") + " w-full flex-wrap items-center gap-1 xl:flex xl:w-auto"}
          onClick={(event) => {
            if (event.target instanceof Element && event.target.closest("a")) setOpen(false)
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && open && toggle.current?.getClientRects().length) {
              setOpen(false)
              toggle.current.focus()
            }
          }}
        >
          <SectionLinks active={active} />
        </nav>
      </div>
    </div>
  )
}

function Featured({ title, section, ids }: { title: string; section: "atractivos" | "experiencias"; ids: string[] }) {
  const records = ids.flatMap((id) => {
    const record = published.find((entry) => entry.kind === section && entry.id === id)
    return record ? [record] : []
  })
  if (!records.length) return null
  return (
    <section className={container + " py-8 sm:py-12"}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-5 gap-y-2">
        <h2 className="text-balance text-3xl font-extrabold leading-tight tracking-[-0.04em] sm:text-4xl">{title}</h2>
        <a data-route href={maichinHref(section)} className={textLink}>Ver {sections[section].short.toLocaleLowerCase("es-CL")} <Icon name="arrow" className="h-4 w-4" /></a>
      </div>
      <div className={"grid gap-5 sm:grid-cols-2 " + (section === "atractivos" ? "lg:grid-cols-3" : "")}>
        {records.map((entry) => <EntryCard key={entry.id} entry={entry} />)}
      </div>
    </section>
  )
}

function MaichinHome() {
  const hero = photos.find((photo) => photo.id === "panorama-cuenca")
  return (
    <>
      <section className="bg-[#173e31] py-9 text-white sm:py-12 lg:py-16">
        <div className={container + " grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12"}>
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#f5e7b0]">
              <Icon name="pin" className="h-4 w-4 shrink-0" /> Curarrehue, La Araucanía
            </p>
            <h1 className="text-balance text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[1.03] tracking-[-0.06em]">{maichinTitle}</h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/90 sm:text-lg">{maichinDescription}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a data-route href={maichinHref("atractivos")} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f5e7b0] px-5 py-2.5 text-sm font-extrabold text-[#173e31] transition hover:bg-white">Explorar atractivos <Icon name="arrow" className="h-4 w-4" /></a>
              <a data-route href={maichinHref("historia-y-como-llegar")} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/70 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#275442]"><Icon name="compass" className="h-4 w-4" /> Planificar mi visita</a>
            </div>
          </div>
          {hero && (
            <figure className="overflow-hidden rounded-[24px] bg-[#102f25]">
              <PhotoImage photo={hero} eager sizes="(min-width: 1240px) 650px, (min-width: 1024px) 55vw, 100vw" className="aspect-[16/10] w-full object-cover object-[center_48%]" />
              <figcaption className="px-4 py-3 text-xs leading-relaxed text-white/90">
                <strong className="block text-sm text-white">{hero.caption}</strong>
                <Credits photo={hero} />
              </figcaption>
            </figure>
          )}
        </div>
      </section>
      <section className="border-b border-[#173e31]/15 bg-[#e9eee4] py-7 sm:py-10">
        <div className={container}>
          <h2 className="mb-4 text-2xl font-extrabold tracking-tight">Planifica tu visita</h2>
          <nav aria-label="Explorar la Cuenca del Maichín" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {sectionKeys.map((section) => (
              <a
                key={section}
                data-route
                href={maichinHref(section)}
                className={surface + " flex min-h-14 items-center gap-2 px-3 py-2 text-sm font-extrabold text-[#173e31] transition hover:bg-[#f4f8f0] sm:px-4"}
              >
                <Icon name={sections[section].icon} className="h-5 w-5 shrink-0 text-[#1d5a43]" />
                {sections[section].short}
              </a>
            ))}
          </nav>
        </div>
      </section>
      <Featured title="Atractivos destacados" section="atractivos" ids={featuredAttractions} />
      <Featured title="Experiencias guiadas" section="experiencias" ids={featuredExperiences} />
      <section className="bg-[#e9eee4] py-9 sm:py-12">
        <div className={container}>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">El territorio en imágenes</h2>
            <a data-route href={maichinHref("galeria")} className={textLink}>Ver la galería <Icon name="arrow" className="h-4 w-4" /></a>
          </div>
          <Gallery photos={photos.slice(0, 3)} />
        </div>
      </section>
    </>
  )
}

function HistoryAndAccess() {
  const [routeId, setRouteId] = useState(journeys[0].id)
  const selected = journeys.find((journey) => journey.id === routeId) ?? journeys[0]

  return (
    <section className={container + " py-9 sm:py-14"}>
      <SectionTitle heading="h1" eyebrow="Cuenca del Maichín" title={sections["historia-y-como-llegar"].title} body="Conoce el territorio y revisa los itinerarios de referencia para llegar a Reigolil desde Pucón y Vilcún." />
      <div className="mt-7 flex flex-wrap gap-3">
        <a href="#rutas-de-acceso" className={primary}>Ver rutas de acceso</a>
        <a data-route href={maichinHref("mapa")} className={outlined}>Abrir mapa turístico</a>
      </div>
      <div className="mt-9 grid gap-4 lg:grid-cols-3">
        {history.map((item) => (
          <section key={item.title} className={surface + " p-5 sm:p-6"}>
            <h2 className="text-xl font-extrabold leading-tight tracking-tight">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#43564a]">{item.text}</p>
            <Sources sources={item.sources} title="Referencia" />
          </section>
        ))}
      </div>
      <section id="rutas-de-acceso" tabIndex={-1} className="mt-10 sm:mt-14" aria-labelledby="rutas-heading">
        <h2 id="rutas-heading" className="text-3xl font-extrabold tracking-tight">Cómo llegar a Reigolil</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-[#43564a]">Tiempos en automóvil estimados sobre la red vial de OpenStreetMap. Los accesos a predios, reservas y actividades se confirman con sus administradores.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {journeys.map((journey) => (
            <article key={journey.id} className={surface + " p-5 sm:p-6"}>
              <h3 className="mb-2 text-xl font-extrabold">Desde {journey.origin.label}</h3>
              <p className="text-sm font-extrabold text-[#8a3046]">
                {journey.distanceKm !== undefined && journey.durationMinutes !== undefined
                  ? kilometers(journey.distanceKm) + " · " + durationLabel(journey.durationMinutes) + " aprox."
                  : "Consulta la estimación en el servicio de navegación."}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#43564a]">{journey.roads}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#43564a]">{journey.advice}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <External href={directions(journey)} className={primary}>Abrir ruta en Google Maps<span className="sr-only"> desde {journey.origin.label}</span></External>
                <a data-route href={maichinHref("mapa") + "?ruta=" + journey.id} className={outlined}>Ver en mapa<span className="sr-only"> la ruta desde {journey.origin.label}</span></a>
              </div>
              <Sources sources={[journey.source, routeCredits]} title="Referencias" />
            </article>
          ))}
        </div>
        <div className="mb-3 mt-6 max-w-xs">
          <FilterSelect label="Trazado en el mapa" value={routeId} options={journeys.map((journey) => ({ value: journey.id, label: "Desde " + journey.origin.label }))} all={false} onChange={(value) => { if (value === "pucon" || value === "vilcun") setRouteId(value) }} />
        </div>
        {selected.durationMinutes !== undefined && (
          <p role="status" className="mb-3 text-sm font-semibold text-[#43564a] sm:hidden">
            Tiempo referencial en automóvil · {durationLabel(selected.durationMinutes)}
          </p>
        )}
        <div className={surface + " overflow-hidden bg-[#e9eee4]"}>
          <iframe
            src={embeddedDirections(selected)}
            title={`Ruta en automóvil desde ${selected.origin.label} hasta Reigolil en Google Maps`}
            className="block h-96 w-full border-0 sm:h-[28rem]"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>
      <section className="mt-8 rounded-[24px] bg-[#e9eee4] p-5 sm:p-7">
        <h2 className="text-2xl font-extrabold tracking-tight">Antes de salir</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#43564a]">
          {visitAdvice.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    </section>
  )
}

function GalleryPage() {
  const [place, setPlace] = useState("")
  const [category, setCategory] = useState("")
  const visible = photos.filter((photo) => (!place || photo.place === place) && (!category || photo.category === category))
  return (
    <section className={container + " py-9 sm:py-14"}>
      <SectionTitle heading="h1" eyebrow="Cuenca del Maichín" title={sections.galeria.title} body={sections.galeria.description} />
      <div className="mb-5 mt-7 grid max-w-2xl gap-4 sm:grid-cols-2">
        <FilterSelect label="Lugar" value={place} options={[...new Set(photos.map((photo) => photo.place))]} all="Todos los lugares" onChange={setPlace} />
        <FilterSelect label="Categoría de fotografía" value={category} options={[...new Set(photos.map((photo) => photo.category))]} all="Todas las categorías" onChange={setCategory} />
      </div>
      <p role="status" className="mb-4 text-sm font-semibold text-[#43564a]">{visible.length === 1 ? "1 fotografía" : visible.length + " fotografías"}</p>
      <Gallery photos={visible} />
    </section>
  )
}

function pageIdentifier(path: readonly string[]) {
  const [first, id] = path
  const section = first && isMaichinSection(first) ? first : undefined
  let entry = undefined
  if (section && id && path.length === 2) {
    try {
      const decoded = decodeURIComponent(id)
      entry = published.find((record) => record.kind === section && record.id === decoded)
    } catch {
      entry = undefined
    }
  }
  return { section, entry, valid: !path.length || Boolean(section && (path.length === 1 || entry)) }
}

export default function Maichin({ location, path, replaceLocation, focusOnEntry, focusContent, standalone = false }: MaichinProps) {
  const { section, entry, valid } = pageIdentifier(path)
  const title = !valid ? "Página del Maichín no encontrada" : entry?.name ?? (section ? sections[section].title : maichinTitle)
  const description = entry?.summary ?? (section ? sections[section].description : maichinDescription)

  useLayoutEffect(() => {
    document.title = title + " | Curarrehue · Territorio Vivo"
    const updates = [
      [document.querySelector<HTMLMetaElement>('meta[name="description"]'), description],
      [document.querySelector<HTMLMetaElement>('meta[property="og:title"]'), title],
      [document.querySelector<HTMLMetaElement>('meta[property="og:description"]'), description],
    ] as const
    updates.forEach(([meta, value]) => { if (meta) meta.content = value })
  }, [title, description])

  useLayoutEffect(() => {
    if (focusOnEntry) focusContent()
  }, [focusOnEntry, location.pathname, focusContent])

  return (
    <main id="contenido" tabIndex={-1}>
      {section && !standalone && <SectionNavigation active={section} pathname={location.pathname} />}
      {!valid ? (
        <section className={container + " min-h-[45vh] py-12"}>
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <a data-route href={maichinHref()} className={primary + " mt-5"}>Ir a la portada del Maichín</a>
        </section>
      ) : entry ? <EntryDetail entry={entry} standalone={standalone} key={location.pathname} /> :
        !section ? <MaichinHome /> :
        section === "historia-y-como-llegar" ? <HistoryAndAccess /> :
        section === "galeria" ? <GalleryPage /> :
        section === "mapa" ? <MapPage standalone={standalone} location={location} replaceLocation={replaceLocation} /> :
        (section === "lugares" || catalogs.includes(section)) && <Catalog standalone={standalone} key={section} section={section} location={location} replaceLocation={replaceLocation} />
      }
    </main>
  )
}
