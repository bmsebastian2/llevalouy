import type { Order, OrderInput } from "@/types/order";
import type { Product } from "@/types/product";

// Única puerta de escritura de pedidos.
// Por ahora guarda en memoria y lo loguea en la terminal: SE PIERDE al reiniciar.
// En el paso 5.3 pasa a Supabase sin tocar el formulario.

const memoryOrders: Order[] = [];

function newOrderId(): string {
  const time = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `LL-${time}${rand}`;
}

export async function createOrder(product: Product, input: OrderInput): Promise<Order> {
  const order: Order = {
    ...input,
    id: newOrderId(),
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    unitPrice: product.price,
    total: product.price * input.quantity,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  memoryOrders.push(order);
  console.info("[pedido nuevo]", JSON.stringify(order));
  return order;
}
