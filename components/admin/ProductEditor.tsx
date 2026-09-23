"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import { getImageUploadUrl, saveProduct, type SaveProductState } from "@/app/admin/actions";
import { slugify, type ProductErrors } from "@/lib/admin/product-validation";
import { discountPercent, formatPrice } from "@/lib/format";
import { SHIMMER } from "@/lib/shimmer";
import type { Product, ProductBenefit, ProductFaq, ProductReview } from "@/types/product";

type Draft = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: string;
  compareAtPrice: string;
  images: string[];
  benefits: ProductBenefit[];
  faqs: ProductFaq[];
  reviews: ProductReview[];
  active: boolean;
};

function toDraft(p?: Product): Draft {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    tagline: p?.tagline ?? "",
    description: p?.description ?? "",
    price: p ? String(p.price) : "",
    compareAtPrice: p?.compareAtPrice ? String(p.compareAtPrice) : "",
    images: p?.images ?? [],
    benefits: p?.benefits ?? [],
    faqs: p?.faqs ?? [],
    reviews: p?.reviews ?? [],
    active: p?.active ?? true,
  };
}

const input =
  "mt-1 block w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-base outline-none transition focus:border-aqua-dark focus:ring-2 focus:ring-aqua/40";

// ───────────── Fotos: se achican en el navegador y suben directo a Supabase Storage ─────────────

const MAX_SIDE = 1600;

async function compress(file: File): Promise<{ blob: Blob; ext: "webp" | "jpg" }> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();

  const toBlob = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
  const webp = await toBlob("image/webp");
  if (webp && webp.type === "image/webp") return { blob: webp, ext: "webp" };
  const jpg = await toBlob("image/jpeg"); // Safari viejo no genera WebP
  if (!jpg) throw new Error("No se pudo procesar la imagen.");
  return { blob: jpg, ext: "jpg" };
}

async function uploadImage(file: File): Promise<string> {
  const { blob, ext } = await compress(file);
  const target = await getImageUploadUrl(ext);
  if (target.error || !target.signedUrl || !target.publicUrl) throw new Error(target.error ?? "Error al subir.");

  const body = new FormData();
  body.append("cacheControl", "31536000");
  body.append("", blob);
  const res = await fetch(target.signedUrl, { method: "PUT", body, headers: { "x-upsert": "false" } });
  if (!res.ok) throw new Error(`Supabase rechazó la foto (${res.status}).`);
  return target.publicUrl;
}

// ───────────── Editor ─────────────

