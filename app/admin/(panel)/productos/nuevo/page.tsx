import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import ProductEditor from "@/components/admin/ProductEditor";

export const metadata = { title: "Nuevo producto" };

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/productos" className="text-sm font-bold text-ink/60 hover:text-ink">
        ← Productos
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold">Nuevo producto</h1>
      <ProductEditor />
    </>
  );
}
