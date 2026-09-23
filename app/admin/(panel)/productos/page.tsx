import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { listAllProducts } from "@/lib/admin/data";
import { discountPercent, formatPrice } from "@/lib/format";
import ProductActiveToggle from "@/components/admin/ProductActiveToggle";

export const metadata = { title: "Productos" };

type Props = { searchParams: Promise<{ guardado?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  await requireAdmin();
  const [{ guardado }, products] = await Promise.all([searchParams, listAllProducts()]);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex h-10 items-center rounded-xl bg-aqua px-4 text-sm font-extrabold text-ink"
        >
          + Nuevo
        </Link>
      </div>

      {guardado && (
        <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          ✅ “{guardado}” guardado. Ya se ve en el sitio.
        </p>
      )}

      {products.length === 0 ? (
        <p className="mt-10 text-center text-ink/60">Todavía no hay productos.</p>
      ) : (
        <ul className="mt-5 grid gap-3">
          {products.map((p) => {
            const off = discountPercent(p.price, p.compareAtPrice);
            return (
              <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-ink/5">
                <Link href={`/admin/productos/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-bg">
                    {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`truncate font-bold ${p.active ? "" : "text-ink/50"}`}>{p.name}</p>
                    <p className="text-sm">
                      <span className="font-bold text-aqua-dark">{formatPrice(p.price)}</span>
                      {off && <span className="ml-2 text-ink/50">-{off}%</span>}
                    </p>
                    <p className="truncate text-xs text-ink/50">/p/{p.slug}</p>
                  </div>
                </Link>
                <ProductActiveToggle id={p.id} active={p.active} />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
