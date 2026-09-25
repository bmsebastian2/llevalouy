const steps = [
  { title: "Pedís", text: "Completás tus datos en 30 segundos. No pagás nada ahora." },
  { title: "Te escribimos por WhatsApp", text: "Coordinamos la dirección y el horario que te quede cómodo." },
  {
    title: "Te lo llevamos",
    text: "Pagás en efectivo o por transferencia cuando te llega. Si preferís, también con Mercado Pago.",
  },
];

/**
 * Es una secuencia real, así que va numerada: números grandes y angostos unidos por un trazo
 * de 1,5px, el mismo de la Rambla y los íconos de confianza.
 */
export default function HowToBuy() {
  return (
    <section id="como-comprar" className="scroll-mt-16 bg-white px-4 py-14 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="display text-[1.75rem] font-extrabold leading-tight sm:text-4xl">Cómo comprar</h2>
        <p className="mt-2 text-lg text-ink/75">Tres pasos, y en ninguno pagás por adelantado.</p>

        <ol className="mt-10 grid md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => {
            const last = i === steps.length - 1;
            return (
              <li key={s.title} className="relative grid grid-cols-[3rem_1fr] gap-x-4 pb-9 last:pb-0 md:block md:pb-0">
                <span
                  aria-hidden
                  className="text-[3.5rem] font-extrabold leading-[0.8] tabular-nums text-aqua-dark [font-stretch:75%]"
                >
                  {i + 1}
                </span>
                {!last && (
                  <>
                    {/* Celular: el trazo baja hasta el número siguiente */}
                    <span aria-hidden className="absolute bottom-3 left-[0.75rem] top-14 w-[1.5px] bg-aqua-dark/50 md:hidden" />
                    {/* Compu: el trazo sigue hacia el paso de la derecha */}
                    <span
                      aria-hidden
                      className="absolute left-12 right-[-1rem] top-[1.3rem] hidden h-[1.5px] bg-aqua-dark/50 md:block"
                    />
                  </>
                )}
                <div className="md:mt-5">
                  <h3 className="text-xl font-bold leading-snug">{s.title}</h3>
                  <p className="mt-1 max-w-xs text-ink/75">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
