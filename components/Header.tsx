import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/5 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-center px-4 md:justify-start">
        <Link href="/" aria-label="Llevalo UY — inicio">
          <Image src="/brand/logo-horizontal.svg" alt="Llevalo UY" width={139} height={36} loading="eager" />
        </Link>
      </div>
    </header>
  );
}
