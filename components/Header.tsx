import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { getStoreWhatsapp, whatsappUrl } from "@/lib/whatsapp";
import CartButton from "./CartButton";
import { WhatsappIcon } from "./DeliveryIcons";

/** `cta`: solo en la página de producto, donde existe el formulario de pedido. */
export default function Header({ cta = false }: { cta?: boolean }) {
  const whatsapp = getStoreWhatsapp();

  return (
    <header className="sticky top-0 z-30 border-b border-espuma bg-white/95 backdrop-blur">
      <div className="page-container flex h-14 items-center justify-between gap-3">
        <Link
          href="/"
          aria-label="Llevalo UY, inicio"
          className="-mx-1 rounded-lg px-1 py-1 outline-none focus-visible:ring-4 focus-visible:ring-aqua-dark/40"
        >
          <Image src="/brand/logo-horizontal.svg" alt="Llevalo UY" width={124} height={32} loading="eager" />
        </Link>
        <div className="flex items-center gap-1.5">
          {/* En celular ya está la barra fija de abajo */}
          {cta && (
            <a
              href={site.orderAnchor}
              className="mr-1.5 hidden h-10 items-center rounded-xl bg-aqua px-4 font-extrabold text-ink shadow-[0_3px_0_0_var(--aqua-dark)] outline-none focus-visible:ring-4 focus-visible:ring-aqua-dark/40 md:inline-flex"
            >
              Pedilo ahora
            </a>
          )}
          {/* Solo aparece si ya hay algo en el carrito */}
          <CartButton hideEmpty />
          {whatsapp && (
            <a
              href={whatsappUrl(whatsapp, "¡Hola! Tengo una consulta.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Consultas por WhatsApp"
              className="inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-xl px-3 font-bold text-ink outline-none ring-1 ring-espuma transition-colors hover:bg-bg focus-visible:ring-4 focus-visible:ring-aqua-dark/40"
            >
              <WhatsappIcon className="size-5 text-aqua-dark" />
              {/* Menos de 400px: solo el ícono */}
              <span className="hidden min-[400px]:inline">Consultas</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
