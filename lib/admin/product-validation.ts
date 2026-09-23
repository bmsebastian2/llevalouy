import type { Product } from "@/types/product";

// Validación del editor de productos. La usa el servidor antes de guardar; el cliente la reutiliza para avisar antes.

export type ProductInput = Omit<Product, "id">;
export type ProductErrors = Partial<Record<keyof ProductInput | "form", string>>;

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const int = (v: unknown) => (typeof v === "number" ? v : Number(String(v ?? "").replace(/\D/g, "") || NaN));
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" ? (v as Record<string, unknown>) : {});

export function validateProduct(raw: unknown): { ok: true; data: ProductInput } | { ok: false; errors: ProductErrors } {
  const r = obj(raw);
  const errors: ProductErrors = {};

  const name = str(r.name);
  if (name.length < 2 || name.length > 120) errors.name = "Poné un nombre (2 a 120 caracteres).";

  const slug = str(r.slug);
  if (!SLUG_RE.test(slug) || slug.length > 80) errors.slug = "Solo minúsculas, números y guiones. Ej: manguera-extensible";

  const tagline = str(r.tagline);
  if (tagline.length > 200) errors.tagline = "Máximo 200 caracteres.";

  const description = str(r.description);
  if (description.length > 2000) errors.description = "Máximo 2000 caracteres.";

  const price = int(r.price);
  if (!Number.isInteger(price) || price <= 0 || price > 10_000_000) errors.price = "Precio en pesos, número entero.";

  const compareRaw = r.compareAtPrice;
  const hasCompare = compareRaw !== undefined && compareRaw !== null && String(compareRaw).trim() !== "";
  const compareAtPrice = hasCompare ? int(compareRaw) : undefined;
  if (hasCompare && (!Number.isInteger(compareAtPrice) || (compareAtPrice as number) <= price)) {
    errors.compareAtPrice = "El precio \"antes\" tiene que ser mayor que el precio actual (o dejalo vacío).";
  }

  const images = arr(r.images).map(str).filter(Boolean);
  if (images.length === 0) errors.images = "Subí al menos una foto.";
  else if (images.length > 10) errors.images = "Máximo 10 fotos.";
  else if (images.some((u) => !u.startsWith("https://") && !u.startsWith("/"))) errors.images = "Hay una foto con una dirección inválida.";

  const benefits = arr(r.benefits)
    .map((b) => ({ icon: str(obj(b).icon).slice(0, 8), text: str(obj(b).text) }))
    .filter((b) => b.text);
  if (benefits.length > 12) errors.benefits = "Máximo 12 beneficios.";
  if (benefits.some((b) => b.text.length > 140)) errors.benefits = "Cada beneficio: máximo 140 caracteres.";

  const faqs = arr(r.faqs)
    .map((f) => ({ q: str(obj(f).q), a: str(obj(f).a) }))
    .filter((f) => f.q || f.a);
  if (faqs.some((f) => !f.q || !f.a)) errors.faqs = "Cada pregunta necesita su respuesta.";
  if (faqs.length > 15) errors.faqs = "Máximo 15 preguntas.";

  const reviews = arr(r.reviews)
    .map((x) => ({ name: str(obj(x).name), city: str(obj(x).city), rating: int(obj(x).rating), text: str(obj(x).text) }))
    .filter((x) => x.name || x.text);
  if (reviews.some((x) => !x.name || !x.text || !x.city)) errors.reviews = "Cada reseña necesita nombre, ciudad y texto.";
  if (reviews.some((x) => !Number.isInteger(x.rating) || x.rating < 1 || x.rating > 5)) errors.reviews = "Las estrellas van de 1 a 5.";
  if (reviews.length > 20) errors.reviews = "Máximo 20 reseñas.";

  const active = r.active === true;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: { slug, name, tagline, description, price, compareAtPrice, images, benefits, faqs, reviews, active },
  };
}
