import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp, { type OverlayOptions } from "sharp";
import { getProductBySlug } from "@/lib/products";
import { site } from "@/lib/site";

/*
 * Imagen para WhatsApp y redes: JPG 1200×630 (el formato que todas las vistas previas muestran).
 * La foto va centrada y sin deformar sobre el fondo de la página, con aire y esquinas redondeadas como las tarjetas.
 * Centrada también sobrevive al recorte cuadrado que hace WhatsApp en la vista chica.
 * sharp ya viene con Next (dependencia opcional), no se agrega nada.
 */

export const revalidate = 60;

const size = { width: 1200, height: 630 };
const contentType = "image/jpeg";
const BACKGROUND = "#eef8f6";
const MARGIN = 40;
const RADIUS = 32;
const MAX_BYTES = 300 * 1024;

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  return [{ id: "foto", alt: product?.name ?? site.name, size, contentType }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const src = product?.images[0];
  const photo = src ? await loadImage(src) : null;

  const layer = photo ? await framedPhoto(photo) : await logo();
  const { data, info } = await sharp({ create: { ...size, channels: 3, background: BACKGROUND } })
    .composite([layer])
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Calidad ~80; si una foto muy cargada pasa de 300 KB, se baja de a poco
  let jpg: Buffer = Buffer.alloc(0);
  for (const quality of [80, 72, 64, 56]) {
    jpg = await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    if (jpg.length <= MAX_BYTES) break;
  }

  return new Response(new Uint8Array(jpg), { headers: { "Content-Type": contentType } });
}

/** Supabase devuelve URLs absolutas; los datos mock usan rutas de /public */
async function loadImage(src: string): Promise<Buffer | null> {
  try {
    if (/^https?:\/\//.test(src)) {
      const res = await fetch(src);
      return res.ok ? Buffer.from(await res.arrayBuffer()) : null;
    }
    return await readFile(join(process.cwd(), "public", src));
  } catch {
    return null;
  }
}

async function framedPhoto(photo: Buffer): Promise<OverlayOptions> {
  const { data, info } = await sharp(photo)
    .rotate() // respeta la orientación de las fotos de celular
    .resize(size.width - 2 * MARGIN, size.height - 2 * MARGIN, { fit: "inside" })
    .toBuffer({ resolveWithObject: true });

  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${info.width}" height="${info.height}"><rect width="100%" height="100%" rx="${RADIUS}"/></svg>`,
  );
  const rounded = await sharp(data).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();

  return {
    input: rounded,
    left: Math.round((size.width - info.width) / 2),
    top: Math.round((size.height - info.height) / 2),
  };
}

/** Producto sin foto: el logo centrado */
async function logo(): Promise<OverlayOptions> {
  const svg = await readFile(join(process.cwd(), "public/brand/logo-horizontal.svg"));
  const input = await sharp(svg, { density: 300 }).resize({ width: 520 }).png().toBuffer();
  return { input, gravity: "center" };
}
