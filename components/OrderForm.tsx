"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { submitOrder, type OrderFormState } from "@/app/p/[slug]/actions";
import { formatPrice } from "@/lib/format";
import { SHIMMER } from "@/lib/shimmer";
import OrderSuccess from "./OrderSuccess";
import { DEPARTMENTS, MAX_QUANTITY } from "@/types/order";
import type { OrderField } from "@/lib/order-validation";

type Props = {
  slug: string;
  name: string;
  price: number;
  image?: string;
};

const initialState: OrderFormState = {};

const inputClass =
  "mt-1 block h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-base outline-none transition focus:border-aqua-dark focus:ring-2 focus:ring-aqua/40 aria-[invalid=true]:border-red-500";

export default function OrderForm({ slug, name, price, image }: Props) {
  const [state, formAction, pending] = useActionState(submitOrder, initialState);
  const [quantity, setQuantity] = useState(() => Number(state.values?.quantity) || 1);

  const v = state.values ?? {};
  const err = (f: OrderField) => state.errors?.[f];
  const errProps = (f: OrderField) =>
    err(f) ? { "aria-invalid": true as const, "aria-describedby": `${f}-error` } : {};

  function fieldError(field: OrderField) {
    const msg = err(field);
    return msg ? (
      <p id={`${field}-error`} className="mt-1 text-sm font-medium text-red-600">
        {msg}
      </p>
    ) : null;
  }

  if (state.success) return <OrderSuccess {...state.success} />;

  return (
    <form action={formAction} noValidate className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink/5 sm:p-8">
      <h2 className="text-2xl font-extrabold">Hacé tu pedido</h2>
      <p className="mt-1 text-ink/70">No pagás nada ahora. Al confirmar se abre WhatsApp con tu pedido listo para enviar.</p>

      {/* Resumen + cantidad */}
      <div className="mt-5 flex items-center gap-4 rounded-2xl bg-bg p-3">
        {image && (
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
            <Image src={image} alt="" fill sizes="64px" className="object-cover" placeholder={SHIMMER} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{name}</p>
          <p className="text-sm text-ink/70">{formatPrice(price)} c/u</p>
        </div>
        <div className="flex items-center rounded-xl bg-white ring-1 ring-ink/10" role="group" aria-label="Cantidad">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="size-10 text-xl font-bold text-aqua-dark disabled:opacity-30"
            aria-label="Restar una unidad"
          >
            −
          </button>
          <span className="w-6 text-center font-bold" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
            disabled={quantity >= MAX_QUANTITY}
            className="size-10 text-xl font-bold text-aqua-dark disabled:opacity-30"
            aria-label="Sumar una unidad"
          >
            +
          </button>
        </div>
      </div>

      <input type="hidden" name="productSlug" value={slug} />
      <input type="hidden" name="quantity" value={quantity} />
      {/* Honeypot anti-spam: invisible para personas */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          No completar
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="block">
          <span className="font-bold">Nombre y apellido</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            defaultValue={v.name}
            placeholder="Ej: Carolina Martínez"
            className={inputClass}
            {...errProps("name")}
          />
          {fieldError("name")}
        </label>

        <label className="block">
          <span className="font-bold">Celular (WhatsApp)</span>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            defaultValue={v.phone}
            placeholder="099 123 456"
            className={inputClass}
            {...errProps("phone")}
          />
          {fieldError("phone")}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="font-bold">Departamento</span>
            <select
              name="department"
              required
              defaultValue={v.department || "Montevideo"}
              className={inputClass}
              {...errProps("department")}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {fieldError("department")}
          </label>

          <label className="block">
            <span className="font-bold">Barrio o ciudad</span>
            <input
              name="city"
              type="text"
              autoComplete="address-level2"
              required
              defaultValue={v.city}
              placeholder="Ej: Pocitos"
              className={inputClass}
              {...errProps("city")}
            />
            {fieldError("city")}
          </label>
        </div>

        <label className="block">
          <span className="font-bold">Dirección</span>
          <input
            name="address"
            type="text"
            autoComplete="street-address"
            required
            defaultValue={v.address}
            placeholder="Calle, número, apto y esquina"
            className={inputClass}
            {...errProps("address")}
          />
          {fieldError("address")}
        </label>

        <label className="block">
          <span className="font-bold">
            Comentarios <span className="font-normal text-ink/50">(opcional)</span>
          </span>
          <textarea
            name="notes"
            rows={2}
            maxLength={300}
            defaultValue={v.notes}
            placeholder="Horario en que estás, referencias…"
            className={`${inputClass} h-auto py-3`}
            {...errProps("notes")}
          />
          {fieldError("notes")}
        </label>
      </div>

      <div className="mt-6 flex items-baseline justify-between border-t border-ink/10 pt-4">
        <span className="font-bold">Total a pagar al recibir</span>
        <span className="text-2xl font-extrabold text-aqua-dark">{formatPrice(price * quantity)}</span>
      </div>

      {state.message && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-aqua px-8 text-lg font-extrabold text-ink shadow-[0_6px_0_0_var(--aqua-dark)] transition active:translate-y-1 active:shadow-[0_2px_0_0_var(--aqua-dark)] disabled:translate-y-1 disabled:opacity-70 disabled:shadow-[0_2px_0_0_var(--aqua-dark)]"
      >
        {pending ? "Enviando…" : "Confirmar por WhatsApp"}
      </button>
      <p className="mt-3 text-center text-sm text-ink/60">🔒 Tus datos solo se usan para coordinar la entrega.</p>
    </form>
  );
}
