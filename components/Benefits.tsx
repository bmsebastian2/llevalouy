import { Fragment } from "react";
import type { ProductBenefit, ProductUsageMedia } from "@/types/product";
import UsageMedia from "./UsageMedia";

type Props = {
  benefits: ProductBenefit[];
  description?: string;
  media?: ProductUsageMedia[];
};

/** Índice del beneficio después del cual va cada medio, repartidos en forma pareja. */
function mediaSlots(benefitCount: number, mediaCount: number) {
  const slots = new Map<number, number[]>();
  for (let m = 0; m < mediaCount; m++) {
    const after = Math.max(0, Math.round(((m + 1) * benefitCount) / (mediaCount + 1)) - 1);
    slots.set(after, [...(slots.get(after) ?? []), m]);
  }
  return slots;
}

export default function Benefits({ benefits, description, media = [] }: Props) {
  const slots = mediaSlots(benefits.length, media.length);
  // Con pocos beneficios no se reserva una tercera columna que quedaría vacía.
  const cols = benefits.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="display text-[1.75rem] font-extrabold leading-tight sm:text-4xl">Por qué te va a servir</h2>
      {description && <p className="mt-3 max-w-2xl text-lg text-ink/75">{description}</p>}
      {/* grid-flow-dense: en 2 o 3 columnas los beneficios rellenan el hueco que deja un medio a ancho completo. */}
      <ul className={`mt-6 grid grid-flow-dense gap-x-8 ${cols}`}>
        {benefits.map((b, i) => (
          <Fragment key={b.text}>
            {/* Lista con separadores finos, sin tarjetas */}
            <li className="flex items-center gap-4 border-t border-espuma py-4">
              <span className="w-8 shrink-0 text-center text-2xl" aria-hidden>
                {b.icon}
              </span>
              <span className="font-medium leading-snug">{b.text}</span>
            </li>
            {slots.get(i)?.map((m) => (
              <li key={media[m].src} className="col-span-full my-2">
                <UsageMedia item={media[m]} />
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
    </section>
  );
}
