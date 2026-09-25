"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cart, useCart } from "@/lib/cart";
import { CartIcon } from "./CartButton";

/** Botón chico de la tarjeta de producto: agrega al carrito sin entrar al producto; si ya está, lleva al carrito */
export default function CardCartButton({ slug, name }: { slug: string; name: string }) {
  const router = useRouter();
  const inCart = useCart().some((it) => it.slug === slug);
  const [announce, setAnnounce] = useState("");

  function onClick() {
    if (inCart) return router.push("/carrito");
    setAnnounce(cart.add(slug) ? `${name} agregado al carrito.` : "Tu carrito está lleno.");
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={inCart ? `${name} está en tu carrito. Ver carrito` : `Agregar ${name} al carrito`}
        className={`relative z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl outline-none transition focus-visible:ring-4 focus-visible:ring-aqua-dark focus-visible:ring-offset-2 active:scale-95 motion-reduce:transition-none ${
          inCart ? "bg-ink text-aqua" : "bg-white text-ink ring-2 ring-ink/15 hover:ring-ink/30"
        }`}
      >
        <CartIcon className="size-6" />
        <span
          className={`absolute right-1 top-1 flex size-[18px] items-center justify-center rounded-full text-white ring-2 ${
            inCart ? "bg-aqua-dark ring-ink" : "bg-aqua-dark ring-white"
          }`}
          aria-hidden
        >
          {inCart ? (
            <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
              <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <span className="text-sm font-extrabold leading-none">+</span>
          )}
        </span>
      </button>
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>
    </>
  );
}