export default function ProductEditor({ product }: { product?: Product }) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(product));
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, formAction, saving] = useActionState<SaveProductState, FormData>(saveProduct, {});
  const errors: ProductErrors = state.errors ?? {};

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  function updateItem<K extends "benefits" | "faqs" | "reviews">(key: K, i: number, patch: Partial<Draft[K][number]>) {
    setDraft((d) => ({ ...d, [key]: d[key].map((item, j) => (j === i ? { ...item, ...patch } : item)) }));
  }
  function removeItem(key: "benefits" | "faqs" | "reviews" | "images", i: number) {
    setDraft((d) => ({ ...d, [key]: (d[key] as unknown[]).filter((_, j) => j !== i) }));
  }
  function moveImage(i: number, dir: -1 | 1) {
    setDraft((d) => {
      const imgs = [...d.images];
      const j = i + dir;
      if (j < 0 || j >= imgs.length) return d;
      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
      return { ...d, images: imgs };
    });
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploadError(null);
    const list = Array.from(files).slice(0, 10 - draft.images.length);
    for (let i = 0; i < list.length; i++) {
      setUploading(`Subiendo ${i + 1} de ${list.length}…`);
      try {
        const url = await uploadImage(list[i]);
        setDraft((d) => ({ ...d, images: [...d.images, url] }));
      } catch (err) {
        setUploadError(`${list[i].name}: ${err instanceof Error ? err.message : "error al subir"}`);
      }
    }
    setUploading(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  const price = Number(draft.price) || 0;
  const off = discountPercent(price, Number(draft.compareAtPrice) || undefined);
  const payload = JSON.stringify({
    ...draft,
    price: draft.price,
    compareAtPrice: draft.compareAtPrice || null,
  });

  const err = (k: keyof ProductErrors) =>
    errors[k] ? <p className="mt-1 text-sm font-medium text-red-600">{errors[k]}</p> : null;

  return (
    <form action={formAction} className="mt-5 grid gap-5 pb-28">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input type="hidden" name="payload" value={payload} />

      {/* Fotos */}
      <Section title="Fotos" hint="La primera es la principal y la que se ve al compartir el link.">
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {draft.images.map((src, i) => (
            <li key={src} className="relative aspect-square overflow-hidden rounded-xl bg-bg ring-1 ring-ink/10">
              <Image src={src} alt="" fill sizes="160px" className="object-cover" placeholder={SHIMMER} />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-bold text-white">
                  Principal
                </span>
              )}
              <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1">
                <IconBtn label="Mover a la izquierda" onClick={() => moveImage(i, -1)} disabled={i === 0}>
                  ←
                </IconBtn>
                <IconBtn label="Quitar foto" onClick={() => removeItem("images", i)}>
                  ✕
                </IconBtn>
                <IconBtn label="Mover a la derecha" onClick={() => moveImage(i, 1)} disabled={i === draft.images.length - 1}>
                  →
                </IconBtn>
              </div>
            </li>
          ))}
          {draft.images.length < 10 && (
            <li>
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink/20 text-center text-sm font-bold text-ink/60 hover:border-aqua-dark hover:text-aqua-dark">
                <span className="text-2xl">＋</span>
                Agregar
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  disabled={Boolean(uploading)}
                  onChange={(e) => onFiles(e.target.files)}
                />
              </label>
            </li>
          )}
        </ul>
        {uploading && <p className="mt-2 text-sm font-medium text-aqua-dark">{uploading}</p>}
        {uploadError && <p className="mt-2 text-sm font-medium text-red-600">{uploadError}</p>}
        {err("images")}
      </Section>

      {/* Datos */}
      <Section title="Datos">
        <label className="block">
          <span className="font-bold">Nombre</span>
          <input
            className={input}
            value={draft.name}
            onChange={(e) => {
              set("name", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
            placeholder="Manguera Extensible 30m"
          />
          {err("name")}
        </label>

        <label className="block">
          <span className="font-bold">Dirección del producto</span>
          <div className="mt-1 flex items-center rounded-xl border border-ink/15 bg-white focus-within:border-aqua-dark focus-within:ring-2 focus-within:ring-aqua/40">
            <span className="pl-3 text-ink/50">/p/</span>
            <input
              className="w-full rounded-xl bg-transparent px-1 py-2.5 text-base outline-none"
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              placeholder="manguera-extensible"
            />
          </div>
          {product && draft.slug !== product.slug && (
            <p className="mt-1 text-sm font-medium text-amber-700">
              ⚠️ Si cambiás la dirección, los anuncios con el link viejo van a dar “no encontrado”.
            </p>
          )}
          {err("slug")}
        </label>

        <label className="block">
          <span className="font-bold">Frase corta</span>
          <input
            className={input}
            value={draft.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            placeholder="Se estira hasta 30 metros y vuelve a su tamaño."
          />
          {err("tagline")}
        </label>

        <label className="block">
          <span className="font-bold">Descripción</span>
          <textarea
            className={input}
            rows={4}
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
          />
          {err("description")}
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="font-bold">Precio ($)</span>
            <input
              className={input}
              inputMode="numeric"
              value={draft.price}
              onChange={(e) => set("price", e.target.value.replace(/\D/g, ""))}
              placeholder="1290"
            />
            {err("price")}
          </label>
          <label className="block">
            <span className="font-bold">
              Precio antes <span className="font-normal text-ink/50">(tachado)</span>
            </span>
            <input
              className={input}
              inputMode="numeric"
              value={draft.compareAtPrice}
              onChange={(e) => set("compareAtPrice", e.target.value.replace(/\D/g, ""))}
              placeholder="1990"
            />
            {err("compareAtPrice")}
          </label>
        </div>
        {price > 0 && (
          <p className="text-sm text-ink/70">
            Se ve así: <strong className="text-aqua-dark">{formatPrice(price)}</strong>
            {off && (
              <>
                {" "}
                <s>{formatPrice(Number(draft.compareAtPrice))}</s> <strong>-{off}%</strong>
              </>
            )}
          </p>
        )}

        <label className="flex items-center gap-3 rounded-xl bg-bg p-3">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(e) => set("active", e.target.checked)}
            className="size-5 accent-[var(--aqua-dark)]"
          />
          <span>
            <span className="font-bold">Activo</span>{" "}
            <span className="text-sm text-ink/60">(visible en el sitio y se puede pedir)</span>
          </span>
        </label>
      </Section>

      {/* Beneficios */}
      <Section title="Beneficios" hint="Un emoji y una frase corta.">
        {draft.benefits.map((b, i) => (
          <div key={i} className="flex items-start gap-2">
            <input
              className={`${input} mt-0 w-14 text-center`}
              value={b.icon}
              onChange={(e) => updateItem("benefits", i, { icon: e.target.value })}
              aria-label="Emoji"
              placeholder="✅"
            />
            <input
              className={`${input} mt-0`}
              value={b.text}
              onChange={(e) => updateItem("benefits", i, { text: e.target.value })}
              aria-label="Texto del beneficio"
              placeholder="Se estira de 10 a 30 metros"
            />
            <RemoveBtn onClick={() => removeItem("benefits", i)} />
          </div>
        ))}
        <AddBtn onClick={() => set("benefits", [...draft.benefits, { icon: "✅", text: "" }])}>Agregar beneficio</AddBtn>
        {err("benefits")}
      </Section>

      {/* Preguntas */}
      <Section title="Preguntas frecuentes">
        {draft.faqs.map((f, i) => (
          <div key={i} className="grid gap-2 rounded-xl bg-bg p-3">
            <div className="flex items-start gap-2">
              <input
                className={`${input} mt-0 font-bold`}
                value={f.q}
                onChange={(e) => updateItem("faqs", i, { q: e.target.value })}
                placeholder="¿Cómo pago?"
                aria-label="Pregunta"
              />
              <RemoveBtn onClick={() => removeItem("faqs", i)} />
            </div>
            <textarea
              className={`${input} mt-0`}
              rows={2}
              value={f.a}
              onChange={(e) => updateItem("faqs", i, { a: e.target.value })}
              placeholder="Respuesta"
              aria-label="Respuesta"
            />
          </div>
        ))}
        <AddBtn onClick={() => set("faqs", [...draft.faqs, { q: "", a: "" }])}>Agregar pregunta</AddBtn>
        {err("faqs")}
      </Section>

      {/* Reseñas */}
      <Section title="Reseñas">
        {draft.reviews.map((r, i) => (
          <div key={i} className="grid gap-2 rounded-xl bg-bg p-3">
            <div className="flex items-start gap-2">
              <input
                className={`${input} mt-0`}
                value={r.name}
                onChange={(e) => updateItem("reviews", i, { name: e.target.value })}
                placeholder="Nombre"
                aria-label="Nombre"
              />
              <input
                className={`${input} mt-0`}
                value={r.city}
                onChange={(e) => updateItem("reviews", i, { city: e.target.value })}
                placeholder="Ciudad"
                aria-label="Ciudad"
              />
              <RemoveBtn onClick={() => removeItem("reviews", i)} />
            </div>
            <select
              className={`${input} mt-0`}
              value={r.rating}
              onChange={(e) => updateItem("reviews", i, { rating: Number(e.target.value) })}
              aria-label="Estrellas"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)} ({n})
                </option>
              ))}
            </select>
            <textarea
              className={`${input} mt-0`}
              rows={2}
              value={r.text}
              onChange={(e) => updateItem("reviews", i, { text: e.target.value })}
              placeholder="Lo que dijo"
              aria-label="Texto de la reseña"
            />
          </div>
        ))}
        <AddBtn onClick={() => set("reviews", [...draft.reviews, { name: "", city: "", rating: 5, text: "" }])}>
          Agregar reseña
        </AddBtn>
        {err("reviews")}
      </Section>

      {/* Barra de guardado */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <p role="alert" className="min-w-0 flex-1 truncate text-sm font-medium text-red-600">
            {errors.form}
          </p>
          <button
            type="submit"
            disabled={saving || Boolean(uploading)}
            className="h-12 shrink-0 rounded-xl bg-aqua px-6 font-extrabold text-ink transition disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
}

// ───────────── Piezas chicas ─────────────

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5 sm:p-5">
      <div>
        <h2 className="text-lg font-extrabold">{title}</h2>
        {hint && <p className="text-sm text-ink/60">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function IconBtn(props: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={props.label}
      onClick={props.onClick}
      disabled={props.disabled}
      className="flex size-7 items-center justify-center rounded-lg bg-white/90 text-sm font-bold shadow disabled:opacity-30"
    >
      {props.children}
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Quitar"
      className="flex size-11 shrink-0 items-center justify-center rounded-xl text-ink/40 hover:bg-red-50 hover:text-red-600"
    >
      ✕
    </button>
  );
}

function AddBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-11 rounded-xl border-2 border-dashed border-ink/15 text-sm font-bold text-ink/60 hover:border-aqua-dark hover:text-aqua-dark"
    >
      ＋ {children}
    </button>
  );
}
