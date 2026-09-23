// Sesión del admin: cookie "vencimiento.firma" firmada con HMAC-SHA256.
// Usa Web Crypto para funcionar igual en proxy.ts y en el servidor.
// La clave combina ADMIN_SESSION_SECRET + ADMIN_PASSWORD: cambiar la contraseña cierra todas las sesiones.

export const SESSION_COOKIE = "llevalo_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 días

const encoder = new TextEncoder();

async function getKey(): Promise<CryptoKey | null> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  if (!secret || !password || secret.length < 32) return null;
  return crypto.subtle.importKey("raw", encoder.encode(`${secret}|${password}`), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

function toBase64Url(bytes: ArrayBuffer): string {
  let bin = "";
  for (const b of new Uint8Array(bytes)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> | null {
  try {
    const bin = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

export async function createSessionToken(): Promise<string | null> {
  const key = await getKey();
  if (!key) return null;
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(exp));
  return `${exp}.${toBase64Url(sig)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  const key = await getKey();
  const sigBytes = fromBase64Url(sig);
  if (!key || !sigBytes) return false;
  // verify() compara en tiempo constante
  return crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(exp));
}
