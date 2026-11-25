import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react"
import {
  catalogFilters,
  catalogHref,
  currentPage,
  projectHref,
  sectionHref,
  serviceHref,
  type CatalogFilters,
  type Section,
} from "./navigation"
import {
  categories,
  images,
  imageSources,
  projects,
  type Project,
} from "./projects"
import { Icon, SectionTitle } from "./components/ui"
import ImageGallery from "./components/ImageGallery"
import ParkGallery from "./components/ParkGallery"
import { serviceLinks } from "./maichin/sections"
import siteConfiguration from "../.figma/make/site.json"

const Maichin = lazy(() => import("./maichin/Maichin"))

interface NavigationItem {
  label: string
  page: Section
}

const navigation: NavigationItem[] = [
  { label: "Inicio", page: "home" },
  { label: "Proyectos", page: "projects" },
  { label: "Cuenca del Maichín", page: "maichin" },
  { label: "Sobre la iniciativa", page: "about" },
]
function Logo({
  inverse = false,
  onClick,
}: {
  inverse?: boolean
  onClick?: () => void
}) {
  return (
    <a
      data-route
      href={sectionHref("home")}
      onClick={onClick}
      aria-label="ConoceCurarrehue, inicio"
      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded text-left sm:gap-3"
    >
      <img
        src={import.meta.env.BASE_URL + "Images/Logo_ConoceCurarrehue.png"}
        alt=""
        width={1254}
        height={1254}
        className="h-11 w-14 shrink-0 object-cover object-top"
      />
      <strong
        className={
          "block text-[17px] leading-none tracking-[-0.02em] " +
          (inverse ? "text-white" : "text-[#173e31]")
        }
      >
        ConoceCurarrehue
      </strong>
    </a>
  )
}

