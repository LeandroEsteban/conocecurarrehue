import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { Icon } from "../components/ui"
import { sectionHref, serviceHref } from "../navigation"
import type { Contact, Difficulty, Entry, Location, Photo, Source } from "./model"
import { hasStandaloneService, type MaichinSection } from "./sections"

export const container = "mx-auto w-full max-w-[1240px] px-5 lg:px-8"
export const surface = "rounded-[24px] border border-[#173e31]/15 bg-white"
export const primary = "inline-flex min-h-11 w-fit max-w-full items-center justify-center gap-2 rounded-full bg-[#1d5a43] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#143f30]"
export const outlined = "inline-flex min-h-11 w-fit max-w-full items-center justify-center gap-2 rounded-full border border-[#65796b] bg-white px-5 py-2.5 text-sm font-bold text-[#173e31] transition hover:bg-[#edf2e9]"
export const textLink = "inline-flex min-h-11 w-fit items-center gap-2 rounded text-sm font-bold text-[#1d5a43] underline underline-offset-4"
export const fieldClass = "min-h-12 w-full min-w-0 rounded-xl border border-[#737e75] bg-white px-3 py-2 text-base text-[#173e31] placeholder:text-[#526059]"

export function maichinHref(section?: MaichinSection, id?: string, standalone = false) {
  const base = sectionHref("maichin")
  if (!section) return base
  const path = standalone && hasStandaloneService(section) ? serviceHref(section) : base + "/" + section
  return path + (id ? "/" + encodeURIComponent(id) : "")
}

export function entryHref(entry: Entry, standalone = false) {
  return maichinHref(entry.kind, entry.id, standalone)
}

export function mapHref(point: string, standalone = false) {
  return maichinHref("mapa", undefined, standalone) + "?" + new URLSearchParams({ punto: point })
}

export function externalMap(location: Location) {
  const query = location.mapQuery ?? (!location.sectorReference ? location.coordinates?.join(",") : undefined)
  return query ? "https://www.google.com/maps/search/?" + new URLSearchParams({ api: "1", query }) : undefined
}

export function assetHref(file: string) {
  return import.meta.env.BASE_URL + file.replace(/^\//, "")
}

export function photoHref(photo: Photo, width: number) {
  return assetHref("maichin/" + photo.file + "-" + width + ".webp")
}

export function External({ href, children, className = textLink }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} className={className}>{children}</a>
}

export function FilterSelect({
  label, value, options, onChange, all = "Todas las opciones",
}: {
  label: string
  value: string
  options: readonly (string | { value: string; label: string })[]
  onChange: (value: string) => void
  all?: string | false
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>
        {all !== false && <option value="">{all}</option>}
        {options.map((entry) => {
          const option = typeof entry === "string" ? { value: entry, label: entry } : entry
          return <option key={option.value} value={option.value}>{option.label}</option>
        })}
      </select>
    </label>
  )
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#748878] bg-[#edf2e9] px-5 py-9 text-center">
      <Icon name="compass" className="mx-auto mb-3 h-7 w-7 text-[#1d5a43]" />
      <p className="font-extrabold text-[#173e31]">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#43564a]">{children}</div>}
    </div>
  )
}

export function DifficultyTag({ level }: { level: Difficulty }) {
  const styles = {
    Baja: "bg-[#e2efe2] text-[#19472f]",
    Media: "bg-[#f9e8b9] text-[#654600]",
    Alta: "bg-[#f5dce0] text-[#7d253a]",
  }
  return (
    <span className={"inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold " + styles[level]}>
      <Icon name="mountain" className="h-4 w-4" /> Dificultad {level.toLocaleLowerCase("es-CL")}
    </span>
  )
}

export function durationLabel(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return [hours ? hours + " h" : "", rest || !hours ? rest + " min" : ""].filter(Boolean).join(" ")
}

export function kilometers(value: number) {
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 1 }).format(value) + " km"
}

export function Sources({ sources, title = "Fuentes de la ficha" }: { sources: Source[]; title?: string }) {
  if (!sources.length) return null
  return (
    <div className="mt-6 border-t border-[#173e31]/15 pt-4 text-sm">
      <p className="font-bold">{title}</p>
      <ul className="flex flex-wrap gap-x-5">
        {sources.map((source) => <li key={source.href}><External href={source.href}>{source.label}</External></li>)}
      </ul>
    </div>
  )
}

export function ContactActions({ contact, availability = false }: { contact: Contact; availability?: boolean }) {
  const whatsapp = contact.whatsapp ? "https://wa.me/" + contact.whatsapp.replace(/\D/g, "") : undefined
  const phone = contact.phone ? "tel:" + contact.phone.replace(/[^\d+]/g, "") : undefined
  const email = contact.email ? "mailto:" + contact.email : undefined
  const actions = [
    { href: whatsapp, label: "WhatsApp" },
    { href: phone, label: "Llamar" },
    { href: email, label: "Enviar correo" },
    { href: contact.website, label: "Sitio web" },
    ...(contact.social ?? []),
  ].filter((action): action is Source => Boolean(action.href))

  return actions.length > 0 && (
    <div className="flex flex-wrap gap-x-3 gap-y-2">
      {actions.map((action, index) => (
        <External key={action.href} href={action.href} className={index === 0 ? primary : outlined}>
          {index === 0 && availability ? "Consultar disponibilidad" : action.label}
        </External>
      ))}
    </div>
  )
}

