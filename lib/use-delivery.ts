"use client";

import { useEffect, useState } from "react";
import { BARRIOS, BARRIO_EVENT, deliveryAnswer, findBarrio, readBarrio, type BarrioChoice } from "@/lib/delivery";
import { useNow } from "@/lib/use-now";

/** Barrio de referencia para la promesa general: el primero con envío en el día */
const REFERENCE = BARRIOS.find((b) => b.sameDay) ?? BARRIOS[0];

/** "Mañana." → "mañana", "El lunes." → "el lunes", "24 a 48 h." → "24 a 48 h" */
function when(headline: string) {
  return headline.replace(/\.$/, "").replace(/^./, (c) => c.toLowerCase());
}

export type DeliveryPromiseText = {
  /** "Entrega hoy en Montevideo", "Te llega hoy a Pocitos" */
  main: string;
  /** "pedí antes de las 14:00" (solo si llega hoy) */
  detail?: string;
  /** Para las tarjetas: "Entrega hoy", "Entrega mañana" */
  short: string;
  today: boolean;
  choice: BarrioChoice | null;
};

/**
 * Cuándo llega, con el barrio guardado si existe.
 * En el servidor y en el primer render responde "hoy": así el HTML coincide y la línea no cambia de alto.
 */
export function useDelivery(): DeliveryPromiseText {
  const now = useNow();
  const [mounted, setMounted] = useState(false);
  const [choice, setChoice] = useState<BarrioChoice | null>(null);

  useEffect(() => {
    const sync = () => setChoice(readBarrio());
    setMounted(true);
    sync();
    window.addEventListener(BARRIO_EVENT, sync);
    return () => window.removeEventListener(BARRIO_EVENT, sync);
  }, []);

  const cutoff = `pedí antes de las ${REFERENCE.cutoffHour}:00`;

  if (!mounted) {
    return { main: "Entrega hoy en Montevideo", detail: cutoff, short: "Entrega hoy", today: true, choice: null };
  }

  if (choice) {
    const answer = deliveryAnswer(choice, now);
    const barrio = choice.kind === "barrio" ? findBarrio(choice.name) : undefined;
    if (barrio) {
      return answer.today
        ? {
            main: `Te llega hoy a ${barrio.name}`,
            detail: `pedí antes de las ${barrio.cutoffHour}:00`,
            short: "Entrega hoy",
            today: true,
            choice,
          }
        : { main: `Te llega ${when(answer.headline)} a ${barrio.name}`, short: `Entrega ${when(answer.headline)}`, today: false, choice };
    }
    const place = choice.kind === "interior" ? "fuera de Montevideo" : `a ${choice.name}`;
    return { main: `Te llega en ${when(answer.headline)} ${place}`, short: `Entrega en ${when(answer.headline)}`, today: false, choice };
  }

  const general = deliveryAnswer({ kind: "barrio", name: REFERENCE.name }, now);
  return general.today
    ? { main: "Entrega hoy en Montevideo", detail: cutoff, short: "Entrega hoy", today: true, choice: null }
    : {
        main: `Entrega ${when(general.headline)} en Montevideo`,
        short: `Entrega ${when(general.headline)}`,
        today: false,
        choice: null,
      };
}
