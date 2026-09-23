import { DEPARTMENTS, MAX_QUANTITY, type Department, type OrderInput } from "@/types/order";

// Validación compartida: la usa el servidor (fuente de verdad) y puede usarla el cliente.

export type OrderField = "name" | "phone" | "department" | "city" | "address" | "quantity" | "notes";
export type OrderErrors = Partial<Record<OrderField, string>>;
export type OrderRaw = Partial<Record<OrderField | "productSlug", string>>;

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

  const quantity = Number(raw.quantity ?? "1");
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    errors.quantity = `Podés pedir de 1 a ${MAX_QUANTITY} unidades.`;
  }

  const notes = clean(raw.notes);
  if (notes.length > 300) errors.notes = "Máximo 300 caracteres.";

  const productSlug = clean(raw.productSlug);

  if (Object.keys(errors).length > 0 || !phone) return { ok: false, errors };

  return {
    ok: true,
    data: {
      productSlug,
      quantity,
      name,
      phone,
      department: department as Department,
      city,
      address,
      notes: notes || undefined,
    },
  };
}
