import type { HighlightIcon as Name } from "@/types/product";
import { iconProps } from "./DeliveryIcons";

// Íconos de la card del home: etiqueta de contexto, características y beneficio destacado.
// Mismo trazo que los de entrega, con un relleno suave para que no se vean flacos al lado del texto.
const tint = { fill: "currentColor", fillOpacity: 0.18 } as const;

const paths: Record<Name, React.ReactNode> = {
  drop: (
    <>
      <path {...tint} d="M12 3.5c3.2 3.8 6 7.2 6 10.5a6 6 0 0 1-12 0c0-3.3 2.8-6.7 6-10.5z" />
      <path d="M9.5 14.5A2.5 2.5 0 0 0 12 17" />
    </>
  ),
  bolt: <path {...tint} d="M13 2.5 5 13.5h6l-1 8 8-11h-6z" />,
  leaf: (
    <>
      <path {...tint} d="M5 19C5 11 10 5.5 19 5c.5 9-5 14-14 14z" />
      <path d="M5 19c3-4 6-7 9.5-9" />
    </>
  ),
  home: (
    <>
      <path {...tint} d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z" />
      <path d="M10 20.5v-5h4v5" />
    </>
  ),
  check: (
    <>
      <circle {...tint} cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.2 2.4 2.3 4.6-4.8" />
    </>
  ),
  sun: (
    <>
      <circle {...tint} cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  shield: (
    <>
      <path {...tint} d="M12 3 5 5.8v5.4c0 4.4 3 8 7 9.8 4-1.8 7-5.4 7-9.8V5.8z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
};

export default function HighlightIcon({ name, className = "" }: { name: Name; className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      {paths[name]}
    </svg>
  );
}
