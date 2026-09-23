export const DEPARTMENTS = [
  "Montevideo",
  "Canelones",
  "Maldonado",
  "Artigas",
  "Cerro Largo",
  "Colonia",
  "Durazno",
  "Flores",
  "Florida",
  "Lavalleja",
  "Paysandú",
  "Río Negro",
  "Rivera",
  "Rocha",
  "Salto",
  "San José",
  "Soriano",
  "Tacuarembó",
  "Treinta y Tres",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export const MAX_QUANTITY = 5;

/** Lo que manda el cliente (ya validado y normalizado) */
export type OrderInput = {
  productSlug: string;
  quantity: number;
  name: string;
  /** Normalizado a +5989XXXXXXX */
  phone: string;
  department: Department;
  city: string;
  address: string;
  notes?: string;
};

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

/** Pedido guardado. Precio y total se calculan en el servidor, nunca vienen del cliente. */
export type Order = Omit<OrderInput, "productSlug"> & {
  id: string;
  /** Número de pedido que ve el cliente, ej: LL-BXNZ5D4X */
  code: string;
  productId: string;
  productSlug: string;
  productName: string;
  unitPrice: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
};
