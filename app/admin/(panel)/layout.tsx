import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { logout } from "@/app/admin/actions";
import AdminNav from "@/components/admin/AdminNav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <Link href="/admin/pedidos" className="shrink-0">
            <Image src="/brand/logo-horizontal.svg" alt="Llevalo UY" width={108} height={28} loading="eager" />
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" target="_blank" className="font-medium text-ink/60 hover:text-ink">
              Ver sitio ↗
            </Link>
            <form action={logout}>
              <button type="submit" className="font-medium text-ink/60 hover:text-ink">
                Salir
              </button>
            </form>
          </div>
        </div>
        <AdminNav />
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </>
  );
}
