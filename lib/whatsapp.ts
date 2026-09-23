import "server-only";
import type { Order } from "@/types/order";
import { formatPrice } from "@/lib/format";

/** Número de WhatsApp de la tienda en formato internacional sin "+", ej: 59899123456 */
export function getStoreWhatsapp(): string | null {
  const digits = (process.env.WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  return digits.length >= 10 ? digits : null;
}

/** +59899123456 → 099 123 456 */
export function formatUyPhone(e164: string): string {
  const local = "0" + e164.replace(/^\+598/, "");
  return local.replace(/^(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3");
}

export function buildOrderMessage(order: Order): string {
  const lines = [
    "¡Hola Llevalo UY! 👋 Quiero hacer este pedido:",
    "",
    `🛒 *${order.productName}* x${order.quantity}`,
    `💵 Total: *${formatPrice(order.total)}* (pago al recibir)`,
    "",
    `👤 Nombre: ${order.name}`,
    `📱 Celular: ${formatUyPhone(order.phone)}`,
    `📍 Dirección: ${order.address}, ${order.city}, ${order.department}`,
  ];
  if (order.notes) lines.push(`📝 Comentarios: ${order.notes}`);
  lines.push("", `Pedido N° ${order.code}`);
  return lines.join("\n");
}

/** Mensaje que la tienda le manda al cliente desde el admin, según el estado del pedido. */
export function buildCustomerMessage(order: Order): string {
  const firstName = order.name.split(" ")[0];
  const summary = [
    `🛒 *${order.productName}* x${order.quantity}`,
    `💵 Total: *${formatPrice(order.total)}* (pagás al recibir)`,
    `📍 ${order.address}, ${order.city}, ${order.department}`,
  ];

  switch (order.status) {
    case "shipped":
      return [
        `¡Hola ${firstName}! 🚚 Tu pedido N° ${order.code} de Llevalo UY ya va en camino.`,
        "",
        ...summary,
        "",
        "Tené el efectivo a mano. ¡Gracias por tu compra!",
      ].join("\n");
    case "delivered":
      return `¡Hola ${firstName}! 😊 Esperamos que disfrutes tu ${order.productName}. Si tenés un minuto, contanos qué te pareció. ¡Gracias por comprar en Llevalo UY!`;
    default:
      return [
        `¡Hola ${firstName}! 👋 Te escribimos de Llevalo UY por tu pedido N° ${order.code}:`,
        "",
        ...summary,
        "",
        "¿Nos confirmás que los datos están bien y en qué horario te queda cómodo recibirlo?",
      ].join("\n");
  }
}

/** wa.me abre la app en el celular y WhatsApp Web / Desktop en la compu. */
export function whatsappUrl(storeNumber: string, text?: string): string {
  return `https://wa.me/${storeNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
