import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProductBySlug } from "@/lib/products";

export const metadata: Metadata = {
  title: "¡Pedido recibido!",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ p?: string; o?: string }> };

export default async function GraciasPage({ searchParams }: Props) {
  const { p, o } = await searchParams;
  const product = p ? await getProductBySlug(p) : null;

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-14 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-aqua text-4xl" aria-hidden>
          ✅
        </span>
        <h1 className="mt-5 text-3xl font-extrabold">¡Listo, recibimos tu pedido!</h1>
        {o && (
          <p className="mt-2 text-ink/70">
            Número de pedido: <strong className="text-ink">{o}</strong>
          </p>
        )}

        {product && (
          <div className="mt-6 flex w-full items-center gap-4 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-ink/5">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
              <Image src={product.images[0]} alt="" fill sizes="64px" className="object-cover" />
            </div>
            <p className="font-bold">{product.name}</p>
          </div>
        )}

        <ol className="mt-8 w-full space-y-3 text-left">
          <li className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
            <span aria-hidden>💬</span>
            <span>
              <strong>En breve te escribimos por WhatsApp</strong> para confirmar dirección y horario.
            </span>
          </li>
          <li className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
            <span aria-hidden>💵</span>
            <span>
              <strong>Pagás cuando te llega.</strong> Tené el efectivo a mano.
            </span>
          </li>
        </ol>

        <Link href="/" className="mt-10 font-bold text-aqua-dark underline underline-offset-4">
          Ver más productos
        </Link>
      </main>
      <Footer />
    </>
  );
}
