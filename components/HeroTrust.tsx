"use client";

import { useRef } from "react";
import { useDelivery } from "@/lib/use-delivery";
import BarrioSheet from "./BarrioSheet";
import { CashIcon, SameDayIcon, WhatsappIcon } from "./DeliveryIcons";

/*
 * Celular: tres columnas en un mismo recuadro blanco, ícono arriba y texto centrado.
 * Desde 640px: tres pastillas, ícono a la izquierda.
 */
const item =
  "flex h-full min-h-12 w-full flex-col items-center gap-1.5 px-0.5 py-2.5 text-center sm:flex-row sm:gap-3 sm:rounded-full sm:bg-white sm:py-1.5 sm:pl-1.5 sm:pr-5 sm:text-left sm:ring-1 sm:ring-espuma";
const action = "group outline-none hover:bg-bg active:bg-bg focus-visible:ring-4 focus-visible:ring-aqua-dark/40";

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-bg text-aqua-dark group-hover:bg-white group-active:bg-white sm:size-10">
      {children}
    </span>
  );
}

/**
 * El subrayado marca lo que se toca: la entrega y WhatsApp. "Pagás al recibir" solo informa.
 * Título en Bricolage angosta (display): así "Pagás al recibir" entra en una línea a 360px.
 */
function Text({ title, detail, action = false }: { title: string; detail: string; action?: boolean }) {
  return (
    <span className="min-w-0 leading-tight">
      <span
        className={`display block text-sm font-extrabold sm:text-base ${
          action ? "underline decoration-aqua-dark decoration-[1.5px] underline-offset-4" : ""
        }`}
      >
        {title}
      </span>
      <span className="mt-1 block text-balance text-[0.8125rem] font-medium text-ink/75 sm:mt-0.5 sm:text-sm">
        {detail}
      </span>
    </span>
  );
}

/** Las tres señales de confianza del hero: cuándo llega, cómo se paga y con quién hablar */
export default function HeroTrust({ whatsappHref, className = "" }: { whatsappHref: string | null; className?: string }) {
  const delivery = useDelivery();
  const sheetRef = useRef<HTMLDialogElement>(null);

  const chat = (
    <>
      <Bubble>
        <WhatsappIcon className="size-5" />
      </Bubble>
      <Text title="WhatsApp" detail="te atiende una persona" action={!!whatsappHref} />
    </>
  );

  return (
    <>
      <ul
        className={`grid grid-cols-3 divide-x divide-espuma rounded-2xl bg-white ring-1 ring-espuma sm:flex sm:flex-wrap sm:gap-2.5 sm:divide-x-0 sm:rounded-none sm:bg-transparent sm:ring-0 ${className}`}
      >
        <li>
          <button
            type="button"
            onClick={() => sheetRef.current?.showModal()}
            aria-haspopup="dialog"
            className={`${item} ${action} rounded-l-2xl`}
          >
            <Bubble>
              <SameDayIcon className="size-5" />
            </Bubble>
            <Text title={delivery.title} detail={delivery.detail} action />
            <span className="sr-only">. ¿Dónde entregamos?</span>
          </button>
        </li>
        <li>
          <div className={item}>
            <Bubble>
              <CashIcon className="size-5" />
            </Bubble>
            <Text title="Pagás al recibir" detail="efectivo o transferencia" />
          </div>
        </li>
        <li>
          {whatsappHref ? (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={`${item} ${action} rounded-r-2xl`}>
              {chat}
            </a>
          ) : (
            <div className={item}>{chat}</div>
          )}
        </li>
      </ul>
      <BarrioSheet dialogRef={sheetRef} choice={delivery.choice} />
    </>
  );
}
