import Image from "next/image";
import { site } from "@/lib/site";
import { getStoreWhatsapp, whatsappUrl } from "@/lib/whatsapp";
import RamblaLine from "./RamblaLine";

type FooterLink = { href: string; label: string };

/** 59899123456 → "+598 99 123 456" */
function formatWhatsapp(digits: string) {
  const local = digits.replace(/^598/, "");
  return `+598 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
}

const rowClass =
  "flex min-h-12 flex-col justify-center rounded-lg py-1 outline-none focus-visible:ring-4 focus-visible:ring-aqua-dark/40";

// Envíos y preguntas frecuentes solo existen en la página de producto: ahí se pasan como `pageLinks`.
export default function Footer({ pageLinks = [] }: { pageLinks?: FooterLink[] }) {
  const whatsapp = getStoreWhatsapp();

  const contact = [
    ...(whatsapp
      ? [{ label: "WhatsApp", value: formatWhatsapp(whatsapp), href: whatsappUrl(whatsapp), external: true }]
      : []),
    { label: "Horario de atención", value: site.hours },
    { label: "Instagram", value: `@${site.instagram}`, href: `https://instagram.com/${site.instagram}`, external: true },
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
  ];

  return (
    <footer className="px-4 pb-10 pt-12">
      <div className="mx-auto max-w-5xl">
        <RamblaLine />

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:gap-16">
          <div>
            <Image src="/brand/logo-horizontal.svg" alt="Llevalo UY" width={124} height={32} />
            <h2 className="display mt-6 text-3xl font-extrabold leading-tight sm:text-4xl">Somos de Montevideo</h2>
            <p className="mt-2 text-lg text-ink/75">Te atiende una persona, no un bot.</p>
          </div>

          <ul className="grid gap-x-10 gap-y-1 sm:grid-cols-2 md:min-w-[26rem]">
            {contact.map((c) => (
              <li key={c.label}>
                {c.href ? (
                  <a
                    href={c.href}
                    {...(c.external && { target: "_blank", rel: "noopener noreferrer" })}
                    className={`${rowClass} group`}
                  >
                    <span className="text-sm text-ink/65">{c.label}</span>
                    <span className="break-all font-bold underline decoration-espuma decoration-2 underline-offset-4 group-hover:decoration-aqua-dark">
                      {c.value}
                    </span>
                  </a>
                ) : (
                  <p className={rowClass}>
                    <span className="text-sm text-ink/65">{c.label}</span>
                    <span className="font-bold">{c.value}</span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-espuma pt-4 text-sm text-ink/65">
          <p>© {new Date().getFullYear()} Llevalo UY</p>
          {pageLinks.length > 0 && (
            <nav aria-label="Pie de página">
              <ul className="flex flex-wrap gap-x-5">
                {pageLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="inline-flex min-h-12 items-center underline-offset-4 outline-none hover:text-ink hover:underline focus-visible:ring-4 focus-visible:ring-aqua-dark/40"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
