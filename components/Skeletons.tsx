// Esqueletos de carga: misma forma que el contenido real para que nada "salte" al aparecer.
// Solo CSS (animate-pulse anima opacidad, barato para el navegador).

export function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-ink/[0.07] motion-reduce:animate-none ${className}`} />;
}

function HeaderSkeleton() {
  return (
    <div className="sticky top-0 z-30 border-b border-ink/5 bg-bg/90">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-center px-4 md:justify-start">
        <Bone className="h-9 w-[139px]" />
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <li className="flex">
      <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
        <Bone className="aspect-square rounded-none" />
        <div className="flex flex-1 flex-col p-3">
          <Bone className="h-4 w-11/12" />
          <Bone className="mt-1.5 h-4 w-2/3" />
          <Bone className="mt-4 h-3 w-12" />
          <Bone className="mt-1.5 h-5 w-20" />
        </div>
      </div>
    </li>
  );
}

export function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando productos">
      <HeaderSkeleton />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Bone className="h-9 w-4/5 sm:w-2/3" />
        <Bone className="mt-2 h-9 w-3/5 sm:w-1/2" />
        <Bone className="mt-3 h-5 w-full max-w-sm" />
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando producto">
      <HeaderSkeleton />
      <div className="mx-auto max-w-5xl md:grid md:grid-cols-2 md:gap-10 md:px-4 md:py-10">
        <Bone className="aspect-square w-full rounded-none md:rounded-3xl" />
        <div className="px-4 pt-5 md:px-0 md:pt-4">
          <Bone className="h-7 w-48 rounded-full" />
          <Bone className="mt-3 h-9 w-11/12" />
          <Bone className="mt-2 h-5 w-full" />
          <Bone className="mt-1.5 h-5 w-4/5" />
          <Bone className="mt-5 h-10 w-40" />
          <Bone className="mt-6 h-14 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function AdminListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando">
      <Bone className="h-8 w-40" />
      <div className="mt-4 flex gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Bone key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
            <Bone className="h-5 w-1/2" />
            <Bone className="mt-2 h-3 w-1/3" />
            <Bone className="mt-4 h-4 w-full" />
            <Bone className="mt-2 h-4 w-3/4" />
            <Bone className="mt-4 h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
