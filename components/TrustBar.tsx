const items = [
  { icon: "🚚", text: "Envío en el día" },
  { icon: "💵", text: "Pagás al recibir" },
  { icon: "✅", text: "Garantía" },
];

export default function TrustBar() {
  return (
    <section aria-label="Garantías de compra" className="mt-8 bg-aqua-dark text-white md:mt-0">
      <ul className="mx-auto grid max-w-5xl grid-cols-3 divide-x divide-white/20 px-2 py-4 text-center">
        {items.map((it) => (
          <li
            key={it.text}
            className="flex flex-col items-center gap-1 px-1 text-sm font-bold leading-tight sm:flex-row sm:justify-center sm:gap-2 sm:text-base"
          >
            <span className="text-2xl sm:text-xl" aria-hidden>
              {it.icon}
            </span>
            {it.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
