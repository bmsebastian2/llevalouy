import type { ProductReview } from "@/types/product";

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`text-amber-500 ${className}`} role="img" aria-label={`${rating} de 5 estrellas`}>
      {"★".repeat(rating)}
      <span className="text-ink/20">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// Clases completas para que Tailwind las detecte; con pocas reseñas no quedan columnas vacías.
const COLS: Record<number, string> = { 1: "max-w-xl", 2: "md:grid-cols-2" };

export default function Reviews({ reviews }: { reviews: ProductReview[] }) {
  if (reviews.length === 0) return null;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <h2 className="max-w-md text-2xl font-extrabold sm:text-3xl">Lo que dicen quienes ya lo tienen</h2>
        <p className="flex items-center gap-3">
          <span className="text-4xl font-extrabold tabular-nums leading-none">{avg.toFixed(1).replace(".", ",")}</span>
          <span className="text-sm leading-tight text-ink/60">
            <Stars rating={Math.round(avg)} className="block text-base" />
            {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
          </span>
        </p>
      </div>

      <ul className={`mt-6 grid gap-4 ${COLS[reviews.length] ?? "md:grid-cols-3"}`}>
        {reviews.map((r) => (
          <li key={r.name + r.city} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
            <div className="flex items-start justify-between gap-3">
              <Stars rating={r.rating} />
              <span className="-mt-2 font-serif text-5xl leading-none text-aqua" aria-hidden>
                ”
              </span>
            </div>
            <p className="mt-1 flex-1 text-lg leading-relaxed">{r.text}</p>
            <div className="mt-4 flex items-center gap-3 border-t border-dashed border-ink/10 pt-4">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-aqua/20 text-sm font-extrabold text-aqua-dark"
                aria-hidden
              >
                {initials(r.name)}
              </span>
              <p className="text-sm leading-tight">
                <span className="block font-bold">{r.name}</span>
                <span className="text-ink/60">📍 {r.city}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
