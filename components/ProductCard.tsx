import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import { SHIMMER } from "@/lib/shimmer";

type Props = {
  product: Product;
  /** Card grande del bento: 2 columnas desde tablet, imagen con preload */
  featured?: boolean;
  /** Etiqueta arriba a la izquierda, ej: "Más vendido" */
  label?: string;
  /** Posición en la grilla: varía el giro de la bolsa de fondo para que no se vean todas iguales */
  index?: number;
};

const TILTS = ["-rotate-6", "rotate-3", "-rotate-2"];

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Silueta de la bolsa del logo, blanda y un poco torcida: el fondo sobre el que "cae" el producto */
function BagShape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className}>
      <path d="M72 64C72 26 128 22 128 64" fill="none" stroke="currentColor" strokeOpacity=".45" strokeWidth="13" strokeLinecap="round" />
      <path
        d="M36 84c2-15 14-23 30-23h70c17 0 27 9 29 24l9 64c3 23-12 39-35 39H62c-24 0-40-15-36-39z"
        fill="currentColor"
        fillOpacity=".3"
      />
    </svg>
  );
}

export default function ProductCard({ product: p, featured = false, label, index = 0 }: Props) {
  const off = discountPercent(p.price, p.compareAtPrice);

  return (
    <Link
      href={`/p/${p.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_1px_2px_rgb(11_42_42/0.06)] ring-1 ring-ink/5 transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_40px_-20px_rgb(11_42_42/0.4)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aqua-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        featured ? "sm:grid sm:grid-cols-2" : ""
      }`}
    >
      {/* Escenario de la foto: fondo aqua suave + bolsa detrás del producto */}
      <div
        className={`relative isolate overflow-hidden bg-aqua/15 ${
          featured ? "aspect-square sm:aspect-auto sm:min-h-80" : "aspect-[5/4]"
        }`}
      >
        <BagShape
          className={`absolute inset-0 -z-10 m-auto size-[92%] text-aqua ${TILTS[index % TILTS.length]}`}
        />
        <div className="absolute inset-x-[12%] bottom-[5%] top-[20%] transition-transform duration-500 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
          <Image
            src={p.images[0]}
            alt={p.name}
            fill
            sizes={
              featured
                ? "(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
                : "(min-width: 1024px) 330px, (min-width: 640px) 50vw, 100vw"
            }
            // multiply: los fondos blancos de las fotos de producto se funden con el aqua
            className="rounded-2xl object-contain mix-blend-multiply"
            preload={featured}
            placeholder={SHIMMER}
          />
        </div>

        {label && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white py-1 pl-2 pr-3 text-xs font-bold text-ink shadow-sm">
            <Check className="size-3.5 text-aqua-dark" />
            {label}
          </span>
        )}

        {off && (
          <span className="absolute right-3 top-3 grid size-16 -rotate-[8deg] place-items-center rounded-full bg-aqua-dark text-lg font-extrabold leading-none tracking-tight text-white shadow-[0_6px_14px_-6px_rgb(11_42_42/0.5)]">
            {/* Borde punteado de etiqueta de precio */}
            <span aria-hidden="true" className="absolute inset-1 rounded-full border-2 border-dashed border-white/35" />
            <span aria-hidden="true">-{off}%</span>
            <span className="sr-only">{off}% de descuento</span>
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col p-4 ${featured ? "sm:justify-center sm:p-7" : "sm:p-5"}`}>
        <h2
          className={`line-clamp-2 text-ink ${
            featured ? "text-2xl font-extrabold leading-tight sm:text-3xl" : "text-lg font-bold leading-snug"
          }`}
        >
          {p.name}
        </h2>
        {featured && p.tagline && <p className="mt-1.5 line-clamp-2 text-ink/70">{p.tagline}</p>}

        <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
          <span
            className={`whitespace-nowrap font-extrabold tracking-tight text-ink ${featured ? "text-4xl" : "text-3xl"}`}
          >
            {formatPrice(p.price)}
          </span>
          {off && p.compareAtPrice && (
            <s className="whitespace-nowrap text-sm text-ink/65">
              <span className="sr-only">Antes </span>
              {formatPrice(p.compareAtPrice)}
            </s>
          )}
        </p>

        <p className="mt-2 text-xs text-ink/70">
          <span aria-hidden="true">🚚</span> Envío en el día <span aria-hidden="true">·</span>{" "}
          <span aria-hidden="true">💵</span> Pagás al recibir
        </p>

        {/* CTA visual: el link es toda la card */}
        <span className="mt-auto pt-4">
          <span className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-aqua text-base font-extrabold text-ink transition-colors duration-200 group-hover:bg-[#27b5a8] motion-reduce:transition-none">
            Llevalo
            <span aria-hidden="true" className="relative grid size-6 place-items-center">
              <span className="transition duration-200 group-hover:translate-x-1 group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                →
              </span>
              <span className="absolute inset-0 grid scale-50 place-items-center rounded-full bg-ink text-aqua opacity-0 transition duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                <Check className="size-4" />
              </span>
            </span>
          </span>
        </span>
      </div>
    </Link>
  );
}
