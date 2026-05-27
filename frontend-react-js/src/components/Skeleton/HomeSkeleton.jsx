/* ─── Bloque base reutilizable con animación shimmer ─────── */
function SkeletonBox({ className = '' }) {
  return (
    <div
      className={`skeleton-shimmer rounded ${className}`}
    />
  )
}

/* ─── Skeleton de una PostCard (refleja PostCard.jsx) ─────── */
function PostCardSkeleton() {
  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden">

      {/* ── Cabecera ──────────────────────────────────────── */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-2">
        <SkeletonBox className="w-12 h-12 rounded-full shrink-0" />

        <div className="flex-1 min-w-0 space-y-2">
          <SkeletonBox className="h-3 w-1/3" />
          <SkeletonBox className="h-2.5 w-2/3" />
          <SkeletonBox className="h-2 w-1/4" />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <SkeletonBox className="w-5 h-5 rounded-full" />
          <SkeletonBox className="w-5 h-5 rounded-full" />
        </div>
      </div>

      {/* ── Contenido de texto ────────────────────────────── */}
      <div className="px-4 pb-3 space-y-2">
        <SkeletonBox className="h-3 w-full" />
        <SkeletonBox className="h-3 w-11/12" />
        <SkeletonBox className="h-3 w-2/3" />
      </div>

      {/* ── Imagen del post ───────────────────────────────── */}
      <SkeletonBox className="w-full aspect-video rounded-none border-t border-b border-gray-200" />

      {/* ── Contador de reacciones ────────────────────────── */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-gray-200">
        <SkeletonBox className="w-5 h-5 rounded-full" />
        <SkeletonBox className="h-2.5 w-8" />
      </div>

      {/* ── Botones de acción ─────────────────────────────── */}
      <div className="flex items-center px-2 py-2 gap-1">
        <SkeletonBox className="w-8 h-8 rounded-full shrink-0 mr-1" />
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="flex-1 h-9 rounded-md" />
        ))}
      </div>
    </article>
  )
}

/* ─── Skeleton del Header (espejo exacto de Header.jsx) ────── */
const NAV_LABEL_WIDTHS = ['w-10', 'w-12', 'w-14', 'w-16', 'w-20']

function HeaderSkeleton() {
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1128px] mx-auto px-4 flex items-center gap-2 h-14">

        {/* ── Logo ── */}
        <div className="shrink-0 mr-1">
          <SkeletonBox className="w-8 h-8 rounded-md" />
        </div>

        {/* ── Buscador ── */}
        <div className="relative hidden sm:flex items-center border border-gray-300 rounded-full w-[280px] shrink-0">
          <SkeletonBox className="w-full h-9 rounded-full" />
        </div>

        {/* ── Nav ── */}
        <nav className="flex items-center ml-auto gap-1">
          {NAV_LABEL_WIDTHS.map((w, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-0.5 px-3 sm:px-4 h-14 min-w-[52px]"
            >
              <SkeletonBox className="w-6 h-6 rounded" />
              <SkeletonBox className={`hidden md:block h-2 mt-0.5 ${w}`} />
            </div>
          ))}

          {/* Divisor vertical */}
          <div className="hidden lg:block w-px h-8 bg-gray-300 mx-1" />

          {/* ── Avatar ── */}
          <div className="flex flex-col items-center justify-center gap-0.5 px-3 h-14 min-w-[52px]">
            <SkeletonBox className="w-6 h-6 rounded-full" />
            <SkeletonBox className="hidden md:block w-8 h-2 mt-0.5" />
          </div>

          {/* ── Apps grid ── */}
          <div className="flex flex-col items-center justify-center gap-0.5 px-3 h-14 min-w-[52px]">
            <SkeletonBox className="w-6 h-6 rounded" />
            <SkeletonBox className="hidden md:block w-20 h-2 mt-0.5" />
          </div>
        </nav>

      </div>
    </header>
  )
}

/* ─── Skeleton completo de la página Home ─────────────────── */
export default function HomeSkeleton({ count = 3, withHeader = true }) {
  return (
    <>
      {withHeader && <HeaderSkeleton />}

      <main className="min-h-screen bg-[#F3F2EF] py-6">
        <div className="max-w-[650px] mx-auto px-4 w-full">
          <section className="flex flex-col gap-3">

            {/* ── Caja "Crear publicación" ─────────────────── */}
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-3">
              <SkeletonBox className="w-10 h-10 rounded-full shrink-0" />
              <SkeletonBox className="flex-1 h-9 rounded-full" />
            </div>

            {/* ── Tarjetas de post (skeleton) ──────────────── */}
            {Array.from({ length: count }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}

          </section>
        </div>
      </main>
    </>
  )
}

export { HeaderSkeleton, PostCardSkeleton }
