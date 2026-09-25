"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

export default function StickyCta({ price }: { price: number }) {
  const [hidden, setHidden] = useState(false);

  // Se oculta cuando la sección de pedido está en pantalla
  useEffect(() => {
    const target = document.querySelector(site.orderAnchor);
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.2 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 md:hidden ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
      aria-hidden={hidden}
    >
      <a
        href={site.orderAnchor}
        tabIndex={hidden ? -1 : 0}
        className="flex h-14 w-full items-center justify-between rounded-2xl bg-aqua px-5 text-lg font-extrabold text-ink outline-none focus-visible:ring-4 focus-visible:ring-aqua-dark/40 active:scale-[0.99]"
      >
        <span>Pedilo ahora</span>
        <span className="tabular-nums">{formatPrice(price)}</span>
      </a>
    </div>
  );
}
