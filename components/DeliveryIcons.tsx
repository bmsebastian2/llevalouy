/* Íconos chicos de entrega y pago, con el mismo trazo de 1,5px que la línea de la Rambla */
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
} as const;

/** Reloj con líneas de velocidad: llega en el día */
export function SameDayIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <circle cx="14.5" cy="12" r="7" />
      <path d="M14.5 8.5V12l2.5 1.8M2 9h4M1.5 12h4M2 15h4" />
    </svg>
  );
}

/** Billete: pagás al recibir */
export function CashIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9.5v5M18 9.5v5" />
    </svg>
  );
}
