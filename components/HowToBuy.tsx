const steps = [
  { icon: "🛒", title: "Pedís", text: "Completás tus datos en 30 segundos. No pagás nada ahora." },
  { icon: "💬", title: "Te confirmamos por WhatsApp", text: "Te escribimos para coordinar dirección y horario." },
  {
    icon: "📦",
    title: "Te llega a tu casa",
    text: "Pagás en efectivo al recibir, o si preferís, por transferencia o Mercado Pago.",
  },
];

/** El mismo recorrido de paradas que usa el formulario de pedido. */
export default function HowToBuy() {
  return (
    <section id="como-comprar" className="scroll-mt-16 bg-white px-4 py-14">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Comprar es así de fácil</h2>
        <ol className="mt-8 grid md:grid-cols-3 md:gap-6">
          {steps.map((s, i) => {
            const last = i === steps.length - 1;
            return (
              <li key={s.title} className="relative flex gap-4 pb-8 last:pb-0 md:flex-col md:pb-0">
                {!last && (
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-7 top-16 border-l-2 border-dashed border-aqua-dark/40 md:left-16 md:right-[-1.5rem] md:top-7 md:bottom-auto md:border-l-0 md:border-t-2"
                  />
                )}
                <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-aqua text-2xl ring-8 ring-white">
                  <span aria-hidden>{s.icon}</span>
                </span>
                <div className="pt-1 md:pt-0">
                  <p className="text-sm font-bold text-aqua-dark">Paso {i + 1}</p>
                  <h3 className="text-lg font-bold leading-snug">{s.title}</h3>
                  <p className="mt-1 text-ink/70">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
