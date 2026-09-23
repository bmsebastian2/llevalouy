import type { ProductBenefit } from "@/types/product";

type Props = {
  benefits: ProductBenefit[];
  description?: string;
};

export default function Benefits({ benefits, description }: Props) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-extrabold sm:text-3xl">Por qué te va a encantar</h2>
      {description && <p className="mt-3 max-w-2xl text-ink/75">{description}</p>}
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b) => (
          <li key={b.text} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-bg text-2xl" aria-hidden>
              {b.icon}
            </span>
            <span className="font-medium leading-snug">{b.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
