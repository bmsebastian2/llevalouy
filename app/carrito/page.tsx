import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderForm from "@/components/OrderForm";
import { getActiveProducts } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tu carrito",
  robots: { index: false },
};

export default async function CartPage() {
  const products = await getActiveProducts();
  const catalog = products.map((p) => ({ slug: p.slug, name: p.name, price: p.price, image: p.images[0] }));

  return (
    <>
      <Header />
      <main className="px-4 pb-12 pt-8 sm:pt-10">
        <div className="mx-auto max-w-xl">
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">Tu carrito</h1>
          <p className="mt-1 text-ink/70">Todo llega en un solo envío. Pagás cuando te llega.</p>
          <div className="mt-6">
            <OrderForm catalog={catalog} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