function ServicesMenu({ active, onNavigate }: { active?: string; onNavigate?: () => void }) {
  const menu = useRef<HTMLDetailsElement>(null)
  return (
    <details
      ref={menu}
      className="group relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !event.currentTarget.open) return
        event.stopPropagation()
        event.currentTarget.open = false
        event.currentTarget.querySelector("summary")?.focus()
      }}
    >
      <summary className={`flex cursor-pointer list-none items-center gap-2 rounded py-3 text-lg font-semibold text-[#173e31] focus-visible:outline-2 lg:text-[13px] lg:font-bold ${active ? "underline decoration-[#a23e54] decoration-2 underline-offset-[9px]" : ""}`}>
        Servicios
        <span aria-hidden="true" className="h-2 w-2 -translate-y-0.5 rotate-45 border-b border-r transition-transform group-open:rotate-[225deg]" />
      </summary>
      <ul className="min-w-44 rounded-xl border border-[#173e31]/15 bg-[#f8f6ef] p-2 lg:absolute lg:right-0 lg:top-full lg:shadow-lg">
        {serviceLinks.map(([label, slug]) => (
          <li key={slug}>
            <a
              data-route
              href={serviceHref(slug)}
              aria-current={active === slug ? "page" : undefined}
              className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-[#173e31] hover:bg-[#e9eee4] aria-[current=page]:bg-[#e9eee4]"
              onClick={() => {
                if (menu.current) menu.current.open = false
                onNavigate?.()
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}

function Header({ page, activeService }: { page: ReturnType<typeof currentPage>["kind"]; activeService?: string }) {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  return (
    <header
      className="sticky top-0 z-50 border-b border-[#173e31]/10 bg-[#f8f6ef]"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false)
          menuButton.current?.focus()
        }
      }}
    >
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <Logo onClick={() => setOpen(false)} />
        <nav
          className="ml-auto hidden items-center gap-5 lg:flex xl:gap-8"
          aria-label="Navegación principal"
        >
          {navigation.map((link) => (
            <a
              key={link.page}
              data-route
              href={sectionHref(link.page)}
              aria-current={page === link.page && !activeService ? "page" : undefined}
              className={`nav-link ${
                (page === link.page && !activeService) ||
                (page === "detail" && link.page === "projects")
                  ? "active"
                  : ""
              }`}
            >
              {link.label}
            </a>
          ))}
          <ServicesMenu active={activeService} />
        </nav>
        <button
          type="button"
          ref={menuButton}
          onClick={() => setOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-full border border-[#173e31]/15 lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="menu-movil"
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      <nav
        id="menu-movil"
        hidden={!open}
        aria-label="Navegación principal"
        className="max-h-[calc(100svh-76px)] overflow-y-auto border-t border-[#173e31]/10 bg-[#f8f6ef] px-5 py-3 lg:hidden"
      >
        {navigation.map((link) => (
          <a
            key={link.page}
            data-route
            href={sectionHref(link.page)}
            onClick={() => setOpen(false)}
            aria-current={page === link.page && !activeService ? "page" : undefined}
            className="block w-full border-b border-[#173e31]/10 py-3 text-left text-lg font-semibold text-[#173e31] aria-[current=page]:underline"
          >
            {link.label}
          </a>
        ))}
        <ServicesMenu active={activeService} onNavigate={() => setOpen(false)} />
      </nav>
    </header>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#173e31]/10 bg-white shadow-[0_8px_30px_rgba(26,61,47,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(26,61,47,0.13)]"
    >
      <div className="h-56 overflow-hidden">
        <img
          src={project.image}
          srcSet={imageSources(project.image)}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="mb-4 w-fit rounded-full bg-[#edf2e9] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#356049]">
          {project.category}
        </span>
        <h3 className="text-xl font-semibold leading-tight tracking-[-0.025em] text-[#173e31]">
          {project.name}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#667067]">
          {project.description}
        </p>
        <div className="mt-auto flex items-center justify-end pt-6">
          <a
            data-route
            href={projectHref(project.id)}
            className="flex min-h-11 items-center gap-2 rounded text-sm font-extrabold text-[#1d5a43] after:absolute after:inset-0 after:content-[''] group-hover:text-[#a23e54]"
          >
            Conocer más<span className="sr-only"> sobre {project.name}</span>
            <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  )
}

const portadaImages = ["portada-1.webp", "portada-2.webp", "portada-3.webp"]

const imagePath = (name: string) => import.meta.env.BASE_URL + "Images/" + name

const galleryPhoto = (name: string) => {
  const base = imagePath("galeria-web/" + name)
  return { thumb: base + "-mini.jpg", full: base + "-full.jpg" }
}

const aboutGalleryPhotos = [
  ["Puente1", "Puente Colgante Aguas Blancas"],
  ["Puente2", "Pasarela del Puente Colgante Aguas Blancas"],
  ["IMG-20261021-WA0010", "Río caudaloso visto desde el puente"],
  ["Portada1", "Humedal y cordillera en Curarrehue"],
  ["Portada2", "Volcán nevado sobre el bosque nativo"],
  ["Portada3", "Río de montaña entre vegetación nativa"],
  ["P1020371", "Estero con piedras y troncos en el bosque"],
  ["P1020341", "Río entre árboles nativos"],
  ["P1020354", "Ladera cubierta de bosque nativo"],
  ["P1020348", "Bosque nativo en el Parque Ecológico Maite Quiñenehuin"],
  ["P1020358", "Pradera con árbol nativo y montaña de fondo"],
  ["IMG-20260806-WA0004", "Bosque y viviendas cubiertas de nieve"],
  ["IMG-20260806-WA0005", "Campo nevado en Curarrehue"],
  ["FotoCuenca2", "Vista aérea de la cuenca del Maichín en otoño"],
].map(([name, alt]) => ({ ...galleryPhoto(name), alt }))

function PortadaPhotos() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % portadaImages.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [playing])

  return (
    <>
      <div className="absolute inset-0 isolate" aria-hidden="true">
        {portadaImages.map((name, index) => (
          <img
            key={name}
            src={import.meta.env.BASE_URL + "Images/" + name}
            alt=""
            fetchPriority={index === 0 ? "high" : "low"}
            data-active={index === active}
            className="portada-slide absolute inset-0 h-full w-full object-cover"
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => setPlaying((value) => !value)}
        aria-label={playing ? "Pausar fotos de portada" : "Reproducir fotos de portada"}
        className="absolute bottom-4 right-5 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-[#102f25] text-white lg:bottom-6 lg:right-8"
      >
        <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
      </button>
    </>
  )
}

function PortadaVideo() {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const element = video.current
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      void element.play().then(() => observer.disconnect(), () => undefined)
    }, { threshold: 0.35 })
    observer.observe(element)
    return () => {
      observer.disconnect()
      element.pause()
    }
  }, [])

  return (
    <section aria-label="Video de Curarrehue" className="bg-[#102f25] py-8 sm:py-12">
      <div className="mx-auto max-w-[1120px] px-5 lg:px-8">
        <video
          ref={video}
          src={import.meta.env.BASE_URL + "Images/VideoPortada.MP4"}
          aria-label="Video de presentación de Curarrehue"
          loop
          muted
          playsInline
          preload="none"
          poster={import.meta.env.BASE_URL + "Images/portada-1.webp"}
          className="aspect-video w-full rounded-[24px] bg-black object-contain"
        >
          Tu navegador no admite la reproducción de este video.
        </video>
      </div>
    </section>
  )
}

