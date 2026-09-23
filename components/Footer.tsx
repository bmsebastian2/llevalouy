import Image from "next/image";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-ink px-4 py-10 text-white/80">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
        <div className="rounded-xl bg-white px-3 py-2">
          <Image src="/brand/logo-horizontal.svg" alt="Llevalo UY" width={116} height={30} />
        </div>
        <ul className="flex flex-col gap-2 text-sm md:flex-row md:gap-6">
          <li>
            <a
              href={`https://instagram.com/${site.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-aqua"
            >
              📸 Instagram @{site.instagram}
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`} className="hover:text-aqua">
              ✉️ {site.email}
            </a>
          </li>
        </ul>
        <p className="text-xs text-white/50">© {new Date().getFullYear()} Llevalo UY · Uruguay</p>
      </div>
    </footer>
  );
}
