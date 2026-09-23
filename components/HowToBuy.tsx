const steps = [
  { icon: "🛒", title: "Pedís", text: "Completás tus datos en 30 segundos. No pagás nada ahora." },
  { icon: "💬", title: "Te confirmamos por WhatsApp", text: "Te escribimos para coordinar dirección y horario." },
  { icon: "💵", title: "Pagás al recibir", text: "Te llega a tu casa y pagás en efectivo al recibirlo." },
];

export default function HowToBuy() {
  return (
    <section id="como-comprar" className="scroll-mt-16 bg-white px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Comprar es así de fácil</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 md:flex-col">
              <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-aqua text-2xl">
                <span aria-hidden>{s.icon}</span>
                <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                  {i + 1}
                </span>
              </span>
              <div>
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-ink/70">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
