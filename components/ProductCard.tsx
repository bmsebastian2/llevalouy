import Image from "next/image";
import Link from "next/link";
import { HIGHLIGHT_ICONS, type Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import { SHIMMER } from "@/lib/shimmer";
import AddToCartButton from "./AddToCartButton";
import { iconProps } from "./DeliveryIcons";
import HighlightIcon from "./HighlightIcon";
import NoPhoto from "./NoPhoto";

type Props = {
  product: Product;
  /** La primera de la grilla: su foto se precarga */
  preload?: boolean;
};

/** Ícono de una característica. El admin carga emojis, que no toman color: para esos va un check. */
function FeatureIcon({ icon }: { icon: string }) {
  const name = HIGHLIGHT_ICONS.find((n) => n === icon);
  if (name && name !== "check") return <HighlightIcon name={name} className="size-5" />;
  return (
    <svg {...iconProps} strokeWidth={2.25} className="size-5">
      <path d="m5.5 12.5 4 4 9-9" />
    </svg>
  );
}

/**
 * Celular: foto a la izquierda con nombre, precio y descripción al lado; características y botón abajo, a todo el ancho.
 * Desde 640px, en la grilla de 2 o 3 columnas: vertical, foto arriba.
 * Foto y nombre llevan al producto; el botón es aparte. Entrega y pago no van acá: ya los dice el hero.
 */
export default function ProductCard({ product: p, preload = false }: Props) {
  const off = discountPercent(p.price, p.compareAtPrice);
  const image = p.images[0];
  // El tagline es la descripción corta; la larga queda para la página del producto
  const summary = p.tagline.trim() || p.description.trim();
  const features = p.benefits.slice(0, 3);

  return (
    <div className="group grid h-full grid-cols-[min(40%,11rem)_1fr] gap-x-3 gap-y-4 rounded-3xl border border-ink/6 bg-white p-4 shadow-[0_8px_24px_rgb(11_42_42/0.06)] sm:flex sm:flex-col sm:gap-5">
      {/* Celular: cuadrada como mínimo y del alto del texto de al lado. w-full: sin él, al estirarse de alto también se ensancha */}
      <div className="relative aspect-square w-full self-stretch overflow-hidden rounded-[18px] bg-foto sm:aspect-[4/3]">
        {/* Mismo destino que el nombre: teclado y lector de pantalla usan solo el link del nombre */}
        <Link href={`/p/${p.slug}`} tabIndex={-1} aria-hidden className="absolute inset-0">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              // Celular: 40% de la card. Desde 640px: la card de la grilla menos borde y padding
              sizes="(min-width: 1024px) 278px, (min-width: 640px) calc(50vw - 68px), calc(40vw - 26px)"
              // Zoom leve con el mouse sobre la foto o el nombre; nada en pantallas táctiles ni con "reducir movimiento"
              className="object-cover transition-transform duration-300 ease-out motion-safe:[@media(hover:hover)]:group-has-[a:hover]:scale-[1.03]"
              preload={preload}
              placeholder={SHIMMER}
            />
          ) : (
            <NoPhoto name={p.name} />
          )}
        </Link>
        {off && (
          // El descuento se lee junto al precio
          <span
            aria-hidden
            className="pointer-events-none absolute left-2 top-2 rounded-full border-2 border-white bg-aqua-dark px-2.5 py-1 text-sm font-extrabold leading-tight tabular-nums text-white sm:left-3 sm:top-3 sm:px-3.5 sm:py-1.5 sm:text-lg"
          >
            −{off}%
          </span>
        )}
        {p.contextTag && (
          // Desde 640px va sobre la foto; en celular la foto es chica y la etiqueta va arriba del nombre
          <span className="pointer-events-none absolute bottom-3 left-3 hidden max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full bg-white/92 px-3 py-1.5 text-sm font-semibold text-ink sm:flex">
            <HighlightIcon name={p.contextTag.icon} className="size-4 shrink-0 text-aqua-dark" />
            <span className="truncate">{p.contextTag.text}</span>
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-center sm:justify-start">
        {p.contextTag && (
          <span className="mb-1.5 flex w-fit max-w-full items-center gap-1 rounded-full bg-aqua/15 px-2 py-0.5 text-xs font-semibold text-ink sm:hidden">
            <HighlightIcon name={p.contextTag.icon} className="size-3.5 shrink-0 text-aqua-dark" />
            <span className="truncate">{p.contextTag.text}</span>
          </span>
        )}
        <h2
          id={`nombre-${p.slug}`}
          className="text-lg font-extrabold leading-tight text-ink sm:text-[1.625rem] sm:leading-[1.15]"
        >
          <Link
            href={`/p/${p.slug}`}
            // after: área táctil de 48px o más aunque el nombre ocupe una línea. -mx-1 px-1: aire para el anillo de foco
            className="relative -mx-1 block rounded-lg px-1 outline-none after:absolute after:inset-x-0 after:-inset-y-3.5 focus-visible:ring-2 focus-visible:ring-aqua-dark focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <span className="line-clamp-2">{p.name}</span>
          </Link>
        </h2>

        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 sm:mt-2 sm:gap-x-2.5">
          <span className="whitespace-nowrap text-[1.375rem] font-extrabold leading-tight tabular-nums tracking-tight text-aqua-dark sm:text-[2.125rem]">
            {formatPrice(p.price)}
          </span>
          {off && p.compareAtPrice && (
            <>
              {/* role="img": así el aria-label se lee en todos los lectores de pantalla (en <s> se ignora) */}
              <span role="img" aria-label={`Precio anterior ${formatPrice(p.compareAtPrice)}`}>
                <s aria-hidden="true" className="whitespace-nowrap text-sm tabular-nums text-ink/70 sm:text-xl">
                  {formatPrice(p.compareAtPrice)}
                </s>
              </span>
              <span className="sr-only">{off}% de descuento</span>
            </>
          )}
        </p>

        {summary && <p className="mt-1 line-clamp-2 text-sm text-ink/70 sm:mt-2 sm:text-base">{summary}</p>}
      </div>

      {features.length > 0 && (
        // Celular: a todo el ancho, debajo de la foto; al lado no entran legibles
        <ul className="col-span-2 grid gap-2.5">
          {features.map((b, i) => (
            <li key={i} className="flex items-center gap-3 text-[0.9375rem] leading-snug text-ink/80">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-aqua/15 text-aqua-dark">
                <FeatureIcon icon={b.icon} />
              </span>
              <span className="line-clamp-2 min-w-0">{b.text}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Abajo de todo: en la grilla, los botones de una misma fila quedan alineados */}
      <div className="col-span-2 sm:mt-auto">
        <AddToCartButton slug={p.slug} name={p.name} nameId={`nombre-${p.slug}`} />
      </div>
    </div>
  );
}
