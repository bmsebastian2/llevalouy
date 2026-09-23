import Image from "next/image";
import { site } from "@/lib/site";

type FooterLink = { href: string; label: string; icon?: React.ReactNode };

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const InstagramIcon = (
  <svg {...iconProps}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

const MailIcon = (
  <svg {...iconProps}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

// Envíos y preguntas frecuentes solo existen en la página de producto: ahí se pasan como `pageLinks`.
export default function Footer({ pageLinks = [] }: { pageLinks?: FooterLink[] }) {
  const links: (FooterLink & { external?: boolean })[] = [
    { href: `https://instagram.com/${site.instagram}`, label: "Instagram", icon: InstagramIcon, external: true },
    { href: `mailto:${site.email}`, label: "Contacto", icon: MailIcon },
    ...pageLinks,
  ];

  return (
    <footer className="bg-ink px-4 pb-8 pt-12 text-white/80">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <div className="inline-block rounded-xl bg-white px-3 py-2">
              <Image src="/brand/logo-horizontal.svg" alt="Llevalo UY" width={116} height={30} />
            </div>
            <p className="mt-4 max-w-xs text-lg font-bold leading-snug text-white">
              Comprá fácil. Recibí en tu casa. <span className="text-aqua">Pagá al recibir.</span>
            </p>
          </div>

          <nav aria-label="Pie de página">
            <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm md:justify-end">
              {links.map((l, i) => (
                <li key={l.label} className="flex items-center gap-3">
                  {i > 0 && (
                    <span className="text-white/30" aria-hidden>
                      ·
                    </span>
                  )}
                  <a
                    href={l.href}
                    {...(l.external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="inline-flex items-center gap-1.5 transition hover:text-aqua"
                  >
                    {l.icon}
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50 md:text-left">
          © {new Date().getFullYear()} Llevalo Uruguay
        </p>
      </div>
    </footer>
  );
}
