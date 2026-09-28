"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

/** Id del botón "Pedilo ahora" de arriba: la barra aparece recién cuando ese botón sale de pantalla */
const MAIN_CTA = "#cta-principal";

export default function StickyCta({ price }: { price: number }) {
  const [mainVisible, setMainVisible] = useState(true);
  const [orderVisible, setOrderVisible] = useState(false);

  useEffect(() => {
    const main = document.querySelector(MAIN_CTA);
    const order = document.querySelector(site.orderAnchor);
    const ios: IntersectionObserver[] = [];
    if (main) {
      const io = new IntersectionObserver(([entry]) => setMainVisible(entry.isIntersecting));
      io.observe(main);
      ios.push(io);
    }
    // Se oculta cuando la sección de pedido está en pantalla
    if (order) {
      const io = new IntersectionObserver(([entry]) => setOrderVisible(entry.isIntersecting), { threshold: 0.2 });
      io.observe(order);
      ios.push(io);
    }
    return () => ios.forEach((io) => io.disconnect());
  }, []);

  const shown = !mainVisible && !orderVisible;

  // Sin animación: aparece y desaparece en seco (el único movimiento de la página es la hoja de barrios)
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-espuma bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 pt-3 md:hidden ${
        shown ? "" : "invisible"
      }`}
      aria-hidden={!shown}
      inert={!shown}
    >
      <div className="flex items-center gap-4">
        <p className="shrink-0 text-2xl font-extrabold tabular-nums leading-none tracking-tight">
          <span className="sr-only">Precio: </span>
          {formatPrice(price)}
        </p>
        <a
          href={site.orderAnchor}
          className="flex h-13 flex-1 items-center justify-center rounded-2xl bg-aqua px-5 text-lg font-extrabold text-ink outline-none focus-visible:ring-4 focus-visible:ring-aqua-dark/40"
        >
          Pedilo ahora
        </a>
      </div>
    </div>
  );
}
