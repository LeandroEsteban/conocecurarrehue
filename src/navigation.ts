import { categories, type Category } from "./projects"
import { hasStandaloneService, maichinSlug } from "./maichin/sections"

const sections = {
  home: "",
  projects: "proyectos",
  about: "sobre-la-iniciativa",
  maichin: maichinSlug,
} as const

export type Section = keyof typeof sections
export interface CatalogFilters {
  category: Category | ""
}

const base = new URL(import.meta.env.BASE_URL, window.location.origin).pathname

export function sectionHref(section: Section) {
  return base + sections[section]
}

export function serviceHref(slug: string) {
  return base + slug
}

export function projectHref(id: string) {
  return `${sectionHref("projects")}/${encodeURIComponent(id)}`
}

export function catalogHref({ category }: CatalogFilters) {
  const params = new URLSearchParams()
  if (category) params.set("categoria", category)
  return params.size
    ? `${sectionHref("projects")}?${params}`
    : sectionHref("projects")
}

export function catalogFilters(url: URL): CatalogFilters {
  return {
    category:
      categories.find(
        (category) => category === url.searchParams.get("categoria"),
      ) ?? "",
  }
}

export function currentPage(url: URL) {
  const pathname = url.pathname.replace(/\/$/, "")
  const section = (Object.keys(sections) as Section[]).find(
    (entry) => sectionHref(entry).replace(/\/$/, "") === pathname,
  )
  if (section === "maichin") return { kind: "maichin", path: [] } as const
  if (section) return { kind: section } as const

  const standalonePath = pathname.slice(base.length).split("/")
  if (pathname.startsWith(base) && hasStandaloneService(standalonePath[0])) {
    return { kind: "maichin", path: standalonePath, standalone: true } as const
  }

  const maichinPrefix = sectionHref("maichin") + "/"
  if (pathname.startsWith(maichinPrefix)) {
    return { kind: "maichin", path: pathname.slice(maichinPrefix.length).split("/") } as const
  }

  const projectPrefix = sectionHref("projects") + "/"
  if (pathname.startsWith(projectPrefix)) {
    const segment = pathname.slice(projectPrefix.length)
    if (segment && !segment.includes("/")) {
      try {
        return { kind: "detail", id: decodeURIComponent(segment).toLowerCase() } as const
      } catch {
        return { kind: "not-found" } as const
      }
    }
  }

  return { kind: "not-found" } as const
}
