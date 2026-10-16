"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { WhatsappIcon, iconProps } from "./DeliveryIcons";

type Props = {
  /** Título para la hoja de compartir del sistema */
  title: string;
  /** Mensaje que acompaña al link */
  text: string;
  /** Ruta a compartir ("/p/manguera"): se completa con el dominio actual y ?utm_source=share */
  path: string;
  className?: string;
} & (
  | {
      /** Sin texto: ícono de 44px. El nombre accesible es obligatorio. */
      label: string;
      /**
       * "foto": círculo blanco que flota sobre una imagen. "header": ícono verde suelto, como el carrito.
       * "card": ícono gris al lado del nombre, para no competir con "Agregar".
       */
      variant?: "foto" | "header" | "card";
      children?: undefined;
    }
  | {
      /** Con texto: botón secundario con borde. El texto visible es el nombre accesible. */
      children: ReactNode;
      label?: undefined;
      variant?: undefined;
    }
);

const focusRing = "outline-none focus-visible:ring-4 focus-visible:ring-aqua-dark/40";

const option = `group flex min-h-16 w-full items-center gap-3 rounded-2xl px-3 py-2 text-left hover:bg-bg active:bg-bg ${focusRing}`;

const subscribeNoop = () => () => {};

/**
 * Comparte con la hoja nativa del celular (navigator.share). Si no existe o falla, abre una hoja propia
 * con WhatsApp y "Copiar link". Si la persona cierra la hoja nativa sin elegir, no se insiste.
 */
export default function ShareButton({ title, text, path, label, variant = "foto", children, className = "" }: Props) {
  const sheetRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [url, setUrl] = useState("");
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
  // Hoja y aviso van a <body>: dentro de la galería un `fixed` quedaría atado a la foto (container query),
  // y dentro de una card o la galería heredarían sus efectos de hover (group-hover, zoom de la foto)
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  async function share() {
    const link = new URL(path, window.location.origin);
    link.searchParams.set("utm_source", "share");
    const href = link.toString();
    setUrl(href);

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url: href });
        return;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
      }
    }
    sheetRef.current?.showModal();
  }

  async function copy() {
    const ok = await copyText(url, sheetRef.current);
    sheetRef.current?.close();
    setToast({ ok, text: ok ? "Link copiado" : "No se pudo copiar. Copialo desde la barra del navegador." });
  }

  const look = children
    ? `inline-flex h-11 items-center gap-2 rounded-xl border-2 border-aqua-dark px-4 font-bold text-aqua-dark hover:bg-white active:bg-white ${focusRing}`
    : {
        foto: "grid size-11 place-items-center rounded-full bg-white/90 text-aqua-dark shadow-md ring-1 ring-ink/10 backdrop-blur-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua-dark",
        header: `grid size-11 place-items-center rounded-xl text-aqua-dark hover:bg-ink/5 ${focusRing}`,
        card: `grid size-11 place-items-center rounded-xl text-ink/60 hover:bg-ink/5 hover:text-aqua-dark ${focusRing}`,
      }[variant];

  const sheet = (
    <dialog
      ref={sheetRef}
      aria-labelledby={titleId}
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      className="sheet mx-0 mb-0 mt-auto w-full max-w-none rounded-t-3xl bg-white p-0 text-ink md:m-auto md:max-w-md md:rounded-3xl"
    >
      <div className="px-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3 px-3 pb-1 pt-4">
          <p id={titleId} className="text-xl font-extrabold">
            Compartir
          </p>
          <button
            type="button"
            onClick={() => sheetRef.current?.close()}
            className={`-mr-2 grid size-12 shrink-0 place-items-center rounded-full hover:bg-bg ${focusRing}`}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5">
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="sr-only">Cerrar</span>
          </button>
        </div>

        <ul>
          <li>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sheetRef.current?.close()}
              className={option}
            >
              <Bubble>
                <WhatsappIcon className="size-6" />
              </Bubble>
              <Text title="Enviar por WhatsApp" detail={text} />
            </a>
          </li>
          <li>
            <button type="button" onClick={copy} className={option}>
              <Bubble>
                <LinkIcon className="size-5" />
              </Bubble>
              <Text title="Copiar link" detail={url.replace(/^https?:\/\//, "").split("?")[0]} />
            </button>
          </li>
        </ul>
      </div>
    </dialog>
  );

  // Sin animación: aparece y se va en seco, como la barra fija
  const notice = (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 md:bottom-8"
    >
      {toast && (
        <p className="flex max-w-sm items-center gap-2 rounded-full bg-ink px-5 py-3 text-center font-bold text-white shadow-lg">
          {toast.ok && (
            <svg {...iconProps} strokeWidth={2.5} className="size-5 shrink-0 text-aqua">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          )}
          {toast.text}
        </p>
      )}
    </div>
  );

  return (
    <>
      <button type="button" onClick={share} aria-label={label} className={`${look} transition-colors ${className}`}>
        <ShareIcon className="size-5 shrink-0" />
        {children}
      </button>
      {mounted &&
        createPortal(
          <>
            {sheet}
            {notice}
          </>,
          document.body,
        )}
    </>
  );
}

/** Sin HTTPS (ej. probando desde el celular por la IP local) no hay navigator.clipboard: se usa el método viejo */
async function copyText(value: string, host: HTMLElement | null): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // El textarea va dentro de la hoja abierta: con un <dialog> modal, el resto de la página es inerte
    const area = document.createElement("textarea");
    area.value = value;
    area.readOnly = true;
    area.style.cssText = "position:fixed;opacity:0";
    (host ?? document.body).append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

function Bubble({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-bg text-aqua-dark group-hover:bg-white group-active:bg-white">
      {children}
    </span>
  );
}

function Text({ title, detail }: { title: string; detail: string }) {
  return (
    <span className="min-w-0 leading-tight">
      <span className="block text-lg font-bold">{title}</span>
      <span className="mt-0.5 block truncate text-sm text-ink/65">{detail}</span>
    </span>
  );
}

/** Tres nodos unidos: el ícono de compartir de Android, el que más se reconoce acá */
function ShareIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} strokeWidth={2} className={className}>
      <circle cx="17.5" cy="5.5" r="2.5" />
      <circle cx="6.5" cy="12" r="2.5" />
      <circle cx="17.5" cy="18.5" r="2.5" />
      <path d="m8.7 10.7 6.6-3.9M8.7 13.3l6.6 3.9" />
    </svg>
  );
}

function LinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} strokeWidth={2} className={className}>
      <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
    </svg>
  );
}
