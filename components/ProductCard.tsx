import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import { productShareText } from "@/lib/share";
import { SHIMMER } from "@/lib/shimmer";
import AddToCartButton from "./AddToCartButton";
import HighlightIcon from "./HighlightIcon";
import NoPhoto from "./NoPhoto";
import ShareButton from "./ShareButton";

type Props = {
  product: Product;
  /** La primera de la grilla: su foto se precarga */
  preload?: boolean;
};

/**
 * Celular: foto a la izquierda, de todo el alto de la card; al lado nombre, precio, frase breve y el botón "Agregar".
 * Desde 640px, en la grilla de 2 o 3 columnas: vertical, foto arriba con un margen fino y botón a todo el ancho.
 * Foto y nombre llevan al producto; el botón es aparte. Entrega y pago no van acá: ya los dice el hero.
 */
export default function ProductCard({ product: p, preload = false }: Props) {
  const off = discountPercent(p.price, p.compareAtPrice);
  const image = p.images[0];
  // Frase breve con ícono; sin ella, la frase corta del producto (sin ícono: no es un beneficio). Sin ninguna, no hay fila.
  const blurb = p.highlight ?? (p.tagline.trim() || undefined);

  return (
    <div className="group grid h-full grid-cols-[min(40%,11rem)_1fr] gap-x-3.5 rounded-[20px] border border-ink/6 bg-white p-2 shadow-[0_8px_24px_rgb(11_42_42/0.06)] sm:flex sm:flex-col sm:gap-4 sm:p-2.5">
      {/* Celular: cuadrada como mínimo y del alto de todo lo de al lado. w-full: sin él, al estirarse de alto también se ensancha */}
      <div className="relative aspect-square w-full self-stretch overflow-hidden rounded-xl bg-foto sm:aspect-[3/2]">
        {/* Mismo destino que el nombre: teclado y lector de pantalla usan solo el link del nombre */}
        <Link href={`/p/${p.slug}`} tabIndex={-1} aria-hidden className="absolute inset-0">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              // Celular: 40% de la card. Desde 640px: la card de la grilla menos borde y padding
              sizes="(min-width: 1024px) 290px, (min-width: 640px) calc(50vw - 56px), calc(40vw - 20px)"
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
            className="pointer-events-none absolute right-2 top-2 rounded-full bg-aqua-dark px-2.5 py-1 text-[0.8125rem] font-bold leading-none tabular-nums text-white"
          >
            −{off}%
          </span>
        )}
        {p.contextTag && (
          // Desde 640px va sobre la foto; en celular la foto es chica y la etiqueta va arriba del nombre
          <span className="pointer-events-none absolute bottom-2 left-2 hidden max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[0.8125rem] font-semibold text-ink sm:flex">
            <HighlightIcon name={p.contextTag.icon} solid className="size-4 shrink-0 text-aqua-dark" />
            <span className="truncate">{p.contextTag.text}</span>
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-col py-1.5 pr-1.5 sm:flex-1 sm:px-2 sm:pb-1 sm:pt-0">
        {p.contextTag && (
          <span className="mb-1.5 flex w-fit max-w-full items-center gap-1 rounded-full bg-aqua/15 px-2 py-0.5 text-xs font-semibold text-ink sm:hidden">
            <HighlightIcon name={p.contextTag.icon} solid className="size-3.5 shrink-0 text-aqua-dark" />
            <span className="truncate">{p.contextTag.text}</span>
          </span>
        )}
        {/* Compartir va al lado del nombre: junto a "Agregar" no entra a 360px, y sobre la foto la taparía */}
        <div className="flex items-start gap-1">
          <h2 id={`nombre-${p.slug}`} className="min-w-0 flex-1 text-base font-bold leading-tight text-ink sm:text-[1.1875rem]">
            <Link
              href={`/p/${p.slug}`}
              // after: área táctil de 48px o más aunque el nombre ocupe una línea. -mx-1 px-1: aire para el anillo de foco
              className="relative -mx-1 block rounded-lg px-1 outline-none after:absolute after:inset-x-0 after:-inset-y-3.5 focus-visible:ring-2 focus-visible:ring-aqua-dark focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <span className="line-clamp-2">{p.name}</span>
            </Link>
          </h2>
          {/* Márgenes negativos: el ícono queda alineado con la primera línea y el borde sin empujar el precio; el área táctil sigue siendo de 44px */}
          <ShareButton
            variant="card"
            title={p.name}
            text={productShareText(p)}
            path={`/p/${p.slug}`}
            label={`Compartir ${p.name}`}
            className="-my-3 -mr-3 shrink-0"
          />
        </div>

        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 sm:mt-1.5">
          <span className="whitespace-nowrap text-2xl font-extrabold leading-tight tabular-nums tracking-tight text-ink sm:text-[1.625rem]">
            {formatPrice(p.price)}
          </span>
          {off && p.compareAtPrice && (
            <>
              {/* role="img": así el aria-label se lee en todos los lectores de pantalla (en <s> se ignora) */}
              <span role="img" aria-label={`Precio anterior ${formatPrice(p.compareAtPrice)}`}>
                <s aria-hidden="true" className="whitespace-nowrap text-sm tabular-nums text-ink/70 sm:text-[0.9375rem]">
                  {formatPrice(p.compareAtPrice)}
                </s>
              </span>
              <span className="sr-only">{off}% de descuento</span>
            </>
          )}
        </p>

        {blurb && (
          // Celular: hasta 2 líneas al lado de la foto. Desde 640px: 1 línea
          <p className="mt-1 flex items-start gap-1.5 text-[0.8125rem] leading-snug text-ink/80 sm:mt-1.5 sm:items-center sm:gap-2 sm:text-[0.9375rem]">
            {p.highlight && (
              // Con dos líneas, el ícono acompaña a la primera
              <HighlightIcon
                name={p.highlightIcon ?? "check"}
                solid
                className="mt-px size-4 shrink-0 text-aqua sm:mt-0 sm:size-5"
              />
            )}
            <span className="line-clamp-2 min-w-0 sm:line-clamp-1">{blurb}</span>
          </p>
        )}

        {/* Abajo de todo: en la grilla, los botones de una misma fila quedan alineados */}
        <div className="mt-auto pt-3 sm:-mx-1 sm:pt-4">
          <AddToCartButton slug={p.slug} name={p.name} nameId={`nombre-${p.slug}`} />
        </div>
      </div>
    </div>
  );
}
