import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import ProductGallery from "./ProductGallery";
import CtaButton from "./CtaButton";
import DeliveryPromise from "./DeliveryPromise";

export default function ProductHero({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.compareAtPrice);

  return (
    // Celular: todo lo que hace falta para decidir entra en la primera pantalla (390×844)
    <section className="mx-auto max-w-5xl pt-3 md:grid md:grid-cols-2 md:gap-10 md:px-4 md:py-10">
      <ProductGallery images={product.images} alt={product.name} />

      <div className="px-4 pt-4 md:px-0 md:pt-2">
        <h1 className="display line-clamp-2 text-[1.75rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-1 line-clamp-1 leading-snug text-ink/75 sm:text-lg md:line-clamp-none">{product.tagline}</p>

        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-4xl font-extrabold tabular-nums leading-none tracking-tight text-ink sm:text-5xl">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && off && (
            <>
              <span role="img" aria-label={`Precio anterior ${formatPrice(product.compareAtPrice)}`}>
                <s aria-hidden="true" className="text-lg tabular-nums text-ink/65">
                  {formatPrice(product.compareAtPrice)}
                </s>
              </span>
              <span className="rounded-lg bg-aqua px-2 py-1 text-sm font-extrabold leading-none text-ink">
                -{off}%<span className="sr-only"> de descuento</span>
              </span>
            </>
          )}
        </p>

        <DeliveryPromise className="mt-3" />

        <CtaButton id="cta-principal" className="mt-3 w-full" />
      </div>
    </section>
  );
}
