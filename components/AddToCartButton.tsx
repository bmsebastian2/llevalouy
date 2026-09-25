"use client";

import Link from "next/link";
import { useState } from "react";
import { cart, useCart } from "@/lib/cart";
import { CartIcon } from "./CartButton";

/** Guarda el producto en el carrito para pedirlo junto con otros */
export default function AddToCartButton({ slug, className = "" }: { slug: string; className?: string }) {
  const inCart = useCart().find((it) => it.slug === slug);
  const [full, setFull] = useState(false);

  if (inCart) {
    return (
      <div className={`flex items-center gap-2 ${className}`} role="status">
        <span className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-aqua/15 font-bold text-aqua-dark">
          <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          En tu carrito{inCart.quantity > 1 ? ` · ${inCart.quantity}` : ""}
        </span>
        <Link
          href="/carrito"
          className="flex h-12 items-center gap-1.5 rounded-2xl bg-ink px-5 font-extrabold text-white outline-none transition focus-visible:ring-2 focus-visible:ring-aqua active:scale-[0.98]"
        >
          Ver carrito <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setFull(!cart.add(slug))}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white font-extrabold text-ink outline-none ring-2 ring-ink/15 transition hover:ring-ink/30 focus-visible:ring-aqua-dark active:scale-[0.98]"
      >
        <CartIcon className="size-5" />
        Agregar al carrito
      </button>
      {full && (
        <p role="alert" className="mt-2 text-center text-sm font-medium text-red-600">
          Tu carrito está lleno. Hacé este pedido y después seguís.
        </p>
      )}
    </div>
  );
}
