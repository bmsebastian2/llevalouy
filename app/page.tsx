import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import BarrioNote from "@/components/BarrioNote";
import { getActiveProducts } from "@/lib/products";
import { site } from "@/lib/site";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <h1 className="display max-w-xl text-balance text-[2.25rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          Cosas útiles para la casa, en el día.
        </h1>
        <p className="mt-3 max-w-lg text-lg text-ink/75">
          Somos de Montevideo. Pedís, te lo llevamos y pagás cuando te llega.
        </p>
        <BarrioNote className="mt-3" />

        {products.length > 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {products.map((p, i) => (
              <li key={p.id} className={i === 0 ? "sm:col-span-2" : undefined}>
                <ProductCard product={p} index={i} featured={i === 0} label={i === 0 ? "Más vendido" : undefined} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-[28px] bg-white px-6 py-10 text-center ring-1 ring-ink/5">
            <svg viewBox="0 0 64 64" aria-hidden="true" className="mx-auto size-16 text-aqua-dark">
              <path d="M24 22c0-12 16-12 16 0" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              <rect x="12" y="20" width="40" height="36" rx="10" fill="currentColor" fillOpacity=".15" />
              <path d="M23 38l6 6 12-12" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="mt-4 text-xl font-extrabold">Estamos reponiendo</h2>
            <p className="mx-auto mt-2 max-w-sm text-ink/70">
              Ahora no hay productos disponibles. En Instagram avisamos apenas vuelven.
            </p>
            <a
              href={`https://instagram.com/${site.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-12 items-center rounded-2xl bg-aqua px-6 font-extrabold text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aqua-dark focus-visible:ring-offset-2"
            >
              Seguinos en @{site.instagram}
            </a>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
