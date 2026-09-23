"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProductUsageMedia } from "@/types/product";
import { SHIMMER } from "@/lib/shimmer";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const FRAME = "relative aspect-[4/5] overflow-hidden rounded-2xl bg-aqua/10 sm:aspect-video";

export default function UsageMedia({ item }: { item: ProductUsageMedia }) {
  return (
    <figure>
      {item.type === "video" ? (
        <UsageVideo src={item.src} poster={item.poster} label={item.caption} />
      ) : (
        <div className={FRAME}>
          <Image
            src={item.src}
            alt={item.caption}
            fill
            sizes="(min-width: 1024px) 992px, 100vw"
            className="object-cover"
            placeholder={SHIMMER}
          />
        </div>
      )}
      <figcaption className="mt-2 px-1 text-sm font-medium text-ink/70">{item.caption}</figcaption>
    </figure>
  );
}

function UsageVideo({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useReducedMotion();

  // Se reproduce solo mientras está en pantalla. Con "reducir movimiento" no arranca solo,
  // pero igual se pausa al salir si el usuario lo había puesto a reproducir.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.pause();
        else if (!reducedMotion) video.play().catch(() => {});
      },
      { threshold: 0.5 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reducedMotion]);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  return (
    <div className={FRAME}>
      {/* Sin atributo autoPlay: así no arranca fuera de pantalla ni ignora "reducir movimiento" antes de hidratar. */}
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 size-full object-cover"
      />
      {reducedMotion &&
        (playing ? (
          <button
            type="button"
            onClick={toggle}
            aria-label="Pausar video"
            className="absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full bg-ink/65 text-white backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua-dark"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
              <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={toggle}
            aria-label="Reproducir video"
            className="absolute inset-0 flex items-center justify-center bg-ink/15 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-aqua-dark"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-white/90 text-aqua-dark shadow-lg">
              <svg viewBox="0 0 24 24" className="ml-1 size-7" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        ))}
    </div>
  );
}
