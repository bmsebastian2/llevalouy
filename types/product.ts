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
  active: boolean;
};
