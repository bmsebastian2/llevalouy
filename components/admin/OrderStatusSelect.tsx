"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/actions";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, type OrderStatus } from "@/types/order";

const COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-sky-100 text-sky-900",
  shipped: "bg-violet-100 text-violet-900",
  delivered: "bg-emerald-100 text-emerald-900",
  cancelled: "bg-ink/10 text-ink/60",
};

export default function OrderStatusSelect({ id, status }: { id: string; status: OrderStatus }) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  function onChange(next: OrderStatus) {
    const prev = value;
    setValue(next);
    setError(undefined);
    startTransition(async () => {
      const res = await updateOrderStatus(id, next);
      if (res.error) {
        setValue(prev);
        setError(res.error);
      }
    });
  }

  return (
    <div className="text-right">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as OrderStatus)}
        disabled={pending}
        aria-label="Estado del pedido"
        className={`h-9 rounded-full px-3 text-sm font-bold outline-none ring-aqua-dark focus:ring-2 disabled:opacity-60 ${COLORS[value]}`}
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
