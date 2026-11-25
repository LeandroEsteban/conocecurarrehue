import { published } from "./content"
import { hasStandaloneService, maichinDescription, maichinSlug, maichinTitle, sections } from "./sections"

const tourismPages = [
  { path: maichinSlug, title: maichinTitle, description: maichinDescription },
  ...Object.entries(sections).map(([path, section]) => ({
    path: maichinSlug + "/" + path,
    title: section.title,
    description: section.description,
  })),
  ...published.map((entry) => ({
    path: maichinSlug + "/" + entry.kind + "/" + encodeURIComponent(entry.id),
    title: entry.name,
    description: entry.summary,
  })),
]

export const maichinPages = [
  ...tourismPages,
  ...tourismPages.flatMap((page) => {
    const path = page.path.slice(maichinSlug.length + 1)
    return hasStandaloneService(path.split("/")[0]) ? [{ ...page, path }] : []
  }),
]
