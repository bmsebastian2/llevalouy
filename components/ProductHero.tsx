import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import ProductGallery from "./ProductGallery";
import CtaButton from "./CtaButton";

export default function ProductHero({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.compareAtPrice);

  return (
    <section className="mx-auto max-w-5xl md:grid md:grid-cols-2 md:gap-10 md:px-4 md:py-10">
      <ProductGallery images={product.images} alt={product.name} />

      <div className="px-4 pt-5 md:px-0 md:pt-4">
        {off && (
          <span className="inline-block rounded-full bg-ink px-3 py-1 text-sm font-bold text-white">
            🔥 {off}% OFF por tiempo limitado
          </span>
        )}
        <h1 className="mt-3 text-3xl font-extrabold leading-[1.1] sm:text-4xl">{product.name}</h1>
        <p className="mt-2 text-lg text-ink/75">{product.tagline}</p>

        <div className="mt-5 flex items-end gap-3">
          <span className="text-4xl font-extrabold text-aqua-dark">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="pb-1 text-lg text-ink/50">
              <span className="sr-only">Antes </span>
              <s>{formatPrice(product.compareAtPrice)}</s>
            </span>
          )}
          {off && (
            <span className="mb-1.5 rounded-md bg-aqua/20 px-2 py-0.5 text-sm font-bold text-aqua-dark">
              -{off}%
            </span>
          )}
        </div>

        <CtaButton className="mt-6 w-full" />
        <p className="mt-3 text-center text-sm text-ink/60">💵 No pagás nada ahora · Pagás al recibir</p>
      </div>
    </section>
  );
}
