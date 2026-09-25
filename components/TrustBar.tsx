/* Íconos propios con el mismo trazo de 1,5px que la línea de la Rambla */
const iconProps = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  className: "size-8 shrink-0 text-aqua-dark",
} as const;

/** Reloj con líneas de velocidad: llega hoy */
const SameDayIcon = (
  <svg {...iconProps}>
    <circle cx="19" cy="16" r="9" />
    <path d="M19 11v5l3.5 2.5M3 12h5M2 16h5M3 20h5" />
  </svg>
);

/** Billete que pasa a una mano: pagás al recibir */
const CashIcon = (
  <svg {...iconProps}>
    <rect x="6" y="5" width="20" height="11" rx="2" />
    <circle cx="16" cy="10.5" r="2.5" />
    <path d="M3 22h6l4 2h7a2 2 0 0 0 0-4h-4M3 27h9l12-3.5 3-1.5a2 2 0 0 0-2-3.5l-6 2.5" />
  </svg>
);

/** Caja con flecha que vuelve: te lo cambiamos */
const SwapIcon = (
  <svg {...iconProps}>
    <path d="M4 11 13 7l9 4v10l-9 4-9-4z" />
    <path d="m4 11 9 4 9-4M13 15v10" />
    <path d="M24 5a5 5 0 0 1 5 5v3m0 0-2-2m2 2 2-2" />
  </svg>
);

const items = [
  { icon: SameDayIcon, text: "Envío en el día en Montevideo" },
  { icon: CashIcon, text: "Pagás al recibir" },
  { icon: SwapIcon, text: "Si llega fallado, te lo cambiamos" },
];

export default function TrustBar() {
  return (
    <section aria-label="Cómo te cuidamos la compra" className="mx-auto max-w-5xl px-4 pb-4 pt-10 md:pt-6">
      <ul className="grid gap-4 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-espuma">
        {items.map((it) => (
          <li key={it.text} className="flex items-center gap-3 font-medium leading-snug sm:px-5 sm:first:pl-0">
            {it.icon}
            {it.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
