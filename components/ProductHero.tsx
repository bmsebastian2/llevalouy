import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import ProductGallery from "./ProductGallery";
import CtaButton from "./CtaButton";
import AddToCartButton from "./AddToCartButton";

export default function ProductHero({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.compareAtPrice);
  const savings = off && product.compareAtPrice ? product.compareAtPrice - product.price : 0;

  return (
    <section className="mx-auto max-w-5xl md:grid md:grid-cols-2 md:gap-10 md:px-4 md:py-10">
      <ProductGallery images={product.images} alt={product.name} />

      <div className="px-4 pt-5 md:px-0 md:pt-4">
        {off && (
          <span className="inline-block rounded-full bg-ink px-3 py-1 text-sm font-bold text-white">
            🔥 {off}% OFF por tiempo limitado
          </span>
        )}
        <h1 className="mt-3 text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">{product.name}</h1>
        <p className="mt-3 text-lg leading-snug text-ink/75">{product.tagline}</p>

        {/* Precio como ticket: muescas laterales y sello de descuento */}
        <div className="ticket-notch mt-6 flex items-center justify-between gap-4 rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-ink/5">
          <div>
            <p className="text-4xl font-extrabold tabular-nums leading-none text-aqua-dark sm:text-5xl">
              {formatPrice(product.price)}
            </p>
            {product.compareAtPrice && off && (
              <p className="mt-2 text-sm text-ink/60">
                <span className="sr-only">Antes </span>
                <s>{formatPrice(product.compareAtPrice)}</s>
                <span className="mx-1.5 text-ink/30" aria-hidden>
                  ·
                </span>
                <strong className="font-bold text-ink">Ahorrás {formatPrice(savings)}</strong>
              </p>
            )}
          </div>
          {off && (
            <span
              className="flex size-[4.5rem] shrink-0 -rotate-12 flex-col items-center justify-center rounded-full border-2 border-dashed border-aqua-dark text-aqua-dark"
              aria-hidden
            >
              <span className="text-xl font-extrabold leading-none">-{off}%</span>
              <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest">Oferta</span>
            </span>
          )}
        </div>

        <CtaButton className="mt-5 w-full" />
        <AddToCartButton slug={product.slug} className="mt-3" />
        <p className="mt-3 text-center text-sm text-ink/60">💵 No pagás nada ahora · Pagás al recibir</p>
      </div>
    </section>
  );
}
