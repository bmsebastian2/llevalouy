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
  /** "Entrega hoy en Montevideo si pedís antes de las 14:00", "Te llega hoy a Pocitos si pedís antes de las 14:00" */
  main: string;
  /** Para las tarjetas: "Entrega hoy", "Entrega mañana" */
  short: string;
  today: boolean;
  choice: BarrioChoice | null;
};

/** 14 → "14:00" */
const hourText = (h: number) => `${h}:00`;

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

  const generalToday = {
    main: `Entrega hoy en Montevideo si pedís antes de las ${hourText(REFERENCE.cutoffHour)}`,
    short: "Entrega hoy",
    today: true,
    choice: null,
  };

  if (!mounted) return generalToday;

  if (choice) {
    const answer = deliveryAnswer(choice, now);
    const barrio = choice.kind === "barrio" ? findBarrio(choice.name) : undefined;
    if (barrio) {
      return answer.today
        ? {
            main: `Te llega hoy a ${barrio.name} si pedís antes de las ${hourText(barrio.cutoffHour)}`,
            short: "Entrega hoy",
            today: true,
            choice,
          }
        : // Sin envío en el día (o pasada la hora de corte): "A Carrasco te llega mañana"
          { main: `A ${barrio.name} te llega ${when(answer.headline)}`, short: `Entrega ${when(answer.headline)}`, today: false, choice };
    }
    const place = choice.kind === "interior" ? "fuera de Montevideo" : `a ${choice.name}`;
    return { main: `Te llega en ${when(answer.headline)} ${place}`, short: `Entrega en ${when(answer.headline)}`, today: false, choice };
  }

  const general = deliveryAnswer({ kind: "barrio", name: REFERENCE.name }, now);
  return general.today
    ? generalToday
    : {
        main: `Entrega ${when(general.headline)} en Montevideo`,
        short: `Entrega ${when(general.headline)}`,
        today: false,
        choice: null,
      };
}
