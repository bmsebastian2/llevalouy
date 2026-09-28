/*
 * La costa de la Rambla de Montevideo en un solo trazo de 1,5px (aqua-dark), con el Palacio Salvo
 * asomando en el Centro. Dibujada a mano y simplificada; no es un mapa.
 * Va en 2 lugares, nada más: el footer y debajo del hero del home.
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

// overflow visible: el trazo de la costa toca el borde de abajo y no se corta
const svgProps = { "aria-hidden": true, focusable: "false", overflow: "visible" } as const;

/*
 * Tres piezas en fila que se tocan en y=54: la bahía (tramo corto), el Salvo a tamaño fijo
 * y el resto de la costa, que se estira hasta el borde derecho. 24px de alto.
 */
const BAY = "M0 52C30 52 50 55 75 55C88 55 95 54 100 54";
const SALVO =
  "M0 54L4 54L4 39.6L7.2 39.6L7.2 34L11.2 34L11.2 28.4L14.4 28.4L14.4 22L15.6 22L15.6 18C15.6 16.4 16.4 16 17.2 16L17.2 10.8L17.2 16C18 16 18.8 16.4 18.8 18L18.8 22L20 22L20 28.4L23.2 28.4L23.2 34L27.2 34L27.2 39.6L30.4 39.6L30.4 54L35 54";
const COAST =
  "M0 54C40 54 60 55.5 90 55.5C120 55.5 130 52 170 52C230 52 260 55 300 55C330 55 340 53 380 53C430 53 450 55 490 55C520 55 540 52.5 600 52.5C680 52.5 700 54.5 740 54.5C780 54.5 800 52 860 52C920 52 960 52.5 1000 52.5";

/** La costa con el Salvo, como detalle fino: va en el footer y debajo del hero del home */
export default function RamblaLine({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex h-6 text-aqua-dark ${className}`}>
      <svg {...svgProps} viewBox="0 8 100 48" preserveAspectRatio="none" className="h-6 w-8 shrink-0 sm:w-24">
        <Stroke d={BAY} />
      </svg>
      <svg {...svgProps} viewBox="0 8 35 48" className="h-6 w-[17.5px] shrink-0">
        <Stroke d={SALVO} />
      </svg>
      <svg {...svgProps} viewBox="0 8 1000 48" preserveAspectRatio="none" className="h-6 min-w-0 flex-1">
        <Stroke d={COAST} />
      </svg>
    </div>
  );
}
