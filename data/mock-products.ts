import type { Product } from "@/types/product";

export const mockProducts: Product[] = [
  {
    id: "prod_manguera_30m",
    slug: "manguera-extensible",
    name: "Manguera Extensible 30m",
    tagline: "Se estira hasta 30 metros y vuelve a su tamaño. Regá todo el patio sin enredos.",
    price: 1290,
    compareAtPrice: 1990,
    images: [
      "/products/manguera-1.jpg",
      "/products/manguera-2.jpg",
      "/products/manguera-3.jpg",
      "/products/manguera-4.jpg",
    ],
    benefits: [
      { icon: "📏", text: "Se estira de 10 a 30 metros con la presión del agua" },
      { icon: "🪶", text: "Liviana: pesa menos de 1 kg y la guardás en un cajón" },
      { icon: "🚿", text: "Pistola con 7 tipos de chorro incluida" },
      { icon: "🔗", text: "Conectores universales: va con cualquier canilla" },
      { icon: "🧼", text: "Ideal para jardín, auto, vereda y mascotas" },
      { icon: "🌀", text: "No se enreda ni se dobla" },
    ],
    description:
      "Olvidate de la manguera pesada que se enrosca. Abrís la canilla y se estira sola hasta 30 metros; la cerrás y vuelve a su tamaño compacto. Viene con pistola de 7 chorros y adaptadores para cualquier canilla.",
    usageMedia: [
      {
        src: "/products/manguera-uso.mp4",
        type: "video",
        poster: "/products/manguera-2.jpg",
        caption: "Abrís la canilla y se estira sola.",
      },
      {
        src: "/products/manguera-3.jpg",
        type: "image",
        caption: "Cerrás el agua y entra en un cajón.",
      },
    ],
    faqs: [
      {
        q: "¿Cómo pago?",
        a: "Pagás en efectivo cuando la recibís. No tenés que adelantar nada.",
      },
      {
        q: "¿Cuánto demora el envío?",
        a: "En Montevideo y zona metropolitana te llega en el día si pedís antes de las 14 h. Al interior, de 24 a 72 h.",
      },
      {
        q: "¿Sirve para cualquier canilla?",
        a: "Sí. Incluye adaptadores universales de rosca y de enganche rápido.",
      },
      {
        q: "¿Qué pasa si viene fallada?",
        a: "Tenés garantía: te la cambiamos sin costo. Escribinos por WhatsApp y lo resolvemos.",
      },
      {
        q: "¿Cómo confirmo mi pedido?",
        a: "Después de pedir te escribimos por WhatsApp para confirmar dirección y horario de entrega.",
      },
    ],
    reviews: [
      {
        name: "Carolina M.",
        city: "Montevideo",
        rating: 5,
        text: "Me llegó el mismo día. Riego todo el fondo sin andar moviendo la canilla. Re recomendable.",
      },
      {
        name: "Martín R.",
        city: "Canelones",
        rating: 5,
        text: "La uso para lavar el auto, la pistola tira con buena presión. Pagué al recibir, cero drama.",
      },
      {
        name: "Lucía P.",
        city: "Maldonado",
        rating: 4,
        text: "Muy práctica y ocupa nada. Tardó dos días al interior pero llegó perfecta.",
      },
    ],
    active: true,
  },
];
