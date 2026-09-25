"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function CartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M8 8V7a4 4 0 0 1 8 0v1" strokeLinecap="round" />
      <path d="M5.5 8h13l-1 11.2a2 2 0 0 1-2 1.8h-7a2 2 0 0 1-2-1.8z" strokeLinejoin="round" />
    </svg>
  );
}

/** Acceso al carrito del Header, con la cantidad de unidades */
export default function CartButton({ className = "" }: { className?: string }) {
  const count = useCart().reduce((sum, it) => sum + it.quantity, 0);

  return (
    <Link
      href="/carrito"
      aria-label={count > 0 ? `Carrito, ${count} ${count === 1 ? "producto" : "productos"}` : "Carrito"}
      className={`relative flex size-10 items-center justify-center rounded-xl text-ink outline-none transition hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-aqua-dark ${className}`}
    >
      <CartIcon className="size-6" />
      {count > 0 && (
        <span
          className="item-in absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-aqua-dark px-1 text-xs font-extrabold tabular-nums text-white ring-2 ring-bg"
          aria-hidden
        >
          {count}
        </span>
      )}
    </Link>
  );
}
