import { existsSync } from "node:fs";
import type { NextConfig } from "next";

// Foto ambiental del hero (la pone Sebastián, en .jpg o .png). Se resuelve al compilar: si no hay archivo, el home no la muestra.
const heroImage = ["jpg", "png"].map((ext) => `/brand/hero-hogar.${ext}`).find((src) => existsSync(`public${src}`));

const nextConfig: NextConfig = {
  env: {
    HERO_IMAGE: heroImage ?? "",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Fotos subidas a Supabase Storage (buckets públicos)
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
};

export default nextConfig;
