"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { SHIMMER } from "@/lib/shimmer";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const total = images.length;
  const isLast = active === total - 1;

  // La slide activa es la que tiene mayor parte visible dentro del carrusel.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const ratios = slides.map(() => 0);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios[slides.indexOf(e.target as HTMLElement)] = e.intersectionRatio;
        let best = 0;
        ratios.forEach((r, i) => {
          if (r > ratios[best]) best = i;
        });
        setActive(best);
      },
      { root: track, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [total]);

  function goTo(i: number) {
    const slide = trackRef.current?.children[Math.max(0, Math.min(i, total - 1))];
    slide?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "nearest", inline: "start" });
  }

  function onKeyDown(e: KeyboardEvent) {
    const target = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: total - 1 }[e.key];
    if (target === undefined) return;
    e.preventDefault();
    goTo(target);
  }

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label={alt}
      // --slide-w: en mobile ~78% para que se asome la siguiente, sin pasar la mitad del alto de pantalla.
      className="group @container relative [--pad:1rem] [--slide-w:min(calc(80cqw_-_1rem),50svh)] md:[--pad:0px] lg:[--slide-w:100cqw]"
    >
      <div className="relative">
        <div
          ref={trackRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-label="Fotos del producto. Usá las flechas del teclado para cambiar de foto."
          className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-(--pad) scroll-px-(--pad) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua-dark lg:gap-0 lg:rounded-3xl"
        >
          {images.map((src, i) => (
            <div
              key={src}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`Imagen ${i + 1} de ${total}`}
              className="relative aspect-square w-(--slide-w) shrink-0 snap-start snap-always overflow-hidden rounded-2xl bg-aqua/10 lg:rounded-none"
            >
              <Image
                src={src}
                alt={`${alt}, foto ${i + 1} de ${total}`}
                fill
                sizes="(min-width: 1024px) 480px, (min-width: 768px) 40vw, 85vw"
                className="object-cover"
                preload={i === 0}
                placeholder={SHIMMER}
              />
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            {/* Contador anclado a la esquina de la slide activa (la última queda pegada al borde derecho). */}
            <span
              aria-hidden
              className="pointer-events-none absolute top-3 rounded-full bg-ink/65 px-2.5 py-1 text-xs font-bold tabular-nums tracking-wide text-white backdrop-blur-sm"
              style={
                isLast
                  ? { right: "calc(var(--pad) + 0.75rem)" }
                  : { left: "calc(var(--pad) + var(--slide-w) - 0.75rem)", transform: "translateX(-100%)" }
              }
            >
              {active + 1}/{total}
            </span>

            <ArrowButton dir="prev" hidden={active === 0} onClick={() => goTo(active - 1)} />
            <ArrowButton dir="next" hidden={isLast} onClick={() => goTo(active + 1)} />
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-2 flex justify-center lg:hidden">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir a la imagen ${i + 1} de ${total}`}
              aria-current={i === active ? "true" : undefined}
              className="flex h-6 items-center px-1"
            >
              <span
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${
                  i === active ? "w-5 bg-aqua-dark" : "w-1.5 bg-ink/25"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {total > 1 && (
        <div className="mt-3 hidden gap-2 lg:flex">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver imagen ${i + 1} de ${total}`}
              aria-current={i === active ? "true" : undefined}
              className={`relative size-16 overflow-hidden rounded-xl bg-aqua/10 ring-2 transition ${
                i === active ? "ring-aqua-dark" : "ring-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" placeholder={SHIMMER} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ArrowButton({ dir, hidden, onClick }: { dir: "prev" | "next"; hidden: boolean; onClick: () => void }) {
  if (hidden) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Imagen anterior" : "Imagen siguiente"}
      className={`absolute top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-md ring-1 ring-ink/10 transition hover:bg-white focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-aqua-dark lg:flex lg:opacity-0 lg:group-hover:opacity-100 ${
        dir === "prev" ? "left-3" : "right-3"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
        <path d={dir === "prev" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
