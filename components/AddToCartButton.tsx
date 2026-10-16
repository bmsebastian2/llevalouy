"use client";

import { useEffect, useRef, useState } from "react";
import { cart, useCart } from "@/lib/cart";
import { MAX_QUANTITY } from "@/types/order";

/** Changuito del botón de la card */
function TrolleyIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className={className}>
      <path d="M2.5 3.5h2.2l2.1 11.2a1.5 1.5 0 0 0 1.5 1.3h8.9a1.5 1.5 0 0 0 1.5-1.2l1.3-7.3H5.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17.5" cy="20" r="1.4" />
    </svg>
  );
}

type Props = {
  slug: string;
  name: string;
  /** id del nombre en la card: con varios botones iguales, el lector de pantalla dice de qué producto es cada uno */
  nameId: string;
};

const FEEDBACK_MS = 2000;

/** Botón de la card del home: suma una unidad al carrito y lo confirma durante 2 s. */
export default function AddToCartButton({ slug, name, nameId }: Props) {
  const quantity = useCart().find((it) => it.slug === slug)?.quantity ?? 0;
  const [feedback, setFeedback] = useState<"added" | "limit" | null>(null);
  const [announce, setAnnounce] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function flash(state: "added" | "limit", message: string) {
    setFeedback(state);
    setAnnounce(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback(null), FEEDBACK_MS);
  }

  function add() {
    if (quantity >= MAX_QUANTITY) return flash("limit", `Ya tenés ${MAX_QUANTITY} en el carrito, el máximo por pedido.`);
    if (!cart.add(slug)) return flash("limit", "Llegaste al máximo de productos por pedido.");
    const n = quantity + 1;
    // La cantidad cambia en cada toque: así el lector de pantalla vuelve a anunciarlo
    flash("added", `${name} agregado al carrito, ${n} ${n === 1 ? "unidad" : "unidades"}.`);
  }

  // [lo que se ve siempre, lo que se agrega desde 640px]: en celular el botón va al lado de la foto y entra solo el verbo
  const [label, more] =
    feedback === "added"
      ? ["Agregado", ""]
      : feedback === "limit"
        ? ["Máximo", " por pedido"]
        : quantity > 0
          ? ["Agregar otro", ""]
          : ["Agregar", " al carrito"];

  return (
    <>
      <button
        type="button"
        onClick={add}
        aria-describedby={nameId}
        // Celular: del ancho de su texto, como en la referencia. Desde 640px: todo el ancho de la card
        className={`flex h-11 w-fit items-center justify-center gap-2 rounded-xl px-5 text-[0.9375rem] font-bold outline-none sm:h-12 sm:w-full sm:px-4 transition-colors focus-visible:ring-2 focus-visible:ring-aqua-dark focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none ${
          feedback === "added"
            ? "bg-aqua text-ink"
            : "bg-aqua-dark text-white hover:bg-[color-mix(in_oklab,var(--aqua-dark),var(--ink)_30%)]"
        }`}
      >
        {feedback === "added" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden className="size-5">
            <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <TrolleyIcon className="size-5" />
        )}
        <span>
          {label}
          {/* En celular no se ve, pero el lector de pantalla lo dice igual */}
          {more && <span className="sr-only sm:not-sr-only">{more}</span>}
        </span>
      </button>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </>
  );
}
