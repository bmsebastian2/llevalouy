"use client";

import { useId, useRef, useState, type RefObject } from "react";
import {
  BARRIOS,
  INTERIOR_TIME,
  OTHER_BARRIO_TIME,
  deliveryAnswer,
  saveBarrio,
  type BarrioChoice,
} from "@/lib/delivery";
import { useNow } from "@/lib/use-now";

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

const focusRing = "outline-none focus-visible:ring-4 focus-visible:ring-aqua-dark/40";

type Props = {
  dialogRef: RefObject<HTMLDialogElement | null>;
  choice: BarrioChoice | null;
};

/**
 * "¿Dónde entregamos?": la lista de barrios con el día en que llega a cada uno.
 * Tocar un barrio lo guarda; el formulario de pedido lo toma solo.
 * Es el único momento con movimiento de la página: la hoja sube desde abajo.
 */
export default function BarrioSheet({ dialogRef, choice }: Props) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const listId = useId();
  const now = useNow();

  function choose(c: BarrioChoice) {
    saveBarrio(c);
    setQuery("");
    dialogRef.current?.close();
  }

  const q = normalize(query);
  const matches = q ? BARRIOS.filter((b) => normalize(b.name).includes(q)) : BARRIOS;
  const typed = query.trim();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      className="sheet mx-0 mb-0 mt-auto max-h-[85dvh] w-full max-w-none rounded-t-3xl bg-white p-0 text-ink md:m-auto md:max-w-md md:rounded-3xl"
    >
      <div className="flex max-h-[85dvh] flex-col">
        <div className="flex items-start justify-between gap-3 px-5 pb-1 pt-4">
          <div>
            <p id={titleId} className="text-xl font-extrabold">
              ¿Dónde entregamos?
            </p>
            <p className="mt-1 text-ink/75">Tocá tu barrio y lo usamos en tu pedido.</p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className={`-mr-2 grid size-12 shrink-0 place-items-center rounded-full hover:bg-bg ${focusRing}`}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5">
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="sr-only">Cerrar</span>
          </button>
        </div>

        <div className="px-5 pb-3 pt-2">
          <label className="sr-only" htmlFor={`${listId}-search`}>
            Buscá tu barrio
          </label>
          <input
            ref={searchRef}
            id={`${listId}-search`}
            type="search"
            autoComplete="off"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter" || !typed) return;
              e.preventDefault();
              const only = matches.length === 1 ? matches[0] : undefined;
              choose(only ? { kind: "barrio", name: only.name } : { kind: "otro", name: typed });
            }}
            placeholder="Buscá tu barrio"
            aria-controls={listId}
            className="block h-12 w-full rounded-xl border border-ink/15 bg-bg/60 px-4 text-base outline-none placeholder:text-ink/55 focus:border-aqua-dark focus:bg-white focus:ring-2 focus:ring-aqua-dark/30"
          />
        </div>

        <ul id={listId} className="overflow-y-auto overscroll-contain px-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {matches.map((b) => {
            const answer = deliveryAnswer({ kind: "barrio", name: b.name }, now);
            return (
              <li key={b.name}>
                <BarrioOption
                  selected={choice?.kind === "barrio" && choice.name === b.name}
                  onClick={() => choose({ kind: "barrio", name: b.name })}
                  when={answer.headline.replace(/\.$/, "")}
                  today={answer.today}
                >
                  {b.name}
                </BarrioOption>
              </li>
            );
          })}
          {typed && matches.length === 0 && (
            <li>
              <BarrioOption onClick={() => choose({ kind: "otro", name: typed })} when={OTHER_BARRIO_TIME}>
                Mi barrio es {typed}
              </BarrioOption>
            </li>
          )}
          {!typed && (
            <li>
              <BarrioOption onClick={() => searchRef.current?.focus()} when={OTHER_BARRIO_TIME} muted>
                Otro barrio de Montevideo
              </BarrioOption>
            </li>
          )}
          <li className="mt-1 border-t border-espuma pt-1">
            <BarrioOption
              selected={choice?.kind === "interior"}
              onClick={() => choose({ kind: "interior" })}
              when={INTERIOR_TIME}
              muted
            >
              Fuera de Montevideo
            </BarrioOption>
          </li>
        </ul>
      </div>
    </dialog>
  );
}

function BarrioOption({
  children,
  onClick,
  when,
  today = false,
  selected = false,
  muted = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  /** Cuándo llega: "Hoy", "Mañana", "24 a 48 h" */
  when: string;
  today?: boolean;
  selected?: boolean;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected || undefined}
      className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-3 text-left text-lg hover:bg-bg ${
        muted ? "font-medium" : "font-bold"
      } ${focusRing}`}
    >
      <span className="flex min-w-0 flex-1 items-center gap-2">
        {children}
        {selected && (
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 shrink-0 text-aqua-dark">
            <path d="m4.5 10.5 3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span
        className={`shrink-0 rounded-lg px-2.5 py-1 text-sm font-bold ${
          today ? "bg-aqua text-ink" : "text-ink/70"
        }`}
      >
        <span className="sr-only">, llega </span>
        {when}
      </span>
    </button>
  );
}
