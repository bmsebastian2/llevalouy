import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { countOrdersByStatus, listOrders } from "@/lib/admin/data";
import { formatPrice } from "@/lib/format";
import { buildCustomerMessage, formatUyPhone, whatsappUrl } from "@/lib/whatsapp";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL, type Order, type OrderStatus } from "@/types/order";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const metadata = { title: "Pedidos" };

type Props = { searchParams: Promise<{ estado?: string }> };

const dateFmt = new Intl.DateTimeFormat("es-UY", {
  timeZone: "America/Montevideo",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function OrdersPage({ searchParams }: Props) {
  await requireAdmin();
  const { estado } = await searchParams;
  const filter: OrderStatus | undefined =
    estado === "todos" ? undefined : ORDER_STATUSES.includes(estado as OrderStatus) ? (estado as OrderStatus) : "pending";

  const [orders, counts] = await Promise.all([listOrders(filter), countOrdersByStatus()]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const tabs: { key: string; label: string; count: number }[] = [
    ...ORDER_STATUSES.map((s) => ({ key: s, label: ORDER_STATUS_LABEL[s], count: counts[s] })),
    { key: "todos", label: "Todos", count: total },
  ];
  const current = filter ?? "todos";

  return (
    <>
      <h1 className="text-2xl font-extrabold">Pedidos</h1>

      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/admin/pedidos?estado=${t.key}`}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
              current === t.key ? "bg-ink text-white" : "bg-white text-ink/70 ring-1 ring-ink/10 hover:text-ink"
            }`}
          >
            {t.label} <span className="opacity-60">{t.count}</span>
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="mt-10 text-center text-ink/60">
          {current === "pending" ? "No hay pedidos pendientes. 🎉" : "No hay pedidos en esta lista."}
        </p>
      ) : (
        <ul className="mt-5 grid gap-3 lg:grid-cols-2">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </ul>
      )}
    </>
  );
}

function OrderCard({ order: o }: { order: Order }) {
  const wa = whatsappUrl(o.phone.replace(/\D/g, ""), buildCustomerMessage(o));

  return (
    <li className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-extrabold">{o.name}</p>
          <p className="text-xs text-ink/50">
            {o.code} · {dateFmt.format(new Date(o.createdAt))}
          </p>
        </div>
        <OrderStatusSelect id={o.id} status={o.status} />
      </div>

      <ul className="mt-3 space-y-0.5">
        {o.items.map((it) => (
          <li key={it.productId} className="flex items-baseline justify-between gap-3 font-bold">
            <span className="min-w-0">
              {it.productName} <span className="font-normal text-ink/60">x{it.quantity}</span>
            </span>
            {o.items.length > 1 && (
              <span className="shrink-0 text-sm font-normal tabular-nums text-ink/60">{formatPrice(it.subtotal)}</span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-1 flex items-baseline justify-between gap-3 font-bold">
        <span className="text-sm text-ink/60">{o.items.length > 1 ? `Total · ${o.items.length} productos` : "Total"}</span>
        <span className="tabular-nums text-aqua-dark">{formatPrice(o.total)}</span>
      </p>

      <dl className="mt-2 space-y-1 text-sm text-ink/80">
        <div>
          📍 {o.address}, {o.city}, {o.department}
        </div>
        <div>
          📱{" "}
          <a href={`tel:${o.phone}`} className="underline underline-offset-2">
            {formatUyPhone(o.phone)}
          </a>
        </div>
        <div>💳 {PAYMENT_METHOD_LABEL[o.paymentMethod] ?? o.paymentMethod}</div>
        {o.notes && <div>📝 {o.notes}</div>}
      </dl>

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-extrabold text-ink transition active:scale-[0.99]"
      >
        💬 {o.status === "shipped" ? "Avisar que va en camino" : o.status === "delivered" ? "Pedir opinión" : "Confirmar por WhatsApp"}
      </a>
    </li>
  );
}
