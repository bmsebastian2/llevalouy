import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getActiveProducts } from "@/lib/products";
import { discountPercent, formatPrice } from "@/lib/format";

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          Llevalo hoy, <span className="text-aqua-dark">pagás al recibir.</span>
        </h1>
        <p className="mt-2 text-ink/70">Envío en el día en Montevideo y a todo el país.</p>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {products.map((p, i) => {
            const off = discountPercent(p.price, p.compareAtPrice);
            return (
              <li key={p.id}>
                <Link
                  href={`/p/${p.slug}`}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition hover:shadow-md"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="(min-width: 640px) 33vw, 50vw"
                      className="object-cover transition group-hover:scale-[1.02]"
                      priority={i < 2}
                    />
                    {off && (
                      <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-0.5 text-xs font-bold text-white">
                        -{off}%
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h2 className="font-bold leading-snug">{p.name}</h2>
                    <p className="mt-1 flex items-baseline gap-2">
                      <span className="text-lg font-extrabold text-aqua-dark">{formatPrice(p.price)}</span>
                      {p.compareAtPrice && (
                        <s className="text-sm text-ink/50">{formatPrice(p.compareAtPrice)}</s>
                      )}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
      <Footer />
    </>
  );
}
