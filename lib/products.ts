import "server-only";
import type { Product } from "@/types/product";
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
  active: boolean;
};

export const PRODUCT_COLUMNS =
  "id, slug, name, tagline, price, compare_at_price, images, benefits, description, faqs, reviews, active";

export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
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
