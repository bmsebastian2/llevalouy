"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitOrder, type OrderFormState } from "@/app/p/[slug]/actions";
import { formatPrice } from "@/lib/format";
import { SHIMMER } from "@/lib/shimmer";
import OrderSuccess from "./OrderSuccess";
import { DEPARTMENTS, MAX_QUANTITY, PAYMENT_METHODS, PAYMENT_METHOD_LABEL, type PaymentMethod } from "@/types/order";
import { parseItems, type OrderField } from "@/lib/order-validation";
import { cart, useCart, useCartReady } from "@/lib/cart";
import { CartIcon } from "./CartButton";
import { BARRIO_EVENT, readBarrio } from "@/lib/delivery";

export type OrderProduct = {
  slug: string;
  name: string;
  price: number;
  image?: string;
};

type Props = {
  /** El producto de la página: siempre va en el pedido. Sin él (página del carrito) el pedido es el carrito. */
  product?: OrderProduct;
  /** Productos activos: resuelven el carrito y se ofrecen en "Sumar otro producto" */
  catalog: OrderProduct[];
};

type Line = { product: OrderProduct; quantity: number };

const initialState: OrderFormState = {};

const PAYMENT_HINT: Record<PaymentMethod, string> = {
  cash: "Pagás cuando te llega",
  transfer: "Te pasamos los datos por WhatsApp",
  mercadopago: "Te mandamos el link de pago",
};

const PAYMENT_ICON: Record<PaymentMethod, React.ReactNode> = {
  cash: "💵",
  transfer: "🏦",
  mercadopago: <Image src="/brand/mercadopago.svg" alt="" width={28} height={28} className="size-7" />,
};

/** Campos que alimentan el recorrido y el ticket en vivo */
type Tracked = "name" | "phone" | "department" | "city" | "address";

type StepStatus = "done" | "current" | "todo" | "error";

const inputClass =
  "mt-1.5 block h-12 w-full rounded-xl border border-ink/15 bg-bg/50 px-4 text-base outline-none transition placeholder:text-ink/35 focus:border-aqua-dark focus:bg-white focus:ring-2 focus:ring-aqua/40 aria-[invalid=true]:border-red-500 aria-[invalid=true]:bg-red-50/60";

const labelClass = "text-sm font-bold";

