import type { ProductFaq } from "@/types/product";

export default function Faq({ faqs }: { faqs: ProductFaq[] }) {
  if (faqs.length === 0) return null;

  return (
    <section id="preguntas" className="mx-auto max-w-3xl scroll-mt-16 px-4 py-12">
      <h2 className="text-2xl font-extrabold sm:text-3xl">Preguntas frecuentes</h2>
      <div className="mt-6 divide-y divide-ink/10 rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-bold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-bg text-aqua-dark transition group-open:rotate-45"
                aria-hidden
              >
                +
              </span>
            </summary>
            <p className="pb-4 text-ink/75">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
