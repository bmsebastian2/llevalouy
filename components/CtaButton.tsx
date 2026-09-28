import { site } from "@/lib/site";

type Props = {
  id?: string;
  label?: string;
  className?: string;
};

export default function CtaButton({ id, label = "Pedilo ahora", className = "" }: Props) {
  return (
    <a
      id={id}
      href={site.orderAnchor}
      className={`inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-aqua px-8 text-lg font-extrabold text-ink shadow-[0_6px_0_0_var(--aqua-dark)] outline-none transition focus-visible:ring-4 focus-visible:ring-aqua-dark/40 focus-visible:ring-offset-2 active:shadow-[0_2px_0_0_var(--aqua-dark)] ${className}`}
    >
      {label}
    </a>
  );
}
