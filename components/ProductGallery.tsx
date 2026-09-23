"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { SHIMMER } from "@/lib/shimmer";

type Props = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) setActive(i);
  }

  function goTo(i: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div>
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto md:rounded-3xl"
          aria-roledescription="carrusel"
          aria-label={`Fotos de ${alt}`}
        >
          {images.map((src, i) => (
            <div key={src} className="relative aspect-square w-full shrink-0 snap-center">
              <Image
                src={src}
                alt={`${alt} — foto ${i + 1} de ${images.length}`}
                fill
                sizes="(min-width: 768px) 480px, 100vw"
                className="object-cover"
                preload={i === 0}
                placeholder={SHIMMER}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <span
                key={src}
                className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-ink" : "w-2 bg-ink/30"}`}
              />
            ))}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 hidden gap-2 md:flex">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === active}
              className={`relative size-16 overflow-hidden rounded-xl ring-2 transition ${
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
