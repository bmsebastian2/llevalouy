import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import CartButton from "./CartButton";
import { HeaderRambla } from "./RamblaLine";

/** `cta`: solo en la página de producto, donde existe el formulario de pedido. */
export default function Header({ cta = false }: { cta?: boolean }) {
  return (
    <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur">
      {/* Sin borde: el borde de abajo es la costa de la Rambla, con el Salvo */}
      <HeaderRambla />
      <div className="relative mx-auto flex h-14 max-w-5xl items-center justify-center px-4 md:justify-between">
        <Link href="/" aria-label="Llevalo UY — inicio">
          <Image src="/brand/logo-horizontal.svg" alt="Llevalo UY" width={139} height={36} loading="eager" />
        </Link>
        {/* En mobile el logo va centrado y el carrito a la derecha */}
        <div className="absolute right-3 flex items-center gap-2 md:static">
          {/* En mobile ya está la barra fija de abajo */}
          {cta && (
            <a
              href={site.orderAnchor}
              className="hidden h-10 items-center gap-1.5 rounded-xl bg-aqua px-4 font-extrabold text-ink shadow-[0_3px_0_0_var(--aqua-dark)] transition active:translate-y-0.5 active:shadow-[0_1px_0_0_var(--aqua-dark)] outline-none focus-visible:ring-4 focus-visible:ring-aqua-dark/40 md:inline-flex"
            >
              Pedilo ahora
            </a>
          )}
          <CartButton />
        </div>
      </div>
    </header>
  );
}
