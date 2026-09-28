"use client";

import { useRef } from "react";
import { useDelivery } from "@/lib/use-delivery";
import BarrioSheet from "./BarrioSheet";
import { CashIcon, SameDayIcon } from "./DeliveryIcons";

type Props = {
  /** "short": el home, sin la hora de corte ni los medios de pago */
  variant?: "full" | "short";
  className?: string;
};

/** Cuándo llega y cómo se paga, en una sola pieza, con la lista de barrios a un toque */
export default function DeliveryPromise({ variant = "full", className = "" }: Props) {
  const delivery = useDelivery();
  const sheetRef = useRef<HTMLDialogElement>(null);
  const full = variant === "full";

  return (
    <div className={`rounded-2xl bg-white ring-1 ring-espuma ${className}`}>
      <ul className={`grid px-4 pt-3 ${full ? "gap-2" : "gap-1.5"}`}>
        <li className="flex gap-2.5 leading-snug">
          <SameDayIcon className="size-5 shrink-0 translate-y-px text-aqua-dark" />
          <p>
            <strong className="font-extrabold">{delivery.main}</strong>
            {full && delivery.detail && <span className="text-ink/75"> — {delivery.detail}</span>}
          </p>
        </li>
        <li className="flex gap-2.5 leading-snug">
          <CashIcon className="size-5 shrink-0 translate-y-px text-aqua-dark" />
          <p>
            <strong className="font-extrabold">Pagás al recibir</strong>
            {full && <span className="text-ink/75">: efectivo o transferencia</span>}
          </p>
        </li>
      </ul>
      <button
        type="button"
        onClick={() => sheetRef.current?.showModal()}
        aria-haspopup="dialog"
        className="flex min-h-12 w-full items-center gap-2.5 rounded-b-2xl px-4 text-left font-bold text-aqua-dark underline decoration-2 underline-offset-4 outline-none hover:decoration-aqua focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-aqua-dark/40"
      >
        {/* Sangría del mismo ancho que los íconos: el link queda alineado con el texto */}
        <span aria-hidden className="size-5 shrink-0" />
        ¿Dónde entregamos?
      </button>
      <BarrioSheet dialogRef={sheetRef} choice={delivery.choice} />
    </div>
  );
}

/** Línea de las tarjetas: los íconos hacen de separador */
export function DeliveryLine({ className = "" }: { className?: string }) {
  const { short } = useDelivery();
  return (
    <p className={`flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium leading-tight text-ink/75 ${className}`}>
      <span className="inline-flex items-center gap-1.5">
        <SameDayIcon className="size-4 shrink-0 text-aqua-dark" />
        {short}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <CashIcon className="size-4 shrink-0 text-aqua-dark" />
        Pagás al recibir
      </span>
    </p>
  );
}
