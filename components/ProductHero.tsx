import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import ProductGallery from "./ProductGallery";
import CtaButton from "./CtaButton";
import AddToCartButton from "./AddToCartButton";
import BarrioCheck from "./BarrioCheck";

export default function ProductHero({ product }: { product: Product }) {
  const before = product.compareAtPrice && product.compareAtPrice > product.price ? product.compareAtPrice : null;

  return (
    <section className="mx-auto max-w-5xl md:grid md:grid-cols-2 md:gap-10 md:px-4 md:py-10">
      <ProductGallery images={product.images} alt={product.name} />

      <div className="px-4 pt-5 md:px-0 md:pt-4">
        <h1 className="display text-[2.25rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl">{product.name}</h1>
        <p className="mt-3 text-lg leading-snug text-ink/75">{product.tagline}</p>

        {/* El precio va solo, sin caja: la única caja debajo es la del barrio */}
        <p className="mt-6 flex flex-wrap items-baseline gap-x-3">
          <span className="text-[2.75rem] font-extrabold tabular-nums leading-none tracking-tight">
            {formatPrice(product.price)}
          </span>
          {before && (
            <span className="text-base text-ink/65">
              antes <s className="tabular-nums">{formatPrice(before)}</s>
            </span>
          )}
        </p>
        <p className="mt-2 text-ink/75">Efectivo o transferencia al recibir. No pagás nada ahora.</p>

        <BarrioCheck className="mt-5" />

        <CtaButton className="mt-5 w-full" />
        <AddToCartButton slug={product.slug} className="mt-3" />
      </div>
    </section>
  );
}
