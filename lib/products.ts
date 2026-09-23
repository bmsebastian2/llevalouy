import type { Product } from "@/types/product";
import { mockProducts } from "@/data/mock-products";

// Única puerta de acceso a productos para la UI.
// En el paso 5.3 estas funciones pasan a leer de Supabase sin tocar componentes.

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return mockProducts.find((p) => p.slug === slug && p.active) ?? null;
}

export async function getActiveProducts(): Promise<Product[]> {
  return mockProducts.filter((p) => p.active);
}
