import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  // Variable: ancho (wdth) y tamaño óptico (opsz) dan las voces de display y de respuesta sin otra familia
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Llevalo UY — Pagás al recibir",
    template: "%s | Llevalo UY",
  },
  description: "Cosas útiles para la casa. Somos de Montevideo: te lo llevamos en el día y pagás al recibir.",
  icons: {
    icon: "/brand/favicon-512.png",
    apple: "/brand/favicon-512.png",
  },
  openGraph: {
    siteName: site.name,
    locale: "es_UY",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#2EC4B6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-UY" className={bricolage.variable}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
