import "server-only";
import { CONTEXT_TAG_ICONS, HIGHLIGHT_ICONS, type Product } from "@/types/product";
import { mockProducts } from "@/data/mock-products";
import { getSupabase } from "@/lib/supabase";

// Única puerta de acceso a productos para la UI.
// Lee de Supabase; si no hay credenciales configuradas usa data/mock-products.ts.

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  compare_at_price: number | null;
  images: string[];
  benefits: Product["benefits"];
  description: string;
  faqs: Product["faqs"];
  reviews: Product["reviews"];
  /** Opcionales: no existen hasta correr la migración del beneficio destacado */
  highlight?: string | null;
  highlight_icon?: string | null;
  /** jsonb {text, icon}. Opcional: no existe hasta correr la migración de la etiqueta de contexto */
  context_tag?: unknown;
  active: boolean;
};

// "*" y no la lista de columnas: las migraciones se corren a mano, y pedir una columna que todavía no existe
// hace fallar toda la consulta. Así funciona antes y después de agregar highlight / highlight_icon.
export const PRODUCT_COLUMNS = "*";

/** La base ya valida el formato; acá se descarta cualquier cosa que no sea {text, icon} válido. */
function toContextTag(value: unknown): Product["contextTag"] {
  if (typeof value !== "object" || value === null) return undefined;
  const { text, icon } = value as Record<string, unknown>;
  const name = CONTEXT_TAG_ICONS.find((i) => i === icon);
  return typeof text === "string" && text.trim() && name ? { text: text.trim(), icon: name } : undefined;
}

export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    highlight: row.highlight?.trim() || undefined,
    highlightIcon: HIGHLIGHT_ICONS.find((icon) => icon === row.highlight_icon),
    contextTag: toContextTag(row.context_tag),
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    images: row.images ?? [],
    benefits: row.benefits ?? [],
    description: row.description,
    faqs: row.faqs ?? [],
    reviews: row.reviews ?? [],
    active: row.active,
  };
}

let warned = false;
function warnMock() {
  if (warned) return;
  warned = true;
  console.warn("[productos] Supabase no está configurado: usando datos mock.");
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = getSupabase();
  if (!db) {
    warnMock();
    return mockProducts.find((p) => p.slug === slug && p.active) ?? null;
  }

  const { data, error } = await db
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle<ProductRow>();

  // Si Supabase falla, tiramos error (no 404): así Next mantiene la última versión cacheada de la página.
  if (error) throw new Error(`[productos] getProductBySlug(${slug}): ${error.message}`);
  return data ? toProduct(data) : null;
}

/** Productos activos con esos slugs. Los que no existen o están pausados no vienen. */
export async function getActiveProductsBySlugs(slugs: string[]): Promise<Product[]> {
  const db = getSupabase();
  if (!db) {
    warnMock();
    return mockProducts.filter((p) => p.active && slugs.includes(p.slug));
  }

  const { data, error } = await db
    .from("products")
    .select(PRODUCT_COLUMNS)
    .in("slug", slugs)
    .eq("active", true)
    .returns<ProductRow[]>();

  if (error) throw new Error(`[productos] getActiveProductsBySlugs: ${error.message}`);
  return (data ?? []).map(toProduct);
}

export async function getActiveProducts(): Promise<Product[]> {
  const db = getSupabase();
  if (!db) {
    warnMock();
    return mockProducts.filter((p) => p.active);
  }

  const { data, error } = await db
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("active", true)
    .order("created_at", { ascending: true })
    .returns<ProductRow[]>();

  if (error) throw new Error(`[productos] getActiveProducts: ${error.message}`);
  return (data ?? []).map(toProduct);
}
