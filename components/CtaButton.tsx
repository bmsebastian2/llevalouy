import { site } from "@/lib/site";

type Props = {
  label?: string;
  className?: string;
};

export default function CtaButton({ label = "Pedilo ahora", className = "" }: Props) {
  return (
    <a
      href={site.orderAnchor}
      className={`inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-aqua px-8 text-lg font-extrabold text-ink shadow-[0_6px_0_0_var(--aqua-dark)] transition active:translate-y-1 active:shadow-[0_2px_0_0_var(--aqua-dark)] ${className}`}
    >
      {label}
      <span aria-hidden>→</span>
    </a>
  );
}