export default function OrderForm({ product, catalog }: Props) {
  const [state, formAction, pending] = useActionState(submitOrder, initialState);
  const v = state.values ?? {};

  const cartItems = useCart();
  const cartReady = useCartReady();
  // Cantidad del producto de la página mientras no esté en el carrito
  const [mainQty, setMainQty] = useState(
    () => parseItems(v.items)?.find((it) => it.productSlug === product?.slug)?.quantity ?? 1,
  );
  const [showExtras, setShowExtras] = useState(false);
  const [announce, setAnnounce] = useState("");

  // Líneas del pedido: el producto de la página (fijo) + lo que haya en el carrito
  const cartLines = cartItems.flatMap((it) => {
    const p = catalog.find((c) => c.slug === it.slug);
    return p ? [{ product: p, quantity: it.quantity }] : [];
  });
  const mainInCart = product ? cartLines.find((l) => l.product.slug === product.slug) : undefined;
  const lines: Line[] = product
    ? [{ product, quantity: mainInCart?.quantity ?? mainQty }, ...cartLines.filter((l) => l !== mainInCart)]
    : cartLines;
  const extras = catalog.filter((p) => p.slug !== product?.slug);

  // Productos que se dejaron de vender salen del carrito
  useEffect(() => {
    if (cartReady) cart.keepOnly(catalog.map((p) => p.slug));
  }, [cartReady, catalog]);

  // Pedido guardado: el carrito ya se pidió entero
  useEffect(() => {
    if (state.success) cart.clear();
  }, [state.success]);

  const [payment, setPayment] = useState<PaymentMethod>(() =>
    PAYMENT_METHODS.includes(state.values?.paymentMethod as PaymentMethod)
      ? (state.values?.paymentMethod as PaymentMethod)
      : "cash",
  );
  const [fields, setFields] = useState<Record<Tracked, string>>(() => ({
    name: v.name ?? "",
    phone: v.phone ?? "",
    department: v.department || "Montevideo",
    city: v.city ?? "",
    address: v.address ?? "",
  }));
  const [showNotes, setShowNotes] = useState(() => Boolean(v.notes || state.errors?.notes));

  // Barrio elegido en "¿Llega hoy a tu barrio?": precarga el campo mientras la persona no haya escrito otro
  const cityRef = useRef<HTMLInputElement>(null);
  const autoCity = useRef("");
  useEffect(() => {
    function applySavedBarrio() {
      const saved = readBarrio();
      const input = cityRef.current;
      if (!saved || saved.kind === "interior" || !input) return;
      if (input.value.trim() && input.value !== autoCity.current) return;
      input.value = saved.name;
      autoCity.current = saved.name;
      setFields((f) => ({ ...f, city: saved.name }));
    }
    applySavedBarrio();
    window.addEventListener(BARRIO_EVENT, applySavedBarrio);
    return () => window.removeEventListener(BARRIO_EVENT, applySavedBarrio);
  }, []);

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

  const total = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const inOrder = (slug: string) => lines.some((l) => l.product.slug === slug);

  function setQuantity(slug: string, quantity: number) {
    if (slug === product?.slug && !mainInCart) setMainQty(quantity);
    else cart.set(slug, quantity);
  }

  function addExtra(p: OrderProduct) {
    if (inOrder(p.slug)) return;
    if (cart.add(p.slug)) setAnnounce(`${p.name} agregado a tu pedido.`);
    else setAnnounce(`Llegaste al máximo de productos por pedido.`);
  }

  function removeLine(p: OrderProduct) {
    cart.remove(p.slug);
    setAnnounce(`${p.name} quitado de tu pedido.`);
  }

  function track(e: React.FormEvent<HTMLFormElement>) {
    const t = e.target as HTMLInputElement;
    if (t.name in fields) setFields((f) => ({ ...f, [t.name]: t.value }));
  }

  // Cada parada se completa cuando tiene lo suyo y la anterior ya está lista
  const filled = (s: string) => s.trim().length > 0;
  const ready = [
    lines.length >= 1,
    filled(fields.name) && fields.phone.replace(/\D/g, "").length >= 8,
    filled(fields.city) && filled(fields.address),
    true,
  ];
  const stepErrors = [
    Boolean(err("items")),
    Boolean(err("name") || err("phone")),
    Boolean(err("department") || err("city") || err("address") || err("notes")),
    Boolean(err("paymentMethod")),
  ];
  let reached = true;
  let currentAssigned = false;
  const status: StepStatus[] = ready.map((ok, i) => {
    if (stepErrors[i]) return "error";
    const done = reached && ok;
    reached = done;
    if (done) return "done";
    if (!currentAssigned) {
      currentAssigned = true;
      return "current";
    }
    return "todo";
  });

  if (state.success) return <OrderSuccess {...state.success} />;

  // Página del carrito: esperar a leerlo antes de decir que está vacío
  if (!product && !cartReady) {
    return <div className="h-96 animate-pulse rounded-3xl bg-white/70 motion-reduce:animate-none" aria-hidden />;
  }
  if (!product && lines.length === 0) return <EmptyCart />;

  const destination = filled(fields.city) ? `${fields.city.trim()}, ${fields.department}` : fields.department;

  return (
    <form
      action={formAction}
      onChange={track}
      noValidate
      className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-ink/5"
    >
      <header className="px-5 pt-6 sm:px-8 sm:pt-8">
        <p className="text-sm font-bold text-aqua-dark">No pagás nada ahora</p>
        <h2 className="mt-1 text-3xl font-extrabold leading-tight">Hacé tu pedido</h2>
        <p className="mt-2 text-ink/70">
          Completás 4 datos y se abre WhatsApp con tu pedido ya escrito. Vos solo tocás Enviar.
        </p>
      </header>

      <input
        type="hidden"
        name="items"
        value={JSON.stringify(lines.map((l) => ({ productSlug: l.product.slug, quantity: l.quantity })))}
      />
      {/* Honeypot anti-spam: invisible para personas */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          No completar
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <ol className="mt-7 px-5 sm:px-8">
        <Step n={1} title="Tu pedido" status={status[0]}>
          <ul className="grid grid-cols-1 gap-2">
            {lines.map((l, i) => (
              <ItemRow
                key={l.product.slug}
                line={l}
                removable={!product || i > 0}
                onQuantity={(q) => setQuantity(l.product.slug, q)}
                onRemove={() => removeLine(l.product)}
              />
            ))}
          </ul>
          {fieldError("items")}

          {extras.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setShowExtras((o) => !o)}
                aria-expanded={showExtras}
                aria-controls="sumar-productos"
                className="mt-3 rounded-lg text-sm font-bold text-aqua-dark underline decoration-aqua decoration-2 underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-aqua/60"
              >
                {showExtras ? "Ocultar otros productos" : "+ Sumar otro producto"}
              </button>
              {showExtras && (
                <div id="sumar-productos" className="item-in mt-3">
                  <p className="text-sm text-ink/55">Van en el mismo envío.</p>
                  <ul className="no-scrollbar mt-2 flex snap-x gap-2.5 overflow-x-auto pb-1" aria-label="Otros productos">
                    {extras.map((p) => (
                      <ExtraCard key={p.slug} product={p} added={inOrder(p.slug)} onAdd={() => addExtra(p)} />
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          <p className="sr-only" aria-live="polite">
            {announce}
          </p>
        </Step>

        <Step n={2} title="¿Quién lo recibe?" hint="Te escribimos a este número para coordinar." status={status[1]}>
          <div className="grid gap-4">
            <label className="block">
              <span className={labelClass}>Nombre y apellido</span>
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
              <span className={labelClass}>Celular (WhatsApp)</span>
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
          </div>
        </Step>

        <Step n={3} title="¿Dónde te lo llevamos?" status={status[2]}>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Departamento</span>
                <span className="relative block">
                  <select
                    name="department"
                    required
                    defaultValue={v.department || "Montevideo"}
                    className={`${inputClass} appearance-none pr-10`}
                    {...errProps("department")}
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <svg
                    viewBox="0 0 20 20"
                    className="pointer-events-none absolute right-3.5 top-1/2 mt-[3px] size-5 -translate-y-1/2 text-ink/50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {fieldError("department")}
              </label>

              <label className="block">
                <span className={labelClass}>Barrio o ciudad</span>
                <input
                  ref={cityRef}
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
              <span className={labelClass}>Dirección</span>
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

            {showNotes ? (
              <label className="block">
                <span className={labelClass}>
                  Indicaciones para la entrega <span className="font-normal text-ink/50">(opcional)</span>
                </span>
                <textarea
                  name="notes"
                  rows={2}
                  maxLength={300}
                  defaultValue={v.notes}
                  placeholder="Horario en que estás, referencias…"
                  className={`${inputClass} h-auto py-3`}
                  autoFocus={!v.notes}
                  {...errProps("notes")}
                />
                {fieldError("notes")}
              </label>
            ) : (
              <button
                type="button"
                onClick={() => setShowNotes(true)}
                className="justify-self-start rounded-lg text-sm font-bold text-aqua-dark underline decoration-aqua decoration-2 underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-aqua/60"
              >
                + Agregar horario o referencias
              </button>
            )}
          </div>
        </Step>

        <Step n={4} title="¿Cómo vas a pagar?" status={status[3]} last>
          <fieldset {...errProps("paymentMethod")}>
            <legend className="sr-only">Método de pago</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m}
                  className="group relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-ink/10 bg-white p-3 transition has-[:checked]:border-aqua-dark has-[:checked]:bg-aqua/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-aqua/50 sm:flex-col sm:items-start sm:gap-2 sm:pt-3.5"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m}
                    checked={payment === m}
                    onChange={() => setPayment(m)}
                    className="sr-only"
                  />
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-bg text-2xl group-has-[:checked]:bg-white" aria-hidden>
                    {PAYMENT_ICON[m]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold leading-tight">{PAYMENT_METHOD_LABEL[m]}</span>
                    <span className="mt-0.5 block text-sm leading-snug text-ink/60">{PAYMENT_HINT[m]}</span>
                  </span>
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-ink/20 transition group-has-[:checked]:border-aqua-dark group-has-[:checked]:bg-aqua-dark sm:absolute sm:right-3 sm:top-3"
                    aria-hidden
                  >
                    <CheckIcon className="size-3 text-white opacity-0 group-has-[:checked]:opacity-100" />
                  </span>
                </label>
              ))}
            </div>
            {fieldError("paymentMethod")}
          </fieldset>
        </Step>
      </ol>

      {/* Ticket: resumen en vivo del pedido */}
      <div className="relative mt-2 bg-ink px-5 pb-6 pt-8 text-white sm:px-8 sm:pb-8">
        <span className="ticket-edge absolute inset-x-0 top-0" aria-hidden />

        <dl className="grid gap-2 text-sm">
          {lines.map((l) => (
            <ReceiptRow
              key={l.product.slug}
              label={`${l.product.name} × ${l.quantity}`}
              value={formatPrice(l.product.price * l.quantity)}
              strong
            />
          ))}
          <ReceiptRow label="Lo recibe" value={filled(fields.name) ? fields.name.trim() : "—"} />
          <ReceiptRow label="Entrega en" value={destination} />
          <ReceiptRow label="Pago" value={PAYMENT_METHOD_LABEL[payment]} />
        </dl>

        <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-dashed border-white/25 pt-4">
          <span className="font-bold">{payment === "cash" ? "Total a pagar al recibir" : "Total a pagar"}</span>
          <span className="text-3xl font-extrabold tabular-nums text-aqua">{formatPrice(total)}</span>
        </div>

        {state.message && (
          <p role="alert" className="mt-4 rounded-xl bg-red-500/15 px-4 py-3 text-sm font-medium text-red-100 ring-1 ring-red-400/40">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-aqua px-8 text-lg font-extrabold text-ink shadow-[0_6px_0_0_var(--aqua-dark)] outline-none transition focus-visible:ring-4 focus-visible:ring-white/40 active:translate-y-1 active:shadow-[0_2px_0_0_var(--aqua-dark)] disabled:translate-y-1 disabled:opacity-70 disabled:shadow-[0_2px_0_0_var(--aqua-dark)]"
        >
          {pending ? (
            <>
              <span className="size-5 animate-spin rounded-full border-[3px] border-ink/25 border-t-ink motion-reduce:animate-none" aria-hidden />
              Enviando…
            </>
          ) : (
            <>
              Confirmar pedido
            </>
          )}
        </button>
        <p className="mt-3 text-center text-sm text-white/60">🔒 Tus datos solo se usan para coordinar la entrega.</p>
      </div>
    </form>
  );
}

function Step({
  n,
  title,
  hint,
  status,
  last,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  status: StepStatus;
  last?: boolean;
  children: React.ReactNode;
}) {
  const dot = {
    done: "bg-aqua-dark text-white",
    current: "bg-aqua/20 text-aqua-dark ring-2 ring-aqua-dark",
    todo: "bg-white text-ink/45 ring-2 ring-ink/15",
    error: "bg-red-600 text-white",
  }[status];
  const srStatus = { done: "listo", current: "en curso", todo: "pendiente", error: "revisar" }[status];

  return (
    <li className={`relative grid grid-cols-[2rem_1fr] gap-x-3 sm:gap-x-4 ${last ? "pb-7" : "pb-8"}`}>
      {/* Tramo del recorrido hasta la siguiente parada */}
      {!last && (
        <span
          aria-hidden
          className={`absolute bottom-1 left-[15px] top-10 border-l-2 motion-safe:transition-colors ${
            status === "done" ? "border-solid border-aqua-dark" : "border-dashed border-ink/15"
          }`}
        />
      )}
      <span
        aria-hidden
        className={`relative flex size-8 items-center justify-center rounded-full text-sm font-extrabold motion-safe:transition-all motion-safe:duration-300 ${dot}`}
      >
        {status === "done" ? <CheckIcon className="size-4" /> : status === "error" ? "!" : n}
      </span>
      <div className="min-w-0">
        <h3 className="text-lg font-extrabold leading-8">
          {title}
          <span className="sr-only"> ({srStatus})</span>
        </h3>
        {hint && <p className="-mt-0.5 text-sm text-ink/60">{hint}</p>}
        <div className="mt-3">{children}</div>
      </div>
    </li>
  );
}

function EmptyCart() {
  return (
    <div className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-ink/5">
      <CartIcon className="mx-auto size-14 text-aqua-dark" />
      <h2 className="mt-4 text-2xl font-extrabold">Tu carrito está vacío</h2>
      <p className="mx-auto mt-2 max-w-xs text-ink/70">Sumá productos y los pedís todos juntos, en un solo envío.</p>
      <Link
        href="/"
        className="mt-6 inline-flex h-12 items-center gap-2 rounded-2xl bg-aqua px-6 font-extrabold text-ink shadow-[0_4px_0_0_var(--aqua-dark)] transition active:translate-y-1 active:shadow-[0_1px_0_0_var(--aqua-dark)]"
      >
        Ver productos
      </Link>
    </div>
  );
}

function ItemRow({
  line: { product, quantity },
  removable,
  onQuantity,
  onRemove,
}: {
  line: Line;
  removable: boolean;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  // En los productos sumados, restar desde 1 los quita del pedido
  const removes = removable && quantity <= 1;

  return (
    <li className={`flex items-center gap-2.5 rounded-2xl bg-bg p-2 pr-2.5 sm:gap-3 sm:p-2.5 sm:pr-3 ${removable ? "item-in" : ""}`}>
      {product.image && (
        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl sm:size-14">
          <Image src={product.image} alt="" fill sizes="56px" className="object-cover" placeholder={SHIMMER} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[15px] font-bold leading-tight sm:text-base">{product.name}</p>
        <p className="whitespace-nowrap text-sm text-ink/60">{formatPrice(product.price)} c/u</p>
      </div>
      <div
        className="flex shrink-0 items-center rounded-full bg-white p-0.5 ring-1 ring-ink/10 sm:p-1"
        role="group"
        aria-label={`Cantidad de ${product.name}`}
      >
        <QtyButton
          label={removes ? `Quitar ${product.name} del pedido` : "Restar una unidad"}
          onClick={() => (removes ? onRemove() : onQuantity(quantity - 1))}
          disabled={!removable && quantity <= 1}
        >
          {removes ? <TrashIcon className="size-[18px]" /> : "−"}
        </QtyButton>
        <span className="w-6 text-center text-lg font-extrabold tabular-nums sm:w-7" aria-live="polite">
          {quantity}
        </span>
        <QtyButton
          label="Sumar una unidad"
          onClick={() => onQuantity(Math.min(MAX_QUANTITY, quantity + 1))}
          disabled={quantity >= MAX_QUANTITY}
        >
          +
        </QtyButton>
      </div>
    </li>
  );
}

function ExtraCard({ product, added, onAdd }: { product: OrderProduct; added: boolean; onAdd: () => void }) {
  return (
    <li className="flex w-36 shrink-0 snap-start flex-col rounded-2xl bg-white p-2 ring-1 ring-ink/10">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-bg">
        {product.image && (
          <Image src={product.image} alt="" fill sizes="144px" className="object-cover" placeholder={SHIMMER} />
        )}
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-bold leading-tight">{product.name}</p>
      <p className="mb-2 mt-0.5 flex-1 text-sm text-ink/60">{formatPrice(product.price)}</p>
      <button
        type="button"
        onClick={onAdd}
        aria-disabled={added}
        aria-label={added ? `${product.name} ya está en tu pedido` : `Agregar ${product.name} al pedido`}
        className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-aqua/15 text-sm font-extrabold text-aqua-dark outline-none ring-1 ring-aqua-dark/25 transition hover:bg-aqua/25 focus-visible:ring-2 focus-visible:ring-aqua-dark active:scale-95 aria-disabled:bg-aqua-dark aria-disabled:text-white aria-disabled:ring-0 aria-disabled:active:scale-100"
      >
        {added ? (
          <>
            <CheckIcon className="size-3.5" /> Agregado
          </>
        ) : (
          "+ Agregar"
        )}
      </button>
    </li>
  );
}

function QtyButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full text-xl sm:size-10 font-bold text-aqua-dark outline-none transition hover:bg-aqua/15 focus-visible:ring-2 focus-visible:ring-aqua/60 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function ReceiptRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={`min-w-0 truncate ${strong ? "font-bold text-white" : "text-white/60"}`}>{label}</dt>
      <dd className={`max-w-[60%] truncate text-right ${strong ? "font-bold tabular-nums" : "text-white/90"}`}>{value}</dd>
    </div>
  );
}

function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 6h12M8 6V4.5h4V6m-6 0 .6 9.5h6.8L14 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
