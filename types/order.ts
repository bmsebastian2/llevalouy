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

/** Unidades máximas de cada producto */
export const MAX_QUANTITY = 5;
/** Productos distintos por pedido */
export const MAX_ITEMS = 10;

export const PAYMENT_METHODS = ["cash", "transfer", "mercadopago"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: "Efectivo al recibir",
  transfer: "Transferencia bancaria",
  mercadopago: "Mercado Pago",
};

export type OrderItemInput = {
  productSlug: string;
  quantity: number;
};

/** Lo que manda el cliente (ya validado y normalizado) */
export type OrderInput = {
  /** El primero es el producto de la página; los demás, los que sumó */
  items: OrderItemInput[];
  name: string;
  /** Normalizado a +5989XXXXXXX */
  phone: string;
  department: Department;
  city: string;
  address: string;
  paymentMethod: PaymentMethod;
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

export type OrderItem = {
  productId: string;
  productSlug: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

/** Pedido guardado. Precios y total se calculan en el servidor, nunca vienen del cliente. */
export type Order = Omit<OrderInput, "items"> & {
  id: string;
  /** Número de pedido que ve el cliente, ej: LL-BXNZ5D4X */
  code: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};
