export const site = {
  name: "Llevalo UY",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  instagram: "llevalouy",
  email: "tiendallevalouy@gmail.com",
  // TODO: Sebastián confirma el horario de atención
  hours: "Lunes a sábado, de 9 a 20 h",
  orderAnchor: "#pedido",
} as const;
