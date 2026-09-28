/** Cuando un producto no tiene foto: fondo neutro con el nombre, del mismo tamaño que la foto */
export default function NoPhoto({ name, className = "" }: { name: string; className?: string }) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-foto p-4 text-center ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="size-8 text-ink/40">
        <path d="M8.5 8V7a3.5 3.5 0 0 1 7 0v1" strokeLinecap="round" />
        <path d="M5 8h14l-1 11.5a2 2 0 0 1-2 1.5H8a2 2 0 0 1-2-1.5z" strokeLinejoin="round" />
      </svg>
      <span className="line-clamp-3 text-sm font-bold leading-snug text-ink/70">{name}</span>
    </div>
  );
}
