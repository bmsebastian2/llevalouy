import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import DeliveryPromise from "@/components/DeliveryPromise";
import RamblaLine from "@/components/RamblaLine";
import { getActiveProducts } from "@/lib/products";
import { BARRIOS, DELIVERY_DAYS } from "@/lib/delivery";
import { site } from "@/lib/site";

export const revalidate = 60;

const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

/** [1, 2, 3, 4, 5, 6] → "de lunes a sábado"; si los días no son seguidos, los nombra: "lunes, miércoles y viernes" */
function deliveryDaysText(days: number[]) {
  const sorted = [...days].sort((a, b) => a - b);
  const consecutive = sorted.every((d, i) => i === 0 || d === sorted[i - 1] + 1);
  if (sorted.length > 2 && consecutive) return `de ${WEEKDAYS[sorted[0]]} a ${WEEKDAYS[sorted[sorted.length - 1]]}`;
  const names = sorted.map((d) => WEEKDAYS[d]);
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}` : names.join("");
}

const cutoffHour = (BARRIOS.find((b) => b.sameDay) ?? BARRIOS[0]).cutoffHour;

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-8 sm:pb-10">
        {/* Hero compacto: en celular deja lugar para ver los productos sin scrollear */}
        <section className="pt-5 sm:pt-10">
          <h1 className="display text-balance text-[2rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Cosas útiles para la casa.
          </h1>
          <p className="mt-1.5 text-lg font-medium text-ink/75 sm:text-xl" aria-describedby="nota-entrega">
            Pedís hoy, te lo llevamos hoy.<span aria-hidden="true">*</span>
          </p>
          <DeliveryPromise variant="short" className="mt-4 max-w-sm" />
        </section>
        <RamblaLine className="mt-5 sm:mt-8" />

        {products.length > 0 ? (
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {products.map((p, i) => (
              <li key={p.id} className={i === 0 ? "sm:col-span-2" : undefined}>
                <ProductCard product={p} featured={i === 0} />
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

        <p id="nota-entrega" className="mt-6 max-w-xl text-sm leading-snug text-ink/70 sm:mt-8">
          <span aria-hidden="true">*</span>Entrega en el día para pedidos hechos antes de las {cutoffHour}:00,{" "}
          {deliveryDaysText(DELIVERY_DAYS)}, en los barrios con entrega en el día. Si pedís después, te llega el
          próximo día de reparto.
        </p>
      </main>
      <Footer />
    </>
  );
}
