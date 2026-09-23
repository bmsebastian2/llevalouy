import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <p className="text-6xl" aria-hidden>
          🔍
        </p>
        <h1 className="mt-4 text-3xl font-extrabold">Ups, esto no está</h1>
        <p className="mt-2 text-ink/70">
          El producto que buscás no existe o ya no está disponible. Mirá lo que tenemos hoy.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-14 items-center rounded-2xl bg-aqua px-8 text-lg font-extrabold text-ink shadow-sm transition active:scale-[0.98]"
        >
          Ver productos
        </Link>
      </main>
      <Footer />
    </>
  );
}
