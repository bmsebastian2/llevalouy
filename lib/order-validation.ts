import {
  DEPARTMENTS,
  MAX_ITEMS,
  MAX_QUANTITY,
  PAYMENT_METHODS,
  type Department,
  type OrderInput,
  type OrderItemInput,
  type PaymentMethod,
} from "@/types/order";

// Validación compartida: la usa el servidor (fuente de verdad) y puede usarla el cliente.

export type OrderField = "name" | "phone" | "department" | "city" | "address" | "paymentMethod" | "items" | "notes";
export type OrderErrors = Partial<Record<OrderField, string>>;
/** `items` llega como JSON: [{ productSlug, quantity }] */
export type OrderRaw = Partial<Record<OrderField, string>>;

export type ValidationResult = { ok: true; data: OrderInput } | { ok: false; errors: OrderErrors };

/** Acepta 099 123 456, 99123456, +598 99 123 456, etc. Devuelve +59899123456 o null. */
export function normalizeUyMobile(value: string): string | null {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("598")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return /^9\d{7}$/.test(digits) ? `+598${digits}` : null;
}

function clean(value: string | undefined): string {
  return (value ?? "").trim().replace(/\s+/g, " ");
}

/** Lee el JSON de productos. Devuelve null si no tiene la forma esperada. */
export function parseItems(value: string | undefined): OrderItemInput[] | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value ?? "");
  } catch {
    return null;
  }
  if (!Array.isArray(parsed)) return null;
  const items: OrderItemInput[] = [];
  for (const it of parsed) {
    if (typeof it !== "object" || it === null) return null;
    const { productSlug, quantity } = it as Record<string, unknown>;
    if (typeof productSlug !== "string" || typeof quantity !== "number") return null;
    items.push({ productSlug: clean(productSlug), quantity });
  }
  return items;
}

export function validateOrder(raw: OrderRaw): ValidationResult {
  const errors: OrderErrors = {};

  const name = clean(raw.name);
  if (name.length < 3) errors.name = "Escribí tu nombre y apellido.";
  else if (name.length > 80) errors.name = "El nombre es demasiado largo.";

  const phone = normalizeUyMobile(raw.phone ?? "");
  if (!phone) errors.phone = "Poné un celular uruguayo válido, ej: 099 123 456.";

  const department = clean(raw.department);
  if (!DEPARTMENTS.includes(department as Department)) errors.department = "Elegí tu departamento.";

  const city = clean(raw.city);
  if (city.length < 2) errors.city = "Contanos tu barrio o ciudad.";
  else if (city.length > 80) errors.city = "Es demasiado largo.";

  const address = clean(raw.address);
  if (address.length < 5) errors.address = "Escribí calle, número y esquina.";
  else if (address.length > 160) errors.address = "La dirección es demasiado larga.";

  const paymentMethod = clean(raw.paymentMethod);
  if (!PAYMENT_METHODS.includes(paymentMethod as PaymentMethod)) errors.paymentMethod = "Elegí cómo vas a pagar.";

  const items = parseItems(raw.items) ?? [];
  const slugs = new Set(items.map((it) => it.productSlug));
  if (items.length === 0 || items.length > MAX_ITEMS || slugs.size !== items.length || slugs.has("")) {
    errors.items = "Revisá los productos de tu pedido.";
  } else if (items.some((it) => !Number.isInteger(it.quantity) || it.quantity < 1 || it.quantity > MAX_QUANTITY)) {
    errors.items = `Podés pedir de 1 a ${MAX_QUANTITY} unidades de cada producto.`;
  }

  const notes = clean(raw.notes);
  if (notes.length > 300) errors.notes = "Máximo 300 caracteres.";

  if (Object.keys(errors).length > 0 || !phone) return { ok: false, errors };

  return {
    ok: true,
    data: {
      items,
      name,
      phone,
      department: department as Department,
      city,
      address,
      paymentMethod: paymentMethod as PaymentMethod,
      notes: notes || undefined,
    },
  };
}
