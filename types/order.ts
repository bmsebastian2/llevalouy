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

export const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

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
