// es-UY con style "currency" muestra "$"; acá se usa "$U", como en los comercios de Uruguay.
const uyu = new Intl.NumberFormat("es-UY", { maximumFractionDigits: 0 });

/** 1290 → "$U 1.290" */
export function formatPrice(value: number): string {
  return `$U ${uyu.format(value)}`;
}

export function discountPercent(price: number, compareAtPrice?: number): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round((1 - price / compareAtPrice) * 100);
}
