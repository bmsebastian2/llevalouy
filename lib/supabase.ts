import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente de Supabase SOLO para el servidor: usa la service_role key, que saltea RLS.
// "server-only" hace fallar el build si algún componente cliente lo importa por error.

let client: SupabaseClient | null | undefined;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Devuelve null si faltan las variables de entorno. */
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;

  // Solo el origen: tolera URLs pegadas con /rest/v1/ u otra ruta al final.
  const url = process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL.trim()).origin : undefined;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  client = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return client;
}
