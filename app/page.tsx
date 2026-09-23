import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getActiveProducts } from "@/lib/products";
import { discountPercent, formatPrice } from "@/lib/format";
import { SHIMMER } from "@/lib/shimmer";

export const revalidate = 60;

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

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {products.map((p, i) => {
            const off = discountPercent(p.price, p.compareAtPrice);
            return (
              <li key={p.id} className="flex">
                <Link
                  href={`/p/${p.slug}`}
                  className="group flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition hover:shadow-md"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 330px, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition group-hover:scale-[1.02]"
                      loading={i < 2 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : "auto"}
                      placeholder={SHIMMER}
                    />
                    {off && (
                      <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-0.5 text-xs font-bold text-white">
                        -{off}%
                      </span>
                    )}
                  </div>
                  {/* Mismo alto en todas: título a 2 líneas fijas y precio pegado abajo */}
                  <div className="flex flex-1 flex-col p-3">
                    <h2 className="line-clamp-2 min-h-[2.5em] text-[15px] font-bold leading-tight sm:text-base">
                      {p.name}
                    </h2>
                    <div className="mt-auto pt-2">
                      <s className="block h-4 text-xs leading-4 text-ink/50">
                        {p.compareAtPrice ? formatPrice(p.compareAtPrice) : ""}
                      </s>
                      <span className="block whitespace-nowrap text-lg font-extrabold leading-tight text-aqua-dark">
                        {formatPrice(p.price)}
                      </span>
                    </div>
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
