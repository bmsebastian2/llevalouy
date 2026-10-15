import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import HeroTrust from "@/components/HeroTrust";
import HeroPhoto from "@/components/HeroPhoto";
import RamblaLine from "@/components/RamblaLine";
import { getActiveProducts } from "@/lib/products";
import { site } from "@/lib/site";
import { getStoreWhatsapp, whatsappUrl } from "@/lib/whatsapp";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getActiveProducts();
  const whatsapp = getStoreWhatsapp();

  return (
    <>
      <Header />
      <main className="pb-8 sm:pb-10">
        {/* Hero compacto: en celular deja lugar para ver los productos sin scrollear */}
        <section>
          {/* La foto acompaña al titular y llega hasta el borde derecho; las señales quedan debajo, sobre liso */}
          <div className="relative">
            <HeroPhoto />
            <div className="page-container relative pt-5 sm:pt-10 lg:pb-6 lg:pt-16">
              <h1 className="display text-balance text-[2rem] font-extrabold leading-[1.05] tracking-tight sm:text-[2.75rem] lg:max-w-[34rem] lg:text-[3.25rem]">
                Hallazgos que te hacen la vida más fácil
              </h1>
              <p className="mt-1.5 text-lg font-medium text-ink/75 sm:mt-2 sm:text-xl">Pedís hoy, te lo llevamos hoy.</p>
            </div>
          </div>
          <div className="page-container">
            <HeroTrust whatsappHref={whatsapp && whatsappUrl(whatsapp)} className="mt-4 sm:mt-6 lg:mt-2" />
          </div>
        </section>

        <div className="page-container">
          <RamblaLine className="mt-5 sm:mt-8" />

          {products.length > 0 ? (
            // Celular: una columna. Desde 640px: 2 columnas; desde 1024px: 3
            <ul className="mt-5 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {products.map((p, i) => (
                <li key={p.id}>
                  <ProductCard product={p} preload={i === 0} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-[28px] bg-white px-6 py-10 text-center ring-1 ring-ink/5">
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
        </div>
      </main>
      <Footer />
    </>
  );
}
