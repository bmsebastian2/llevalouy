"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
      <label className="block">
        <span className="font-bold">Contraseña</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="mt-1 block h-12 w-full rounded-xl border border-ink/15 px-4 outline-none focus:border-aqua-dark focus:ring-2 focus:ring-aqua/40"
        />
      </label>
      {state.error && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-5 h-12 w-full rounded-xl bg-ink font-bold text-white transition disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
