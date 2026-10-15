/* Íconos chicos de entrega, pago y contacto, con el mismo trazo de 1,5px que la línea de la Rambla */
export const iconProps = {
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

/** Globo de WhatsApp: lo usan el Header y el hero */
export function WhatsappIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" className={className}>
      <path
        d="M3.5 20.5 4.8 16A8.5 8.5 0 1 1 8 19.2z"
        strokeLinejoin="round"
      />
      <path
        d="M9 8.5c0 3.2 3.3 6.5 6.5 6.5l1-1.6-2-1-1 .9c-1-.4-2.4-1.8-2.8-2.8l.9-1-1-2z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
