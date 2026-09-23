"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, isAdminConfigured, requireAdmin, startSession } from "@/lib/admin/auth";
import {
  createImageUploadUrl,
  getProductById,
  saveProduct as saveProductRow,
  setOrderStatus,
  setProductActive,
} from "@/lib/admin/data";
import { validateProduct, type ProductErrors } from "@/lib/admin/product-validation";
import { ORDER_STATUSES, type OrderStatus } from "@/types/order";

// ───────────── Sesión ─────────────

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return { error: "Falta configurar ADMIN_PASSWORD y ADMIN_SESSION_SECRET en el servidor." };
  }
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 800)); // frena intentos por fuerza bruta
    return { error: "Contraseña incorrecta." };
  }
  await startSession();
  redirect("/admin/pedidos");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

// ───────────── Pedidos ─────────────

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<{ error?: string }> {
  await requireAdmin();
  if (!ORDER_STATUSES.includes(status)) return { error: "Estado inválido." };
  try {
    await setOrderStatus(id, status);
  } catch (err) {
    console.error(err);
    return { error: "No se pudo cambiar el estado." };
  }
  revalidatePath("/admin/pedidos");
  return {};
}

// ───────────── Productos ─────────────

export async function toggleProductActive(id: string, active: boolean): Promise<{ error?: string }> {
  await requireAdmin();
  try {
    const slug = await setProductActive(id, active);
    revalidatePath("/");
    revalidatePath(`/p/${slug}`);
    revalidatePath("/admin/productos");
  } catch (err) {
    console.error(err);
    return { error: "No se pudo actualizar el producto." };
  }
  return {};
}

export type SaveProductState = { errors?: ProductErrors };

export async function saveProduct(_prev: SaveProductState, formData: FormData): Promise<SaveProductState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "") || null;
  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("payload") ?? "{}"));
  } catch {
    return { errors: { form: "Datos inválidos. Recargá la página." } };
  }

  const result = validateProduct(raw);
  if (!result.ok) return { errors: { ...result.errors, form: "Revisá los campos marcados." } };

  const previous = id ? await getProductById(id) : null;
  if (id && !previous) return { errors: { form: "Ese producto ya no existe." } };

  const saved = await saveProductRow(id, result.data);
  if (!saved.ok) {
    return { errors: saved.slugTaken ? { slug: saved.message, form: saved.message } : { form: saved.message } };
  }

  // Refresca el sitio público al instante (sin esperar los 60 s)
  revalidatePath("/");
  revalidatePath(`/p/${result.data.slug}`);
  if (previous && previous.slug !== result.data.slug) revalidatePath(`/p/${previous.slug}`);
  revalidatePath("/admin/productos");

  redirect(`/admin/productos?guardado=${encodeURIComponent(result.data.name)}`);
}

export async function getImageUploadUrl(ext: "webp" | "jpg" | "png"): Promise<{ signedUrl?: string; publicUrl?: string; error?: string }> {
  await requireAdmin();
  if (!["webp", "jpg", "png"].includes(ext)) return { error: "Formato no permitido." };
  try {
    return await createImageUploadUrl(ext);
  } catch (err) {
    console.error(err);
    return { error: "No se pudo preparar la subida. ¿Existe el bucket \"products\" en Supabase Storage?" };
  }
}
