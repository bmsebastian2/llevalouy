/*
 * La costa de la Rambla de Montevideo en un solo trazo de 1,5px (aqua-dark), con el Palacio Salvo
 * asomando en el Centro. Dibujada a mano y simplificada; no es un mapa.
 * Va en 2 lugares, nada más: el borde del header y el footer.
 */

function Stroke({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  );
}

const svgProps = { "aria-hidden": true, focusable: "false" } as const;

/**
 * De oeste a este: bahía, punta de Ciudad Vieja, el Salvo (base maciza, dos escalones, torre, cúpula y aguja),
 * Playa Ramírez, Punta Carretas, Pocitos, Punta Trouville, puerto del Buceo, Malvín, Punta Gorda y Carrasco.
 */
const COAST_SALVO =
  "M0 122C60 118 110 114 150 120C185 126 200 140 225 146C240 150 255 148 262 142C266 139 269 137 272 136" +
  "L272 100L280 100L280 86L290 86L290 72L298 72L298 56L301 56L301 46C301 42 303 41 305 41L305 28L305 41C307 41 309 42 309 46L309 56L312 56L312 72L320 72L320 86L330 86L330 100L338 100L338 136" +
  "C348 136 352 136 360 138C372 140 380 144 400 144C425 144 440 152 458 154C470 155 478 150 482 144C500 130 540 124 590 128C620 131 640 140 655 142C670 143 680 136 700 132C730 128 745 138 760 140C790 140 820 130 860 132C890 134 905 144 920 146C935 147 945 138 970 134C1040 126 1120 126 1200 124";

/** Footer: la costa entera con el Salvo */
export default function RamblaLine({ className = "" }: { className?: string }) {
  return (
    <div className={`text-aqua-dark ${className}`}>
      {/* Celular: se recorta del lado de Carrasco para que el Salvo no quede diminuto */}
      <svg {...svgProps} viewBox="0 0 1200 160" preserveAspectRatio="xMinYMax slice" className="block h-20 w-full sm:hidden">
        <Stroke d={COAST_SALVO} />
      </svg>
      <svg {...svgProps} viewBox="0 0 1200 160" className="hidden w-full sm:block">
        <Stroke d={COAST_SALVO} />
      </svg>
    </div>
  );
}

/*
 * Header: la costa es el borde de abajo y el Salvo sube dentro del header.
 * Tres piezas en fila que se tocan en y=54: la bahía (tramo corto), el Salvo a tamaño fijo
 * y el resto de la costa, que se estira hasta el borde derecho.
 */
const HEADER_BAY = "M0 52C30 52 50 55 75 55C88 55 95 54 100 54";
const HEADER_SALVO =
  "M0 54L4 54L4 39.6L7.2 39.6L7.2 34L11.2 34L11.2 28.4L14.4 28.4L14.4 22L15.6 22L15.6 18C15.6 16.4 16.4 16 17.2 16L17.2 10.8L17.2 16C18 16 18.8 16.4 18.8 18L18.8 22L20 22L20 28.4L23.2 28.4L23.2 34L27.2 34L27.2 39.6L30.4 39.6L30.4 54L35 54";
const HEADER_COAST =
  "M0 54C40 54 60 55.5 90 55.5C120 55.5 130 52 170 52C230 52 260 55 300 55C330 55 340 53 380 53C430 53 450 55 490 55C520 55 540 52.5 600 52.5C680 52.5 700 54.5 740 54.5C780 54.5 800 52 860 52C920 52 960 52.5 1000 52.5";

export function HeaderRambla() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex h-14 text-aqua-dark">
      {/* Celular: el Salvo ocupa el hueco a la izquierda del logo centrado. Compu: queda a la derecha del logo. */}
      <svg
        {...svgProps}
        viewBox="0 0 100 56"
        preserveAspectRatio="none"
        className="h-14 w-7 shrink-0 md:w-[max(11rem,calc(50%-32rem+12rem))]"
      >
        <Stroke d={HEADER_BAY} />
      </svg>
      <svg {...svgProps} viewBox="0 0 35 56" className="h-14 w-[35px] shrink-0">
        <Stroke d={HEADER_SALVO} />
      </svg>
      <svg {...svgProps} viewBox="0 0 1000 56" preserveAspectRatio="none" className="h-14 min-w-0 flex-1">
        <Stroke d={HEADER_COAST} />
      </svg>
    </div>
  );
}