export function PhotoImage({
  photo, sizes, className, eager = false, full = false,
}: {
  photo: Photo
  sizes: string
  className: string
  eager?: boolean
  full?: boolean
}) {
  const [failed, setFailed] = useState(false)
  if (failed) return <p className={"grid place-items-center bg-[#e3ebe0] p-5 text-center text-[#43564a] " + className}>Imagen temporalmente no disponible.</p>
  const fallback = full ? photo.widths[photo.widths.length - 1] : photo.widths[Math.min(1, photo.widths.length - 1)]
  return (
    <img
      alt={photo.alt}
      src={photoHref(photo, fallback)}
      srcSet={photo.widths.map((width) => photoHref(photo, width) + " " + width + "w").join(", ")}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager && !full ? "high" : "auto"}
      decoding="async"
      className={className}
      onError={() => setFailed(true)}
    />
  )
}

export function Credits({ photo }: { photo: Photo }) {
  return (
    <>
      {photo.credit}
      {photo.license && <> · <a href={photo.license.href} className="rounded underline underline-offset-4">{photo.license.label}</a></>}
      {photo.source && <> · <a href={photo.source.href} className="rounded underline underline-offset-4">{photo.source.label}</a></>}
      {" · Adaptada a WebP y redimensionada."}
    </>
  )
}

export function Gallery({ photos }: { photos: Photo[] }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const title = useId()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const index = photos.findIndex((photo) => photo.id === selectedId)
  const current = photos[index]
  const hasSelection = Boolean(current)

  useEffect(() => {
    const element = dialog.current
    if (!hasSelection || !element) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    if (!element.open) element.showModal()
    return () => {
      document.body.style.overflow = previousOverflow
      if (element.open) element.close()
    }
  }, [hasSelection])

  if (!photos.length) return <EmptyState title="Fotografías pendientes de incorporación"><p>Esta galería se completará con imágenes autorizadas del lugar.</p></EmptyState>

  function step(direction: number) {
    setSelectedId(photos[(index + direction + photos.length) % photos.length].id)
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <figure key={photo.id} className={surface + " overflow-hidden"}>
            <button
              type="button"
              onClick={(event) => { trigger.current = event.currentTarget; setSelectedId(photo.id) }}
              aria-label={"Ampliar fotografía: " + photo.caption}
              className="relative block w-full overflow-hidden text-left focus-visible:outline-offset-[-4px]"
            >
              <PhotoImage photo={photo} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="aspect-[3/2] w-full object-cover transition duration-300 hover:scale-[1.02]" />
              <span aria-hidden="true" className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white text-[#173e31]">
                <Icon name="plus" />
              </span>
            </button>
            <figcaption className="px-4 py-3 text-xs leading-relaxed text-[#43564a]">
              <p className="mb-1 text-sm font-bold text-[#173e31]">{photo.caption}</p>
              <Credits photo={photo} />
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        aria-labelledby={title}
        className="fixed inset-0 m-auto max-h-[92dvh] w-[min(56rem,calc(100%-1.5rem))] overflow-auto rounded-[24px] border border-[#173e31]/20 bg-white p-4 text-[#173e31] backdrop:bg-black/75 sm:p-5"
        onClose={() => { setSelectedId(null); trigger.current?.focus() }}
        onKeyDown={(event) => {
          if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && photos.length > 1) {
            event.preventDefault()
            step(event.key === "ArrowLeft" ? -1 : 1)
          }
        }}
      >
        {current && (
          <>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p id={title} className="font-extrabold">Fotografía ampliada</p>
              <button type="button" autoFocus className={outlined} onClick={() => dialog.current?.close()} aria-label="Cerrar fotografía">
                <Icon name="close" />
              </button>
            </div>
            <figure>
              <PhotoImage key={current.id} photo={current} full eager sizes="(min-width: 960px) 860px, 90vw" className="max-h-[60dvh] w-full rounded-xl bg-[#edf2e9] object-contain" />
              <figcaption className="mt-3 text-sm leading-relaxed text-[#43564a]">
                <p className="font-bold text-[#173e31]">{current.caption}</p>
                <Credits photo={current} />
              </figcaption>
            </figure>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              {photos.length > 1 && <button type="button" className={outlined} onClick={() => step(-1)}>Anterior</button>}
              <p className="text-sm font-semibold" role="status">{index + 1} de {photos.length}</p>
              {photos.length > 1 && <button type="button" className={outlined} onClick={() => step(1)}>Siguiente</button>}
            </div>
          </>
        )}
      </dialog>
    </>
  )
}
