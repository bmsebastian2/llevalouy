import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ProductHero from "@/components/ProductHero";
import TrustBar from "@/components/TrustBar";
import Benefits from "@/components/Benefits";
import HowToBuy from "@/components/HowToBuy";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import StickyCta from "@/components/StickyCta";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";
import { getActiveProducts, getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/format";

// Los cambios de producto en Supabase se reflejan en hasta 60 s.
export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };

  const description = `${product.tagline} ${formatPrice(product.price)} · Pagás al recibir.`;
  const image = product.images[0];

  return {
    title: product.name,
    description,
    alternates: { canonical: `/p/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      url: `/p/${product.slug}`,
      images: image ? [{ url: image, width: 1200, height: 1200, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <Header cta />
      <main className="pb-24 md:pb-0">
        <ProductHero product={product} />
        <TrustBar />
        <Benefits benefits={product.benefits} description={product.description} media={product.usageMedia} />
        <HowToBuy />
        <Reviews reviews={product.reviews} />
        <Faq faqs={product.faqs} />

        {/* El cierre y el formulario son una sola sección: la tarjeta sube desde la franja oscura */}
        <section id="pedido" aria-labelledby="pedido-titulo" className="scroll-mt-14">
          <div className="bg-ink px-4 pb-28 pt-12 text-center text-white sm:pt-16">
            <div className="mx-auto max-w-xl">
              <p id="pedido-titulo" className="text-3xl font-extrabold leading-tight sm:text-4xl">
                ¿Lo querés? Llevalo hoy.
              </p>
              <p className="mt-2 text-white/75">
                {product.name} a <strong className="text-aqua">{formatPrice(product.price)}</strong>. Pagás
                cuando te llega.
              </p>
            </div>
          </div>
          <div className="-mt-20 px-4 pb-12">
            <div className="mx-auto max-w-xl">
              <OrderForm slug={product.slug} name={product.name} price={product.price} image={product.images[0]} />
            </div>
          </div>
        </section>
      </main>
      <Footer
        pageLinks={[
          { href: "#como-comprar", label: "Envíos" },
          ...(product.faqs.length > 0 ? [{ href: "#preguntas", label: "Preguntas frecuentes" }] : []),
        ]}
      />
      <StickyCta price={product.price} />
    </>
  );
}
