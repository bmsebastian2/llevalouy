import type { ProductReview } from "@/types/product";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500" role="img" aria-label={`${rating} de 5 estrellas`}>
      {"★".repeat(rating)}
      <span className="text-ink/20">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function Reviews({ reviews }: { reviews: ProductReview[] }) {
  if (reviews.length === 0) return null;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-extrabold sm:text-3xl">Lo que dicen quienes ya lo tienen</h2>
      <p className="mt-2 flex items-center gap-2 text-ink/70">
        <Stars rating={Math.round(avg)} />
        <span>
          {avg.toFixed(1).replace(".", ",")} de 5 · {reviews.length} reseñas
        </span>
      </p>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {reviews.map((r) => (
          <li key={r.name + r.city} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
            <Stars rating={r.rating} />
            <p className="mt-2 leading-relaxed">“{r.text}”</p>
            <p className="mt-3 text-sm font-bold">
              {r.name} <span className="font-normal text-ink/60">· {r.city}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
