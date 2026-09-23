import "server-only";
import { getSupabase } from "@/lib/supabase";
import { PRODUCT_COLUMNS, toProduct, type ProductRow } from "@/lib/products";
import type { Product } from "@/types/product";
import type { Department, Order, OrderStatus } from "@/types/order";
import type { ProductInput } from "./product-validation";

// Acceso a datos del panel. Solo se llama después de requireAdmin().

export const IMAGES_BUCKET = "products";

function db() {
  const client = getSupabase();
  if (!client) throw new Error("Supabase no está configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  return client;
}

// ───────────── Pedidos ─────────────

type OrderRow = {
  id: string;
  code: string;
  product_id: string;
  product_slug: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  total: number;
  name: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  notes: string | null;
  status: OrderStatus;
  created_at: string;
};

function toOrder(r: OrderRow): Order {
  return {
    id: r.id,
    code: r.code,
    productId: r.product_id,
    productSlug: r.product_slug,
    productName: r.product_name,
    unitPrice: r.unit_price,
    quantity: r.quantity,
    total: r.total,
    name: r.name,
    phone: r.phone,
    department: r.department as Department,
    city: r.city,
    address: r.address,
    notes: r.notes ?? undefined,
    status: r.status,
    createdAt: r.created_at,
  };
}

export async function listOrders(status?: OrderStatus, limit = 200): Promise<Order[]> {
  let q = db().from("orders").select("*").order("created_at", { ascending: false }).limit(limit);
  if (status) q = q.eq("status", status);
  const { data, error } = await q.returns<OrderRow[]>();
  if (error) throw new Error(`listOrders: ${error.message}`);
  return (data ?? []).map(toOrder);
}

export async function countOrdersByStatus(): Promise<Record<OrderStatus, number>> {
  const { data, error } = await db().from("orders").select("status").returns<{ status: OrderStatus }[]>();
  if (error) throw new Error(`countOrdersByStatus: ${error.message}`);
  const counts: Record<OrderStatus, number> = { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
  for (const r of data ?? []) counts[r.status]++;
  return counts;
}

export async function getOrder(id: string): Promise<Order | null> {
  const { data, error } = await db().from("orders").select("*").eq("id", id).maybeSingle<OrderRow>();
  if (error) throw new Error(`getOrder: ${error.message}`);
  return data ? toOrder(data) : null;
}

export async function setOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await db().from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(`setOrderStatus: ${error.message}`);
}

// ───────────── Productos ─────────────

export async function listAllProducts(): Promise<Product[]> {
  const { data, error } = await db()
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("created_at", { ascending: false })
    .returns<ProductRow[]>();
  if (error) throw new Error(`listAllProducts: ${error.message}`);
  return (data ?? []).map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await db().from("products").select(PRODUCT_COLUMNS).eq("id", id).maybeSingle<ProductRow>();
  if (error) throw new Error(`getProductById: ${error.message}`);
  return data ? toProduct(data) : null;
}

export type SaveResult = { ok: true; id: string } | { ok: false; slugTaken: boolean; message: string };

export async function saveProduct(id: string | null, input: ProductInput): Promise<SaveResult> {
  const row = {
    slug: input.slug,
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    price: input.price,
    compare_at_price: input.compareAtPrice ?? null,
    images: input.images,
    benefits: input.benefits,
    faqs: input.faqs,
    reviews: input.reviews,
    active: input.active,
  };

  const q = id
    ? db().from("products").update(row).eq("id", id).select("id").single<{ id: string }>()
    : db().from("products").insert(row).select("id").single<{ id: string }>();
  const { data, error } = await q;

  if (error) {
    const slugTaken = error.code === "23505";
    return { ok: false, slugTaken, message: slugTaken ? "Ya hay otro producto con esa dirección." : error.message };
  }
  return { ok: true, id: data.id };
}

export async function setProductActive(id: string, active: boolean): Promise<string> {
  const { data, error } = await db()
    .from("products")
    .update({ active })
    .eq("id", id)
    .select("slug")
    .single<{ slug: string }>();
  if (error) throw new Error(`setProductActive: ${error.message}`);
  return data.slug;
}

/** URL firmada para que el navegador suba la foto directo a Storage (sin pasar por el servidor). */
export async function createImageUploadUrl(ext: "webp" | "jpg" | "png") {
  const path = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
  const storage = db().storage.from(IMAGES_BUCKET);
  const { data, error } = await storage.createSignedUploadUrl(path);
  if (error) throw new Error(`createImageUploadUrl: ${error.message}`);
  return { signedUrl: data.signedUrl, publicUrl: storage.getPublicUrl(path).data.publicUrl };
}
