import { useRef, useState } from "react"
import { SectionTitle } from "./ui"

const photos = [
  "IMG-20260806-WA0004",
  "IMG-20260806-WA0005",
  "IMG-20261021-WA0010",
  "P1020341",
  "P1020348",
  "P1020354",
  "P1020358",
  "P1020371",
]
const imageDirectory = import.meta.env.BASE_URL + "Images/parque-web/"

export default function ParkGallery() {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const [index, setIndex] = useState(0)

  function step(direction: number) {
    setIndex((current) => (current + direction + photos.length) % photos.length)
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1120px] px-5 lg:px-8">
        <SectionTitle title="Galería del Parque Ecológico Maite Quiñenehuin" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {photos.map((photo, position) => (
            <button
              key={photo}
              type="button"
              aria-label={`Ampliar foto ${position + 1} del Parque Maité`}
              className="group overflow-hidden rounded-2xl bg-[#e9eee4]"
              onClick={(event) => {
                trigger.current = event.currentTarget
                setIndex(position)
                dialog.current?.showModal()
              }}
            >
              <img
                src={imageDirectory + photo + "-mini.webp"}
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
        aria-label="Galería del Parque Ecológico Maite Quiñenehuin"
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
          src={imageDirectory + photos[index] + ".webp"}
          alt={`Foto ${index + 1} del Parque Maité`}
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
