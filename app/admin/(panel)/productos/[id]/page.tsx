import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { getProductById } from "@/lib/admin/data";
import ProductEditor from "@/components/admin/ProductEditor";

export const metadata = { title: "Editar producto" };

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <Link href="/admin/productos" className="text-sm font-bold text-ink/60 hover:text-ink">
          ← Productos
        </Link>
        {product.active && (
          <Link href={`/p/${product.slug}`} target="_blank" className="text-sm font-bold text-aqua-dark">
            Ver en el sitio ↗
          </Link>
        )}
      </div>
      <h1 className="mt-2 text-2xl font-extrabold">{product.name}</h1>
      <ProductEditor product={product} />
    </>
  );
}
