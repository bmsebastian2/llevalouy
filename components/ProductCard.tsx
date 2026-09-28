import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import { SHIMMER } from "@/lib/shimmer";
import { DeliveryLine } from "./DeliveryPromise";
import NoPhoto from "./NoPhoto";

type Props = {
  product: Product;
  /** Card grande del bento: 2 columnas desde tablet, imagen con preload */
  featured?: boolean;
};

/**
 * Toda la tarjeta es un link al producto.
 * Celular: horizontal y compacta (foto cuadrada a la izquierda). Desde tablet: vertical, con el mismo orden.
 */
export default function ProductCard({ product: p, featured = false }: Props) {
  const off = discountPercent(p.price, p.compareAtPrice);
  const image = p.images[0];

  return (
    <Link
      href={`/p/${p.slug}`}
      className={`group grid h-full grid-cols-[40%_1fr] overflow-hidden rounded-3xl bg-white outline-none ring-1 ring-espuma transition-shadow hover:ring-aqua-dark/50 focus-visible:ring-4 focus-visible:ring-aqua-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
        featured ? "sm:grid-cols-2" : "sm:flex sm:flex-col"
      }`}
    >
      <div className={`relative aspect-square bg-foto ${featured ? "sm:aspect-auto sm:min-h-80" : ""}`}>
        {image ? (
          <Image
            src={image}
            alt={p.name}
            fill
            sizes={
              featured
                ? "(min-width: 1024px) 340px, (min-width: 640px) 50vw, 40vw"
                : "(min-width: 1024px) 330px, (min-width: 640px) 50vw, 40vw"
            }
            // multiply: los fondos blancos de las fotos se funden con el fondo neutro
            className="object-contain p-[6%] mix-blend-multiply"
            preload={featured}
            placeholder={SHIMMER}
          />
        ) : (
          <NoPhoto name={p.name} />
        )}
      </div>

      <div
        className={`flex min-w-0 flex-col justify-center gap-1.5 p-3.5 ${
          featured ? "sm:gap-2.5 sm:p-8" : "sm:flex-1 sm:justify-start sm:gap-2 sm:p-5"
        }`}
      >
        <h2
          className={`line-clamp-2 font-bold leading-snug text-ink group-hover:underline group-hover:decoration-aqua-dark group-hover:decoration-2 group-hover:underline-offset-4 ${
            featured ? "sm:text-3xl sm:font-extrabold sm:leading-tight" : "sm:text-lg"
          }`}
        >
          {p.name}
        </h2>
        {featured && p.tagline && <p className="hidden text-ink/75 sm:line-clamp-2">{p.tagline}</p>}

        <p className="flex flex-wrap items-baseline gap-x-2">
          <span
            className={`whitespace-nowrap text-2xl font-extrabold tabular-nums tracking-tight text-ink ${
              featured ? "sm:text-4xl" : "sm:text-3xl"
            }`}
          >
            {formatPrice(p.price)}
          </span>
          {off && p.compareAtPrice && (
            <s className="whitespace-nowrap text-sm tabular-nums text-ink/65">
              <span className="sr-only">Antes </span>
              {formatPrice(p.compareAtPrice)}
            </s>
          )}
        </p>

        <DeliveryLine />
      </div>
    </Link>
  );
}
