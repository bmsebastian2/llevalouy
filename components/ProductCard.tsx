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
      {/* Siempre cuadrada: la foto llena el cuadro, sin fondo ni franjas */}
      <div className="relative aspect-square overflow-hidden">
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
            className="object-cover object-center"
            preload={featured}
            placeholder={SHIMMER}
          />
        ) : (
          <NoPhoto name={p.name} />
        )}
      </div>

      <div
        // Celular: el texto entra en el alto de la foto cuadrada, así no queda franja debajo de la imagen
        className={`flex min-w-0 flex-col justify-center gap-1 px-3 py-2.5 ${
          featured ? "sm:gap-2.5 sm:p-8" : "sm:flex-1 sm:justify-start sm:gap-2 sm:p-5"
        }`}
      >
        <h2
          className={`line-clamp-2 text-[0.9375rem] font-bold leading-tight text-ink group-hover:underline group-hover:decoration-aqua-dark group-hover:decoration-2 group-hover:underline-offset-4 ${
            featured ? "sm:text-3xl sm:font-extrabold sm:leading-tight" : "sm:text-lg"
          }`}
        >
          {p.name}
        </h2>
        {featured && p.tagline && <p className="hidden text-ink/75 sm:line-clamp-2">{p.tagline}</p>}

        <p className="flex flex-wrap items-baseline gap-x-2">
          <span
            className={`whitespace-nowrap text-xl font-extrabold tabular-nums tracking-tight text-ink ${
              featured ? "sm:text-4xl" : "sm:text-3xl"
            }`}
          >
            {formatPrice(p.price)}
          </span>
          {off && p.compareAtPrice && (
            // role="img": así el aria-label se lee en todos los lectores de pantalla (en <s> se ignora)
            <span role="img" aria-label={`Precio anterior ${formatPrice(p.compareAtPrice)}`}>
              <s aria-hidden="true" className="whitespace-nowrap text-sm tabular-nums text-ink/65">
                {formatPrice(p.compareAtPrice)}
              </s>
            </span>
          )}
        </p>

        <DeliveryLine className="text-[0.8125rem] sm:text-sm" />
      </div>
    </Link>
  );
}
