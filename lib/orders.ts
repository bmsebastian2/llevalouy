import "server-only";
import type { Order, OrderInput } from "@/types/order";
import type { Product } from "@/types/product";
import { getSupabase } from "@/lib/supabase";

// Única puerta de escritura de pedidos.
// Guarda en Supabase. Sin credenciales, SOLO en desarrollo, guarda en memoria y lo loguea.
// En producción sin Supabase falla a propósito: nunca le decimos "recibido" a un cliente sin guardar el pedido.

function newOrderCode(): string {
  const time = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `LL-${time}${rand}`;
}

function buildOrder(product: Product, input: OrderInput): Omit<Order, "id"> {
  return {
    ...input,
    code: newOrderCode(),
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    unitPrice: product.price,
    total: product.price * input.quantity,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}

export async function createOrder(product: Product, input: OrderInput): Promise<Order> {
  const db = getSupabase();

  if (!db) {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("[pedidos] Supabase no está configurado: no se puede guardar el pedido.");
    }
    const order: Order = { id: crypto.randomUUID(), ...buildOrder(product, input) };
    console.info("[pedido nuevo · SOLO MEMORIA]", JSON.stringify(order));
    return order;
  }

  // Reintenta si el código generado ya existe (colisión muy improbable).
  for (let attempt = 0; attempt < 3; attempt++) {
    const draft = buildOrder(product, input);
    const { data, error } = await db
      .from("orders")
      .insert({
        code: draft.code,
        product_id: draft.productId,
        product_slug: draft.productSlug,
        product_name: draft.productName,
        unit_price: draft.unitPrice,
        quantity: draft.quantity,
        total: draft.total,
        name: draft.name,
        phone: draft.phone,
        department: draft.department,
        city: draft.city,
        address: draft.address,
        payment_method: draft.paymentMethod,
        notes: draft.notes ?? null,
        status: draft.status,
      })
      .select("id, created_at")
      .single<{ id: string; created_at: string }>();

    if (!error) return { ...draft, id: data.id, createdAt: data.created_at };
    if (error.code === "23505" && error.message.includes("code")) continue;
    throw new Error(`[pedidos] createOrder: ${error.message}`);
  }

  throw new Error("[pedidos] createOrder: no se pudo generar un código de pedido único.");
}
