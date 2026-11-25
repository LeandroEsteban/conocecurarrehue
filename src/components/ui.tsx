export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: string
  className?: string
}) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    back: <path d="m15 18-6-6 6-6" />,
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    leaf: (
      <>
        <path d="M20 4C10 4 5 8 5 15c0 3 2 5 5 5 7 0 10-8 10-16Z" />
        <path d="M4 21c3-6 7-9 12-12" />
      </>
    ),
    mountain: <path d="m3 19 6-10 4 6 2-3 6 7H3Z" />,
    people: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-4 2-7 6-7s6 3 6 7M16 5a3 3 0 0 1 0 6m1 3c3 .4 4 2 4 6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m15 9-2 4-4 2 2-4 4-2Z" />
      </>
    ),
    camera: <path d="M3 7h4l2-3h6l2 3h4v13H3z M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />,
    bed: <path d="M3 18V6m0 9h18v5m-18-7h18v2m-15-2V9h5v4m0-4h6a4 4 0 0 1 4 4" />,
    food: <path d="M4 3v5a3 3 0 0 0 6 0V3M7 3v18m13 0V3c-3 1-5 5-5 9h5" />,
    map: <path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16m6-14v16" />,
    list: <path d="M9 6h12M9 12h12M9 18h12M3 6h1m-1 6h1m-1 6h1" />,
    plus: <path d="M5 12h14m-7-7v14" />,
    minus: <path d="M5 12h14" />,
  }
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  body,
  centered = false,
  inverse = false,
  wide = false,
  heading: Heading = "h2",
}: {
  eyebrow?: string
  title: string
  body?: string
  centered?: boolean
  inverse?: boolean
  wide?: boolean
  heading?: "h1" | "h2"
}) {
  return (
    <div className={[wide ? "max-w-none" : "max-w-2xl", centered ? "mx-auto text-center" : ""].join(" ")}>
      {eyebrow && <div
        className={`mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] ${
          inverse ? "text-[#e8dca7]" : "text-[#a23e54]"
        }`}
      >
        <span
          className={`h-px w-8 ${inverse ? "bg-[#e8dca7]" : "bg-[#a23e54]"}`}
        />
        {eyebrow}
      </div>}
      <Heading
        className={`text-balance text-3xl font-semibold leading-[1.12] tracking-[-0.04em] sm:text-5xl ${
          inverse ? "text-white" : "text-[#173e31]"
        }`}
      >
        {title}
      </Heading>
      {body && (
        <p
          className={`mt-5 text-base leading-7 sm:text-lg ${
            inverse ? "text-white/65" : "text-[#5c635c]"
          }`}
        >
          {body}
        </p>
      )}
    </div>
  )
}

