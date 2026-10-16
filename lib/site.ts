export const site = {
  name: "Llevalo UY",
  // Base de og:image y og:url. Sin la variable, en producción nunca localhost: WhatsApp no podría leer la imagen.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production" ? "https://llevalouy.vercel.app" : "http://localhost:3000"),
  instagram: "llevalouy",
  email: "tiendallevalouy@gmail.com",
  // TODO: Sebastián confirma el horario de atención
  hours: "Lunes a sábado, de 9 a 20 h",
  orderAnchor: "#pedido",
} as const;
