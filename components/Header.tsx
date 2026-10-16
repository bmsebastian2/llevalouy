import Image from "next/image";
import Link from "next/link";
import { SITE_SHARE_TEXT } from "@/lib/share";
import { site } from "@/lib/site";
import { getStoreWhatsapp, whatsappUrl } from "@/lib/whatsapp";
import CartButton from "./CartButton";
import { InstagramIcon, WhatsappIcon } from "./DeliveryIcons";
import ShareButton from "./ShareButton";

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
        {/* Íconos de 44px a 4px: a 360px entran logo, carrito, compartir, Instagram y WhatsApp */}
        <div className="flex items-center gap-1">
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
          <ShareButton
            variant="header"
            title={site.name}
            text={SITE_SHARE_TEXT}
            path="/"
            label="Compartir Llevalo UY"
          />
          <a
            href={`https://instagram.com/${site.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Llevalo UY"
            className="grid size-11 place-items-center rounded-xl text-aqua-dark outline-none transition-colors hover:bg-ink/5 focus-visible:ring-4 focus-visible:ring-aqua-dark/40"
          >
            <InstagramIcon className="size-[1.375rem]" />
          </a>
          {whatsapp && (
            <a
              href={whatsappUrl(whatsapp, "¡Hola! Tengo una consulta.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Consultas por WhatsApp"
              className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 font-bold text-ink outline-none ring-1 ring-espuma transition-colors hover:bg-bg focus-visible:ring-4 focus-visible:ring-aqua-dark/40"
            >
              <WhatsappIcon className="size-5 text-aqua-dark" />
              {/* Menos de 480px: solo el ícono (con el carrito lleno no entra el texto) */}
              <span className="hidden min-[480px]:inline">Consultas</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
