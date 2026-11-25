import { useRef, useState } from "react"
import { SectionTitle } from "./ui"

export type GalleryPhoto = {
  thumb: string
  full: string
  alt: string
}

export default function ImageGallery({
  title,
  eyebrow = "",
  photos,
  columns = "lg:grid-cols-2",
  background = "bg-white",
}: {
  title: string
  eyebrow?: string
  photos: GalleryPhoto[]
  columns?: string
  background?: string
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const [index, setIndex] = useState(0)

  function step(direction: number) {
    setIndex((current) => (current + direction + photos.length) % photos.length)
  }

  return (
    <section className={`${background} py-16 sm:py-20`}>
      <div className="mx-auto max-w-[1120px] px-5 lg:px-8">
        <SectionTitle eyebrow={eyebrow} title={title} />
        <div className={`mt-8 grid grid-cols-2 gap-3 sm:gap-5 ${columns}`}>
          {photos.map((photo, position) => (
            <button
              key={photo.full}
              type="button"
              aria-label={`Ampliar foto ${position + 1}: ${photo.alt}`}
              className="group overflow-hidden rounded-2xl bg-[#e9eee4]"
              onClick={(event) => {
                trigger.current = event.currentTarget
                setIndex(position)
                dialog.current?.showModal()
              }}
            >
              <img
                src={photo.thumb}
                alt=""
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover motion-safe:transition-transform motion-safe:group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>
      <dialog
        ref={dialog}
        aria-label={title}
        className="fixed inset-0 m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-5xl rounded-2xl bg-white p-4 text-[#173e31] backdrop:bg-black/75"
        onClose={() => trigger.current?.focus()}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault()
            step(event.key === "ArrowLeft" ? -1 : 1)
          }
        }}
      >
        <div className="mb-3 flex justify-end">
          <button type="button" autoFocus className="min-h-11 px-3 font-semibold" onClick={() => dialog.current?.close()}>Cerrar</button>
        </div>
        <img
          src={photos[index].full}
          alt={photos[index].alt}
          loading="lazy"
          className="max-h-[65dvh] w-full rounded-lg bg-[#e9eee4] object-contain"
        />
        <div className="mt-3 flex items-center justify-between gap-2 text-sm font-semibold">
          <button type="button" className="min-h-11 px-3" onClick={() => step(-1)}>Anterior</button>
          <span role="status">{index + 1} de {photos.length}</span>
          <button type="button" className="min-h-11 px-3" onClick={() => step(1)}>Siguiente</button>
        </div>
      </dialog>
    </section>
  )
}
