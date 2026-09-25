"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BARRIOS, deliveryAnswer, readBarrio, saveBarrio, type BarrioChoice } from "@/lib/delivery";
import { useNow } from "@/lib/use-now";

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

function choiceLabel(c: BarrioChoice) {
  return c.kind === "interior" ? "otro departamento" : c.name;
}

const focusRing = "outline-none focus-visible:ring-4 focus-visible:ring-aqua-dark/40";

/** "¿Llega hoy a tu barrio?": elegís el barrio y responde cuándo te llega. */
export default function BarrioCheck({ className = "" }: { className?: string }) {
  const [choice, setChoice] = useState<BarrioChoice | null>(null);
  // Sube con cada elección del usuario: el barrio que viene guardado se muestra sin animar
  const [answerKey, setAnswerKey] = useState(0);
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const listId = useId();
  // Se recalcula cada minuto: al pasar la hora de corte, "Hoy." cambia solo (sin animar)
  const now = useNow();

  useEffect(() => {
    setChoice(readBarrio());
  }, []);

  function open() {
    setQuery("");
    dialogRef.current?.showModal();
  }

  function choose(c: BarrioChoice) {
    setChoice(c);
    setAnswerKey((k) => k + 1);
    saveBarrio(c);
    dialogRef.current?.close();
  }

  const q = normalize(query);
  const matches = q ? BARRIOS.filter((b) => normalize(b.name).includes(q)) : BARRIOS;
  const typed = query.trim();
  const answer = choice ? deliveryAnswer(choice, now) : null;

  return (
    <section aria-labelledby={titleId} className={`rounded-3xl bg-white p-5 ring-1 ring-espuma sm:p-6 ${className}`}>
      <h2 id={titleId} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-2xl font-bold leading-tight">
        ¿Llega hoy a
        {/* El "?" va pegado al barrio para que nunca quede solo en otra línea */}
        <span className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={open}
            aria-haspopup="dialog"
            className={`inline-flex min-h-12 items-center gap-2 rounded-xl bg-bg px-3 font-extrabold ring-1 ring-espuma transition-colors hover:ring-aqua-dark ${focusRing}`}
          >
            {choice ? choiceLabel(choice) : "tu barrio"}
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 text-aqua-dark">
              <path d="m5 8 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          ?
        </span>
      </h2>

      <div aria-live="polite" className="mt-4 min-h-28">
        {answer ? (
          <div key={answerKey} className={answerKey > 0 ? "answer-animate" : undefined}>
            <p className="answer-word text-[3.5rem] font-extrabold leading-none tracking-tight sm:text-7xl">
              <span className={answer.today ? "answer-mark" : undefined}>{answer.headline}</span>
            </p>
            <p className="answer-line mt-3 text-lg leading-snug">{answer.sentence}</p>
          </div>
        ) : (
          <p className="pt-2 text-lg leading-snug text-ink/70">Elegí tu barrio y te decimos cuándo te llega.</p>
        )}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${titleId}-dialog`}
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="mx-0 mb-0 mt-auto max-h-[85dvh] w-full max-w-none rounded-t-3xl bg-white p-0 text-ink md:m-auto md:max-w-md md:rounded-3xl"
      >
        <div className="flex max-h-[85dvh] flex-col">
          <div className="flex items-center justify-between gap-3 px-5 pb-2 pt-4">
            <p id={`${titleId}-dialog`} className="text-xl font-extrabold">
              ¿En qué barrio estás?
            </p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className={`-mr-2 grid size-12 place-items-center rounded-full hover:bg-bg ${focusRing}`}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5">
                <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="sr-only">Cerrar</span>
            </button>
          </div>

          <div className="px-5 pb-3">
            <label className="sr-only" htmlFor={`${listId}-search`}>
              Buscá tu barrio
            </label>
            <input
              ref={searchRef}
              id={`${listId}-search`}
              type="search"
              autoFocus
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
              className="block h-12 w-full rounded-xl border border-ink/15 bg-bg/60 px-4 text-base outline-none placeholder:text-ink/45 focus:border-aqua-dark focus:bg-white focus:ring-2 focus:ring-aqua-dark/30"
            />
          </div>

          <ul id={listId} className="overflow-y-auto overscroll-contain px-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {matches.map((b) => (
              <li key={b.name}>
                <BarrioOption
                  selected={choice?.kind === "barrio" && choice.name === b.name}
                  onClick={() => choose({ kind: "barrio", name: b.name })}
                >
                  {b.name}
                </BarrioOption>
              </li>
            ))}
            {typed && matches.length === 0 && (
              <li>
                <BarrioOption onClick={() => choose({ kind: "otro", name: typed })}>
                  Mi barrio es {typed}
                </BarrioOption>
              </li>
            )}
            {!typed && (
              <li>
                <BarrioOption onClick={() => searchRef.current?.focus()} muted>
                  Otro barrio… <span className="font-normal text-ink/65">escribilo arriba</span>
                </BarrioOption>
              </li>
            )}
            <li className="mt-1 border-t border-espuma pt-1">
              <BarrioOption selected={choice?.kind === "interior"} onClick={() => choose({ kind: "interior" })} muted>
                Estoy fuera de Montevideo
              </BarrioOption>
            </li>
          </ul>
        </div>
      </dialog>
    </section>
  );
}

function BarrioOption({
  children,
  onClick,
  selected = false,
  muted = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  selected?: boolean;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected || undefined}
      className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-xl px-3 text-left text-lg hover:bg-bg ${
        muted ? "font-medium" : "font-bold"
      } ${focusRing}`}
    >
      <span>{children}</span>
      {selected && (
        <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 shrink-0 text-aqua-dark">
          <path d="m4.5 10.5 3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
