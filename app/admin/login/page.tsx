import Image from "next/image";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/auth";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Ingresar" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin/pedidos");

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4">
      <Image src="/brand/logo-horizontal.svg" alt="Llevalo UY" width={155} height={40} className="mx-auto" loading="eager" />
      <h1 className="mt-6 text-center text-xl font-extrabold">Panel de administración</h1>
      <LoginForm />
    </main>
  );
}
