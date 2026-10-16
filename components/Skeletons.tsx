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

/** Señales del hero (HeroTrust): tres columnas en celular, pastillas desde 640px */
function TrustSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid grid-cols-3 divide-x divide-espuma rounded-2xl bg-white ring-1 ring-espuma sm:flex sm:flex-wrap sm:gap-2.5 sm:divide-x-0 sm:bg-transparent sm:ring-0 ${className}`}
    >
      {Array.from({ length: 3 }, (_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-1.5 px-2 py-2.5 sm:h-[3.625rem] sm:w-56 sm:flex-row sm:gap-3 sm:rounded-full sm:bg-white sm:py-1.5 sm:pl-1.5 sm:ring-1 sm:ring-espuma"
        >
          <Bone className="size-9 shrink-0 rounded-full sm:size-10" />
          <div className="flex w-full flex-col items-center gap-1.5 sm:items-start">
            <Bone className="h-4 w-4/5" />
            <Bone className="h-3.5 w-full sm:w-11/12" />
            <Bone className="h-3.5 w-1/2 sm:hidden" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Celular: foto a la izquierda y todo lo demás al lado. Desde 640px: vertical, foto arriba (como ProductCard) */
export function ProductCardSkeleton() {
  return (
    <li>
      <div className="grid h-full grid-cols-[min(40%,11rem)_1fr] gap-x-3.5 rounded-[20px] border border-ink/6 bg-white p-2 shadow-[0_8px_24px_rgb(11_42_42/0.06)] sm:flex sm:flex-col sm:gap-4 sm:p-2.5">
        <Bone className="aspect-square w-full rounded-xl sm:aspect-[3/2]" />
        <div className="flex flex-col py-1.5 pr-1.5 sm:flex-1 sm:px-2 sm:pb-1 sm:pt-0">
          <Bone className="h-4 w-11/12 sm:h-6 sm:w-4/5" />
          <Bone className="mt-2 h-7 w-28 sm:h-8 sm:w-36" />
          <Bone className="mt-2 h-3 w-full sm:h-4 sm:w-4/5" />
          {/* En celular la frase breve ocupa hasta dos líneas */}
          <Bone className="mt-1.5 h-3 w-1/2 sm:hidden" />
          <Bone className="mt-auto h-11 w-32 rounded-xl sm:-mx-1 sm:mt-4 sm:h-12 sm:w-auto" />
        </div>
      </div>
    </li>
  );
}

export function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando productos">
      <HeaderSkeleton />
      <div className="page-container pt-5 sm:pt-10 lg:pt-16">
        {/* El titular ocupa dos líneas en todos los anchos */}
        <Bone className="h-8 w-11/12 sm:h-11 sm:w-2/3 lg:h-[3.25rem] lg:w-[34rem]" />
        <Bone className="mt-1.5 h-8 w-3/5 sm:h-11 sm:w-1/3 lg:h-[3.25rem] lg:w-80" />
        <Bone className="mt-2 h-6 w-2/3 sm:w-1/3" />
        <TrustSkeleton className="mt-4 sm:mt-6 lg:mt-8" />
        <div className="mt-5 h-6 sm:mt-8" />
        <ul className="mt-5 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
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
