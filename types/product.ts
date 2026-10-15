export type ProductBenefit = {
  /** Emoji o nombre de ícono */
  icon: string;
  text: string;
};

export type ProductFaq = {
  q: string;
  a: string;
};

export type ProductReview = {
  name: string;
  city: string;
  /** 1 a 5 */
  rating: number;
  text: string;
};

export type ProductUsageMedia = {
  src: string;
  /** Para animaciones usar MP4 (mucho más liviano que GIF) */
  type: "image" | "video";
  caption: string;
  /** Cuadro que se muestra antes de reproducir el video */
  poster?: string;
};

/** Íconos del beneficio destacado de la card del home. Mismos valores que el check de la base. */
export const HIGHLIGHT_ICONS = ["drop", "bolt", "leaf", "home", "check", "sun", "shield"] as const;
export type HighlightIcon = (typeof HIGHLIGHT_ICONS)[number];

/** Íconos de la etiqueta de contexto. Mismos valores que el check de la base. */
export const CONTEXT_TAG_ICONS = ["leaf", "drop", "home", "sun", "bolt", "shield"] as const;

/** Etiqueta sobre la foto de la card del home, ej. "Ideal para jardín" */
export type ProductContextTag = {
  /** Máx. 20 caracteres */
  text: string;
  icon: (typeof CONTEXT_TAG_ICONS)[number];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  /** Beneficio de una línea para la card del home, máx. 40 caracteres. Sin él, la card muestra el tagline. */
  highlight?: string;
  /** Sin él, el beneficio se muestra con "check" */
  highlightIcon?: HighlightIcon;
  /** Sin ella, la foto de la card no lleva etiqueta */
  contextTag?: ProductContextTag;
  /** Precio en UYU, entero */
  price: number;
  /** Precio "antes" en UYU, entero */
  compareAtPrice?: number;
  /** Rutas o URLs; la primera es la principal y se usa como og:image */
  images: string[];
  benefits: ProductBenefit[];
  description: string;
  faqs: ProductFaq[];
  reviews: ProductReview[];
  /** Fotos o videos del producto en uso, intercalados entre los beneficios */
  usageMedia?: ProductUsageMedia[];
  active: boolean;
};
