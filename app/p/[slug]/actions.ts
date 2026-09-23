"use server";

import { getProductBySlug } from "@/lib/products";
import { createOrder } from "@/lib/orders";
import { validateOrder, type OrderErrors, type OrderRaw } from "@/lib/order-validation";
import { buildOrderMessage, getStoreWhatsapp, whatsappUrl } from "@/lib/whatsapp";

export type OrderFormState = {
  errors?: OrderErrors;
  message?: string;
  values?: OrderRaw;
  /** Pedido guardado: el cliente abre WhatsApp con el mensaje ya escrito */
  success?: { code: string; whatsappUrl: string };
};

const FIELDS = ["productSlug", "quantity", "name", "phone", "department", "city", "address", "paymentMethod", "notes"] as const;

export async function submitOrder(_prev: OrderFormState, formData: FormData): Promise<OrderFormState> {
  const store = getStoreWhatsapp();
  if (!store) {
    console.error("[pedido] falta WHATSAPP_NUMBER en las variables de entorno");
    return { message: "No pudimos procesar tu pedido. Probá de nuevo en unos minutos." };
  }

  // Honeypot: los bots completan este campo oculto; les mostramos éxito sin guardar nada.
  if (formData.get("website")) {
    return { success: { code: "LL-0", whatsappUrl: whatsappUrl(store) } };
  }

  const raw: OrderRaw = {};
  for (const field of FIELDS) raw[field] = String(formData.get(field) ?? "");

  const result = validateOrder(raw);
  if (!result.ok) {
    return { errors: result.errors, values: raw, message: "Revisá los datos marcados en rojo." };
  }

  const product = await getProductBySlug(result.data.productSlug);
  if (!product) {
    return { values: raw, message: "Este producto ya no está disponible." };
  }

  try {
    const order = await createOrder(product, result.data);
    return { success: { code: order.code, whatsappUrl: whatsappUrl(store, buildOrderMessage(order)) } };
  } catch (err) {
    console.error("[pedido] error al guardar", err);
    return { values: raw, message: "No pudimos registrar tu pedido. Probá de nuevo en un minuto." };
  }
}
