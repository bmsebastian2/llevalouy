"use client";

import { useEffect, useRef } from "react";
import type { PaymentMethod } from "@/types/order";

type Props = {
  code: string;
  whatsappUrl: string;
  paymentMethod: PaymentMethod;
};

const PAYMENT_NOTE: Record<PaymentMethod, string> = {
  cash: "💵 Pagás en efectivo cuando te llega.",
  transfer: "🏦 Por WhatsApp te pasamos los datos para transferir.",
  mercadopago: "💳 Por WhatsApp te mandamos el link de Mercado Pago.",
};

export default function OrderSuccess({ code, whatsappUrl, paymentMethod }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const opened = useRef(false);

  // Abre WhatsApp una sola vez; si el navegador lo bloquea queda el botón.
  useEffect(() => {
    boxRef.current?.scrollIntoView({ block: "center" });
    if (opened.current) return;
    opened.current = true;
    const t = setTimeout(() => window.location.assign(whatsappUrl), 600);
    return () => clearTimeout(t);
  }, [whatsappUrl]);

  return (
    <div
      ref={boxRef}
      role="status"
      className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-ink/5 sm:p-8"
    >
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-aqua text-3xl" aria-hidden>
        ✅
      </span>
      <h2 className="mt-4 text-2xl font-extrabold">¡Ya casi! Mandanos el mensaje</h2>
      <p className="mt-2 text-ink/70">
        Te abrimos WhatsApp con tu pedido ya escrito. <strong className="text-ink">Solo tocá Enviar</strong> y te
        confirmamos la entrega.
      </p>
      <p className="mt-2 text-sm text-ink/60">
        Pedido N° <strong className="text-ink">{code}</strong>
      </p>

      <a
        href={whatsappUrl}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 text-lg font-extrabold text-ink shadow-[0_6px_0_0_#128C7E] transition active:translate-y-1 active:shadow-[0_2px_0_0_#128C7E]"
      >
        <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.2 4.24-9.44 9.45-9.44a9.4 9.4 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44zm8.04-17.48A11.3 11.3 0 0 0 12.05.69C5.78.69.68 5.79.68 12.06c0 2 .52 3.96 1.52 5.69L.58 23.66l6.05-1.59a11.36 11.36 0 0 0 5.42 1.38h.01c6.27 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.9-3.34-8.05z" />
        </svg>
        Enviar pedido por WhatsApp
      </a>
      <p className="mt-3 text-sm text-ink/60">{PAYMENT_NOTE[paymentMethod]}</p>
    </div>
  );
}
