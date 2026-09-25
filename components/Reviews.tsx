import type { ProductReview } from "@/types/product";

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`tracking-wider text-aqua-dark ${className}`} role="img" aria-label={`${rating} de 5 estrellas`}>
      {"★".repeat(rating)}
      <span className="text-ink/20">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

/** Firma de la reseña: "Lucía, Malvín". `city` guarda el barrio. */
function Signature({ review }: { review: ProductReview }) {
  return (
    <p className="mt-3 text-sm">
      <span className="font-bold">{review.name}</span>
      <span className="text-ink/65">, {review.city}</span>
    </p>
  );
}

export default function Reviews({ reviews }: { reviews: ProductReview[] }) {
  if (reviews.length === 0) return null;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const [first, ...rest] = reviews;

  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <h2 className="display max-w-md text-[1.75rem] font-extrabold leading-tight sm:text-4xl">
          Lo que dicen quienes ya lo tienen
        </h2>
        <p className="flex items-center gap-3">
          <span className="text-4xl font-extrabold tabular-nums leading-none">{avg.toFixed(1).replace(".", ",")}</span>
          <span className="text-sm leading-tight text-ink/65">
            <Stars rating={Math.round(avg)} className="block text-base" />
            {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
          </span>
        </p>
      </div>

      {/* La primera reseña grande; el resto, en una columna más chica */}
      <div className={`mt-8 grid gap-8 ${rest.length > 0 ? "md:grid-cols-[3fr_2fr] md:gap-12" : ""}`}>
        <figure>
          <Stars rating={first.rating} />
          <blockquote className="mt-2 text-2xl font-medium leading-snug sm:text-[1.75rem]">“{first.text}”</blockquote>
          <figcaption>
            <Signature review={first} />
          </figcaption>
        </figure>

        {rest.length > 0 && (
          <ul className="divide-y divide-espuma border-t border-espuma md:border-t-0">
            {rest.map((r) => (
              <li key={r.name + r.city} className="py-5 md:first:pt-0">
                <figure>
                  <Stars rating={r.rating} className="text-sm" />
                  <blockquote className="mt-1 text-lg leading-relaxed">“{r.text}”</blockquote>
                  <figcaption>
                    <Signature review={r} />
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
