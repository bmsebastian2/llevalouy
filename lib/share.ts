import { formatPrice } from "./format";

// Mensajes de los botones de compartir. Uno solo por cosa: el producto se comparte igual desde la foto y desde la card.

export const SITE_SHARE_TEXT = "Cosas útiles para la casa, con envío en el día y pago al recibir en Montevideo.";

export function productShareText(p: { name: string; price: number }) {
  return `Mirá esto en Llevalo UY: ${p.name} a ${formatPrice(p.price)}`;
}