function Home() {
  const carousel = useRef<HTMLUListElement>(null)
  const drag = useRef<{ x: number; left: number; id: number; moved: boolean } | null>(null)
  const skipClick = useRef(false)

  function moveProjects(direction: -1 | 1) {
    const list = carousel.current
    if (!list) return
    const [first, second] = list.children
    if (!first || !second) return
    const step = second.getBoundingClientRect().left - first.getBoundingClientRect().left
    const end = list.scrollWidth - list.clientWidth
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const behavior = reducedMotion ? "instant" : "smooth"

    if (direction === 1 && list.scrollLeft >= end - 1) {
      list.scrollTo({ left: 0, behavior })
    } else if (direction === -1 && list.scrollLeft <= 1) {
      list.scrollTo({ left: end, behavior })
    } else {
      list.scrollBy({ left: step * direction, behavior })
    }
  }

  function startDrag(event: PointerEvent<HTMLUListElement>) {
    skipClick.current = false
    if (event.pointerType !== "mouse" || event.button !== 0) return
    drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, id: event.pointerId, moved: false }
  }

  function moveDrag(event: PointerEvent<HTMLUListElement>) {
    const active = drag.current
    if (!active || active.id !== event.pointerId || !(event.buttons & 1)) return
    const distance = event.clientX - active.x
    if (!active.moved && Math.abs(distance) < 6) return

    const list = event.currentTarget
    if (!active.moved) {
      active.moved = true
      skipClick.current = true
      list.setPointerCapture(event.pointerId)
      list.dataset.dragging = "true"
    }
    list.scrollLeft = active.left - distance
  }

  function finishDrag(event: PointerEvent<HTMLUListElement>) {
    if (drag.current?.id !== event.pointerId) return
    delete event.currentTarget.dataset.dragging
    drag.current = null
  }

  return (
    <main id="contenido" tabIndex={-1}>
      <section className="relative overflow-hidden bg-[#173e31] text-white">
        <PortadaPhotos />
        <div className="relative mx-auto flex min-h-[clamp(27rem,68svh,35rem)] max-w-[1240px] items-start justify-center px-3 pb-20 pt-9 sm:px-6 sm:pt-12 lg:min-h-[calc(100svh-76px)] lg:pt-[clamp(3rem,8svh,6rem)]">
          <div className="portada-copy relative isolate max-w-full px-3 py-4 text-center sm:px-6 sm:py-5 lg:px-9">
            <h1 className="whitespace-nowrap text-[clamp(1rem,6.5vw,4.5rem)] font-semibold leading-[1.06] tracking-[-0.045em]">
              Un territorio por descubrir
            </h1>
            <div aria-hidden="true" className="mx-auto my-3 h-px w-28 bg-white/80 sm:w-40" />
            <p className="mx-auto max-w-[58ch] text-sm leading-6 sm:text-lg sm:leading-7">
              Explora nuestros paisajes, emprendimientos y experiencias que hacen de Curarrehue un lugar único.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f6ef] py-14 sm:py-20" aria-labelledby="descubre-local">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <h2 id="descubre-local" className="text-3xl font-semibold tracking-tight sm:text-5xl">Descubre lo local</h2>
            <div className="flex shrink-0 gap-2">
              {([-1, 1] as const).map((direction) => (
                <button
                  key={direction}
                  type="button"
                  aria-label={direction === -1 ? "Proyectos anteriores" : "Proyectos siguientes"}
                  aria-controls="carrusel-proyectos"
                  onClick={() => moveProjects(direction)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#1d5a43] text-[#1d5a43] hover:bg-[#e9eee4] disabled:cursor-default disabled:opacity-40"
                >
                  <Icon name="arrow" className={direction === -1 ? "h-5 w-5 rotate-180" : "h-5 w-5"} />
                </button>
              ))}
            </div>
          </div>
          <ul
            id="carrusel-proyectos"
            ref={carousel}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            onLostPointerCapture={finishDrag}
            onDragStart={(event) => event.preventDefault()}
            onClickCapture={(event) => {
              if (!skipClick.current || event.detail === 0) return
              skipClick.current = false
              event.preventDefault()
              event.stopPropagation()
            }}
            className="mt-5 grid snap-x snap-mandatory auto-cols-[100%] grid-flow-col gap-4 overflow-x-auto scroll-px-1 px-1 py-3 select-none [@media(pointer:fine)]:cursor-grab data-[dragging]:cursor-grabbing data-[dragging]:snap-none sm:auto-cols-[calc((100%-1rem)/2)] lg:auto-cols-[calc((100%-2rem)/3)]"
          >
            {projects.map((project) => (
              <li key={project.id} className="min-w-0 snap-start">
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PortadaVideo />

      <section className="bg-[#f8f6ef] py-14 sm:py-20" aria-labelledby="atractivos-territorio">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <h2 id="atractivos-territorio" className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Conoce los atractivos de nuestro territorio
          </h2>
          <a
            data-route
            href={sectionHref("maichin")}
            className="group relative mt-6 isolate flex min-h-[260px] items-end overflow-hidden rounded-[28px] bg-[#173e31] p-5 text-white sm:min-h-[360px] sm:p-9 lg:min-h-[420px]"
          >
            <img
              src={import.meta.env.BASE_URL + "Images/FotoCuenca2.jpg"}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#102f25] via-[#102f25]/35 to-transparent" />
            <span aria-hidden="true" className="absolute inset-0 -z-10 bg-black/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
            <h3 className="flex items-center gap-3 text-3xl font-semibold tracking-tight sm:gap-4 sm:text-5xl">
              Cuenca del Maichín
              <Icon name="arrow" className="h-6 w-6 shrink-0 sm:h-8 sm:w-8" />
            </h3>
          </a>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-[1240px] gap-14 px-5 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative">
            <img
              src={images.mountain}
              srcSet={imageSources(images.mountain)}
              sizes="(min-width: 1024px) 520px, 90vw"
              alt=""
              loading="lazy"
              decoding="async"
              className="h-[520px] w-[90%] rounded-[32px] object-cover"
            />
          </div>
          <div className="lg:pl-10">
            <SectionTitle
              eyebrow="Descubre nuestro territorio"
              title="Donde la cordillera, el bosque y las comunidades se encuentran"
              body="Curarrehue es una comuna cordillerana de profunda identidad mapuche, rodeada de bosques, ríos y volcanes. Aquí, cada iniciativa encuentra su fuerza en el conocimiento local y en la riqueza de la naturaleza."
            />
            <div className="mt-9 grid grid-cols-2 gap-5">
              {[
                ["leaf", "Biodiversidad", "Bosques y especies nativas"],
                ["people", "Cultura viva", "Saberes y comunidad local"],
              ].map(([icon, title, body]) => (
                <div key={title} className="border-l-2 border-[#dfe9d7] pl-4">
                  <Icon name={icon} className="mb-3 h-6 w-6 text-[#1d5a43]" />
                  <strong className="block text-sm text-[#173e31]">
                    {title}
                  </strong>
                  <span className="mt-1 block text-xs leading-5 text-[#62695f]">
                    {body}
                  </span>
                </div>
              ))}
            </div>
            <a
              data-route
              href={sectionHref("about")}
              className="mt-7 flex min-h-11 w-fit items-center gap-2 rounded text-sm font-extrabold text-[#1d5a43] underline underline-offset-4"
            >
              Conocer nuestra historia <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}

function Projects({
  filters,
  onFiltersChange,
}: {
  filters: CatalogFilters
  onFiltersChange: (filters: CatalogFilters) => void
}) {
  const { category } = filters
  const allCategoriesButton = useRef<HTMLButtonElement>(null)
  const visible = projects.filter((project) => !category || project.category === category)
  const resultCount =
    visible.length === 1 ? "1 iniciativa" : visible.length + " iniciativas"

  return (
    <main id="contenido" tabIndex={-1} className="min-h-screen bg-[#f8f6ef]">
      <section className="border-b border-[#173e31]/10 bg-[#e9eee4] py-10 sm:py-16">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <SectionTitle
            heading="h1"
            eyebrow="Proyectos locales"
            title="Explora las iniciativas de Curarrehue"
            wide
            body="Descubre personas, ideas y recursos que están abriendo nuevas oportunidades para el territorio."
          />
          <fieldset className="mt-7 min-w-0 lg:mt-10">
            <legend className="mb-2 text-sm font-bold text-[#173e31]">
              Categoría
            </legend>
            <div className="flex flex-wrap gap-2">
              {(["", ...categories] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  ref={item === "" ? allCategoriesButton : undefined}
                  aria-pressed={category === item}
                  onClick={() => onFiltersChange({ category: item })}
                  className={
                    "min-h-11 rounded-full border px-4 py-2 text-sm font-bold transition " +
                    (category === item
                      ? "border-[#1d5a43] bg-[#1d5a43] text-white"
                      : "border-[#737e75] bg-white text-[#43564a] hover:bg-[#f8f6ef]")
                  }
                >
                  {item || "Todos"}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </section>
      <section className="mx-auto max-w-[1240px] px-5 py-8 sm:py-14 lg:px-8">
        <h2 className="sr-only">Resultados del catálogo</h2>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p role="status" className="text-sm text-[#526059]">
            Mostrando <strong className="text-[#173e31]">{resultCount}</strong>
          </p>
          {category && (
            <button
              type="button"
              onClick={() => {
                allCategoriesButton.current?.focus()
                onFiltersChange({ category: "" })
              }}
              className="min-h-11 rounded px-1 text-sm font-bold text-[#1d5a43] underline underline-offset-4"
            >
              Limpiar filtros
            </button>
          )}
        </div>
        {visible.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#173e31]/30 bg-white px-5 py-12 text-center">
            <Icon name="search" className="mx-auto h-8 w-8 text-[#62695f]" />
            <h3 className="mt-4 text-xl font-semibold text-[#173e31]">
              No encontramos resultados
            </h3>
            <p className="mt-2 text-sm text-[#526059]">
              Prueba con otra categoría.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

function Detail({
  project,
  backHref,
}: {
  project: Project
  backHref: string
}) {
  const isCalafate = project.id === "calafate"
  const isPark = project.id === "parque-maite"
  const isBridge = project.id === "puente-aguas-blancas"
  const heroImage = isPark
    ? imagePath("parque-web/Parque1.webp")
    : isBridge
      ? imagePath("Puente1.jpg")
      : project.image
  const bridgePhotos = [
    {
      thumb: imagePath("Puente1.jpg"),
      full: imagePath("Puente1.jpg"),
      alt: "Puente Colgante Aguas Blancas",
    },
    {
      thumb: imagePath("Puente2.jpg"),
      full: imagePath("Puente2.jpg"),
      alt: "Vista del Puente Colgante Aguas Blancas",
    },
  ]
  const mapInfo = isPark
    ? {
        title: "Mapa del sector Quiñenehuin en Google Maps",
        embed:
          "https://maps.google.com/maps?q=-39.2598475,-71.4369358&z=15&output=embed",
        href: "https://maps.app.goo.gl/XtsB9dtGNNacHha69",
      }
    : isBridge
      ? {
          title: "Mapa del Puente Colgante Aguas Blancas en Google Maps",
          embed:
            "https://maps.google.com/maps?q=-39.3215233,-71.4925855&z=15&output=embed",
          href: "https://share.google/eNMZ9qoVgLEsmGAMT",
        }
      : {
          title: "Mapa del sector Maite en Google Maps",
          embed:
            "https://maps.google.com/maps?q=-39.3173576,-71.4839735&z=15&output=embed",
          href: "https://maps.app.goo.gl/VRfDFXLFVNDhwVcB6",
        }
  const related = projects
    .filter(
      (item) => item.id !== project.id && item.category === project.category,
    )
    .slice(0, 2)
  const features = isCalafate
    ? [
        [
          "Recurso local",
          "Calafate, fruto nativo de la Patagonia con alto valor antioxidante.",
        ],
        [
          "Posibles productos",
          "Fruta fresca, mermeladas, jugos, infusiones y productos deshidratados.",
        ],
        [
          "Oportunidades",
          "Venta local, turismo gastronómico y circuitos de productos con identidad.",
        ],
      ]
    : [
        [
          "Senderos interpretativos",
          "Recorridos de baja dificultad para descubrir el bosque nativo.",
        ],
        [
          "Protección del entorno",
          "Manejo responsable de hábitats y especies de valor local.",
        ],
        [
          "Turismo comunitario",
          "Una experiencia conectada con relatos, saberes y comunidad.",
        ],
      ]
  return (
    <main id="contenido" tabIndex={-1} className="bg-[#f8f6ef]">
      <section className="relative overflow-hidden bg-[#102f25] text-white">
        <img
          src={heroImage}
          srcSet={isBridge ? undefined : imageSources(heroImage)}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {isBridge && <div className="absolute inset-0 bg-gradient-to-t from-[#102f25] via-[#102f25]/85 to-[#102f25]/25" />}
        <div className="relative mx-auto flex min-h-[360px] max-w-[1240px] flex-col justify-between gap-12 px-5 py-8 sm:min-h-[520px] lg:px-8">
          <a
            data-route
            href={backHref}
            className="flex min-h-11 w-fit items-center gap-2 rounded-full border border-white/60 bg-[#102f25] px-4 py-2.5 text-sm font-bold transition hover:bg-[#1d5a43]"
          >
            <Icon name="back" className="h-4 w-4" /> Volver a proyectos
          </a>
          <div className={`pb-6 ${isBridge ? "max-w-none" : "max-w-3xl"} ${isPark ? "[text-shadow:0_1px_4px_#000,0_2px_10px_#000]" : ""}`}>
            <span className="rounded-full bg-[#f5e7b0] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#173e31] [text-shadow:none]">
              {project.category}
            </span>
            <h1
              className={`mt-6 font-semibold leading-[1.02] tracking-[-0.05em] ${
                isBridge
                  ? "whitespace-nowrap text-[clamp(1.1rem,6vw,4.5rem)]"
                  : "text-balance text-4xl sm:text-6xl lg:text-7xl"
              }`}
            >
              {project.name}
            </h1>
            <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-white">
              <Icon name="pin" className="h-5 w-5" /> Sector {project.sector},
              Curarrehue
            </p>
          </div>
        </div>
      </section>

      {!isPark && (
        <section className="bg-white py-20">
          <div className={`mx-auto grid max-w-[1120px] gap-14 px-5 lg:px-8 ${isCalafate ? "lg:grid-cols-[1.35fr_0.65fr]" : ""}`}>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#a23e54]">
                Sobre el proyecto
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#173e31] sm:text-4xl">
                {isCalafate
                  ? "Un fruto nativo convertido en oportunidad local"
                  : "Una iniciativa que crece desde el conocimiento local"}
              </h2>
              <p className="mt-6 max-w-prose text-lg leading-8 text-[#606a62]">
                {project.description}
              </p>
            </div>
            {isCalafate && (
              <aside className="rounded-3xl bg-[#edf2e9] p-7">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#1d5a43] text-white">
                  <Icon name="compass" />
                </span>
                <h3 className="mt-6 text-lg font-bold text-[#173e31]">
                  Objetivo principal
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#5f6a62]">
                  Desarrollar un manejo productivo sostenible del calafate y avanzar hacia su comercialización con valor agregado.
                </p>
              </aside>
            )}
          </div>
        </section>
      )}

      {(isCalafate || isPark) && (
        <section className="bg-[#f8f6ef] py-20">
          <div className="mx-auto max-w-[1120px] px-5 lg:px-8">
            <SectionTitle
              eyebrow={
                isCalafate
                  ? "Potencial productivo"
                  : "Características principales"
              }
              title={
                isCalafate
                  ? "Del territorio a nuevos productos"
                  : "Una experiencia conectada con el bosque"
              }
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {features.map(([title, body], index) => (
                <div
                  key={title}
                  className="rounded-3xl border border-[#173e31]/10 bg-white p-7"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f5e7b0] text-sm font-extrabold text-[#173e31]">
                    0{index + 1}
                  </span>
                  <h3 className="mt-6 text-lg font-bold text-[#173e31]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#667067]">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {isCalafate && (
        <section className="bg-[#173e31] py-20 text-white">
          <div className="mx-auto max-w-[1120px] px-5 lg:px-8">
            <SectionTitle
              eyebrow="Proceso"
              title="De la producción a la comercialización"
              inverse
            />
            <div className="mt-12 grid gap-8 md:grid-cols-4">
              {[
                ["01", "Manejo del huerto"],
                ["02", "Cosecha cuidadosa"],
                ["03", "Transformación"],
                ["04", "Venta y difusión"],
              ].map(([number, title]) => (
                <div
                  key={number}
                  className="relative border-t border-white/25 pt-6"
                >
                  <span className="text-xs font-bold text-[#e8dca7]">
                    {number}
                  </span>
                  <strong className="mt-3 block text-lg">{title}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {isPark && <ParkGallery />}

      {isBridge && (
        <ImageGallery
          title="Galería del Puente Colgante Aguas Blancas"
          background="bg-[#f8f6ef]"
          photos={bridgePhotos}
        />
      )}

      <section className="bg-[#e9eee4] py-20">
        <div className="mx-auto max-w-[1120px] px-5 lg:px-8">
          <SectionTitle
            eyebrow="Ubicación"
            title={`Sector ${project.sector}`}
          />
          <div className="mt-6 grid gap-4 rounded-[24px] border border-[#173e31]/15 bg-white p-5 sm:p-7">
            <iframe
              title={mapInfo.title}
              src={mapInfo.embed}
              className="h-72 w-full rounded-xl border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a
              href={mapInfo.href}
              className="inline-flex min-h-11 w-fit items-center rounded text-sm font-bold text-[#1d5a43] underline underline-offset-4"
            >
              Abrir en Google Maps
            </a>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-[#f8f6ef] py-20">
          <div className="mx-auto max-w-[1120px] px-5 lg:px-8">
            <SectionTitle
              eyebrow="Sigue explorando"
              title="Proyectos relacionados"
            />
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {related.map((item) => (
                <ProjectCard key={item.id} project={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

function About() {
  return (
    <main id="contenido" tabIndex={-1}>
      <section className="relative overflow-hidden bg-[#173e31] py-24 text-white sm:py-32">
        <div className="absolute right-[-10%] top-[-25%] h-[550px] w-[550px] rounded-full border border-white/10" />
        <div className="absolute right-[2%] top-[-8%] h-[360px] w-[360px] rounded-full border border-white/10" />
        <div className="relative mx-auto max-w-[980px] px-5 text-center lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#e8dca7]">
            Sobre la iniciativa
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-6xl">
            Visibilizar lo que nace aquí para abrir oportunidades
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/70">
            Este portal reúne iniciativas de desarrollo económico local que
            ponen en valor el patrimonio natural, productivo y turístico de
            Curarrehue.
          </p>
        </div>
      </section>
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-[1120px] gap-14 px-5 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="grid grid-cols-2 gap-3">
            <img
              src={images.forest}
              srcSet={imageSources(images.forest)}
              sizes="(min-width: 1024px) 250px, 50vw"
              loading="lazy"
              decoding="async"
              alt=""
              className="h-[420px] rounded-3xl object-cover"
            />
            <img
              src={images.berries}
              srcSet={imageSources(images.berries)}
              sizes="(min-width: 1024px) 250px, 50vw"
              loading="lazy"
              decoding="async"
              alt=""
              className="mt-14 h-[420px] rounded-3xl object-cover"
            />
          </div>
          <div className="lg:pl-10">
            <SectionTitle
              eyebrow="Nuestro propósito"
              title="Conectar iniciativas, personas y territorio"
              body="Queremos que residentes, visitantes, compradores y organizaciones puedan descubrir fácilmente proyectos con potencial, comprender su aporte y acercarse a la diversidad productiva de la comuna."
            />
            <p className="mt-5 text-base leading-7 text-[#5c635c]">
              La plataforma actúa como una vitrina pública: clara, cercana y
              visual. No busca reemplazar el vínculo directo, sino crear el
              primer encuentro.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-[#f8f6ef] py-20">
        <div className="mx-auto max-w-[1120px] px-5 lg:px-8">
          <SectionTitle
            eyebrow="Trabajo en conjunto"
            title="Una iniciativa de la Universidad de La Frontera y la comunidad de Curarrehue"
            body="Este portal se construyó de forma colaborativa: la universidad aporta acompañamiento técnico y metodológico, y la comunidad de Curarrehue entrega su conocimiento del territorio, sus prioridades y su mirada sobre el desarrollo local."
            wide
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-8">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[#e9eee4] text-[#1d5a43]">
                <Icon name="compass" />
              </span>
              <h3 className="mt-6 text-xl font-bold text-[#173e31]">
                Universidad de La Frontera
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#677068]">
                Acompañamiento técnico, investigación y herramientas para
                identificar y visibilizar las iniciativas con potencial del
                territorio.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-8">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[#e9eee4] text-[#1d5a43]">
                <Icon name="people" />
              </span>
              <h3 className="mt-6 text-xl font-bold text-[#173e31]">
                Comunidad de Curarrehue
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#677068]">
                Participación, saberes locales y definición de las prioridades
                que orientan cada una de las iniciativas reunidas aquí.
              </p>
            </div>
          </div>
        </div>
      </section>
      <ImageGallery
        eyebrow="Nuestro territorio"
        title="Galería de Curarrehue"
        columns="lg:grid-cols-4"
        photos={aboutGalleryPhotos}
      />
    </main>
  )
}


function Footer() {
  return (
    <footer className="bg-[#102f25] py-12 text-white">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between lg:gap-8">
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <Logo inverse />
            <img
              src={import.meta.env.BASE_URL + "Images/Logo_Nuevo_Ufro.png"}
              alt="Universidad de La Frontera"
              width={1280}
              height={1103}
              loading="lazy"
              decoding="async"
              className="h-auto w-12 shrink-0 sm:w-20"
            />
          </div>
          <nav
            aria-label="Navegación del pie de página"
            className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-white/85 lg:justify-end"
          >
            {navigation.map((link) => (
              <a
                key={link.page}
                data-route
                href={sectionHref(link.page)}
                className="flex min-h-11 items-center rounded hover:underline"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <p className="mt-6 border-t border-white/20 pt-5 text-center text-sm text-white/80">
          2026
        </p>
      </div>
    </footer>
  )
}

function focusContent() {
  window.scrollTo(0, 0)
  const heading = document.querySelector<HTMLElement>("#contenido h1")
  if (heading) {
    heading.tabIndex = -1
    heading.focus({ preventScroll: true })
  }
}

export default function App() {
  const [location, setLocation] = useState(() => new URL(window.location.href))
  const lastPathname = useRef(location.pathname)
  const route = currentPage(location)
  const focusMaichin = lastPathname.current !== location.pathname
  const selected =
    route.kind === "detail"
      ? projects.find((project) => project.id === route.id)
      : undefined
  const page = route.kind === "detail" && !selected ? "not-found" : route.kind
  const backHref: string =
    window.history.state?.catalogHref ?? sectionHref("projects")
  const title =
    selected?.name ??
    navigation.find((item) => item.page === page)?.label ??
    "Página no encontrada"

  useEffect(() => {
    const restoreLocation = () => setLocation(new URL(window.location.href))
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = "manual"
    window.addEventListener("popstate", restoreLocation)
    return () => {
      window.removeEventListener("popstate", restoreLocation)
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  useLayoutEffect(() => {
    const siteTitle = "Curarrehue · Territorio Vivo"
    if (page !== "maichin") {
      document.title = page === "home" ? siteTitle : title + " | " + siteTitle
      const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      const socialTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
      const socialDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
      if (description) description.content = siteConfiguration.description
      if (socialTitle) socialTitle.content = siteTitle
      if (socialDescription) socialDescription.content = siteConfiguration.description
    }
    if (lastPathname.current !== location.pathname) {
      lastPathname.current = location.pathname
      if (page !== "maichin") focusContent()
    }
  }, [location.pathname, page, title])

  function replaceLocation(href: string) {
    window.history.replaceState(window.history.state, "", href)
    setLocation(new URL(window.location.href))
  }

  function followLink(event: MouseEvent<HTMLDivElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    const anchor =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("a[data-route]")
        : null
    if (
      !anchor ||
      (anchor.target && anchor.target !== "_self") ||
      anchor.origin !== location.origin
    )
      return

    event.preventDefault()
    const next = new URL(anchor.href)
    if (next.href !== window.location.href) {
      const catalogHref =
        page === "projects"
          ? location.pathname + location.search
          : window.history.state?.catalogHref
      const state =
        currentPage(next).kind === "detail" && catalogHref
          ? { catalogHref }
          : null
      window.history.pushState(state, "", next)
      setLocation(next)
    }
    if (next.pathname === location.pathname) focusContent()
  }

  return (
    <div className="min-h-screen bg-[#f8f6ef]" onClick={followLink}>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Header key={location.pathname} page={page} activeService={route.kind === "maichin" && "standalone" in route && route.standalone ? route.path[0] : undefined} />
      {page === "home" && <Home />}
      {page === "projects" && (
        <Projects
          filters={catalogFilters(location)}
          onFiltersChange={(filters) => replaceLocation(catalogHref(filters))}
        />
      )}
      {page === "about" && <About />}
      {route.kind === "maichin" && (
        <Suspense fallback={<main id="contenido" tabIndex={-1} className="mx-auto min-h-[55vh] max-w-[1240px] px-5 py-16"><p role="status">Cargando Cuenca del Maichín…</p></main>}>
          <Maichin location={location} path={route.path} standalone={route.standalone} focusOnEntry={focusMaichin} focusContent={focusContent} replaceLocation={replaceLocation} />
        </Suspense>
      )}
      {selected && <Detail project={selected} backHref={backHref} />}
      {page === "not-found" && (
        <main
          id="contenido"
          tabIndex={-1}
          className="mx-auto min-h-[55vh] max-w-[1240px] px-5 py-16 lg:px-8"
        >
          <h1 className="text-4xl font-semibold text-[#173e31]">
            Página no encontrada
          </h1>
          <a
            data-route
            href={sectionHref("projects")}
            className="mt-6 inline-flex min-h-11 items-center rounded text-[#1d5a43] underline"
          >
            Explorar proyectos
          </a>
        </main>
      )}
      <Footer />
    </div>
  )
}
