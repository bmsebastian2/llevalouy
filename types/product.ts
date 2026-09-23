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

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
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
