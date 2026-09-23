"use server";

import { redirect } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { createOrder } from "@/lib/orders";
import { validateOrder, type OrderErrors, type OrderRaw } from "@/lib/order-validation";

export type OrderFormState = {
  errors?: OrderErrors;
  message?: string;
  values?: OrderRaw;
};

const FIELDS = ["productSlug", "quantity", "name", "phone", "department", "city", "address", "notes"] as const;

export async function submitOrder(_prev: OrderFormState, formData: FormData): Promise<OrderFormState> {
  // Honeypot: los bots completan este campo oculto; les mostramos éxito sin guardar nada.
  if (formData.get("website")) redirect("/gracias");

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

  let orderId: string;
  try {
    const order = await createOrder(product, result.data);
    orderId = order.id;
  } catch (err) {
    console.error("[pedido] error al guardar", err);
    return { values: raw, message: "No pudimos registrar tu pedido. Probá de nuevo en un minuto." };
  }

  redirect(`/gracias?p=${encodeURIComponent(product.slug)}&o=${encodeURIComponent(orderId)}`);
}
