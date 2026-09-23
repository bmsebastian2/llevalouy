import "server-only";
import type { Order, OrderInput, OrderItem } from "@/types/order";
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

/** `products` tiene que traer un producto activo por cada item (lo garantiza submitOrder). */
function buildOrder(products: Product[], input: OrderInput): Omit<Order, "id"> {
  const items: OrderItem[] = input.items.map(({ productSlug, quantity }) => {
    const product = products.find((p) => p.slug === productSlug);
    if (!product) throw new Error(`[pedidos] producto no encontrado: ${productSlug}`);
    return {
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      unitPrice: product.price,
      quantity,
      subtotal: product.price * quantity,
    };
  });

  const { items: _input, ...customer } = input;
  return {
    ...customer,
    code: newOrderCode(),
    items,
    total: items.reduce((sum, it) => sum + it.subtotal, 0),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}

export async function createOrder(products: Product[], input: OrderInput): Promise<Order> {
  const db = getSupabase();

  if (!db) {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("[pedidos] Supabase no está configurado: no se puede guardar el pedido.");
    }
    const order: Order = { id: crypto.randomUUID(), ...buildOrder(products, input) };
    console.info("[pedido nuevo · SOLO MEMORIA]", JSON.stringify(order));
    return order;
  }

  // Reintenta si el código generado ya existe (colisión muy improbable).
  for (let attempt = 0; attempt < 3; attempt++) {
    const draft = buildOrder(products, input);
    const { data, error } = await db
      .from("orders")
      .insert({
        code: draft.code,
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

    if (error) {
      if (error.code === "23505" && error.message.includes("code")) continue;
      throw new Error(`[pedidos] createOrder: ${error.message}`);
    }

    const { error: itemsError } = await db.from("order_items").insert(
      draft.items.map((it, line) => ({
        order_id: data.id,
        line,
        product_id: it.productId,
        product_slug: it.productSlug,
        product_name: it.productName,
        unit_price: it.unitPrice,
        quantity: it.quantity,
        subtotal: it.subtotal,
      })),
    );

    if (itemsError) {
      // Sin sus productos el pedido no sirve: lo borramos para no dejar uno vacío en el panel.
      await db.from("orders").delete().eq("id", data.id);
      throw new Error(`[pedidos] createOrder items: ${itemsError.message}`);
    }

    return { ...draft, id: data.id, createdAt: data.created_at };
  }

  throw new Error("[pedidos] createOrder: no se pudo generar un código de pedido único.");
}
