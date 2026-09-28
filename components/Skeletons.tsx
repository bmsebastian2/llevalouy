// Esqueletos de carga: misma forma que el contenido real para que nada "salte" al aparecer.
// Solo CSS (animate-pulse anima opacidad, barato para el navegador).

export function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-ink/[0.07] motion-reduce:animate-none ${className}`} />;
}

function HeaderSkeleton() {
  return (
    <div className="sticky top-0 z-30 border-b border-espuma bg-white">
      <div className="page-container flex h-14 items-center justify-between">
        <Bone className="h-8 w-[124px]" />
        <Bone className="size-12 rounded-xl min-[400px]:w-32" />
      </div>
    </div>
  );
}

/** Recuadro de entrega y pago (DeliveryPromise) */
function PromiseSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white p-4 ring-1 ring-espuma ${className}`}>
      <Bone className="h-5 w-11/12" />
      <Bone className="mt-2 h-5 w-1/2" />
      <Bone className="mt-5 h-5 w-40" />
    </div>
  );
}

/** Card horizontal en celular, vertical desde tablet (como ProductCard) */
export function ProductCardSkeleton() {
  return (
    <li>
      <div className="grid grid-cols-[40%_1fr] overflow-hidden rounded-3xl bg-white ring-1 ring-espuma sm:flex sm:flex-col">
        <Bone className="aspect-square rounded-none" />
        <div className="flex flex-col justify-center px-3 py-2.5 sm:p-5">
          <Bone className="h-4 w-11/12" />
          <Bone className="mt-1.5 h-4 w-2/3" />
          <Bone className="mt-3 h-6 w-24" />
          <Bone className="mt-3 h-3.5 w-20" />
          <Bone className="mt-1.5 h-3.5 w-28" />
        </div>
      </div>
    </li>
  );
}

export function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando productos">
      <HeaderSkeleton />
      <div className="page-container pt-5 sm:pt-10">
        <Bone className="h-9 w-4/5 sm:h-14 sm:w-2/3" />
        <Bone className="mt-2 h-6 w-2/3 sm:w-1/3" />
        <PromiseSkeleton className="mt-4" />
        <div className="mt-5 h-6 sm:mt-8" />
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
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
      <div className="mx-auto max-w-5xl pt-3 md:page-container md:grid md:grid-cols-2 md:gap-10 md:py-10">
        {/* Mismo tamaño que la primera foto de la galería */}
        <div className="@container px-4 sm:px-6 md:px-0">
          <Bone className="aspect-square w-[min(calc(84cqw_-_1rem),48svh)] rounded-2xl lg:w-full lg:rounded-3xl" />
        </div>
        <div className="px-4 pt-4 sm:px-6 md:px-0 md:pt-2">
          <Bone className="h-8 w-11/12" />
          <Bone className="mt-2 h-5 w-4/5" />
          <Bone className="mt-3 h-10 w-52" />
          <PromiseSkeleton className="mt-3" />
          <Bone className="mt-3 h-14 w-full rounded-2xl" />
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
