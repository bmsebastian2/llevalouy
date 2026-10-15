import { getImageProps } from "next/image";
import { Reenie_Beanie } from "next/font/google";

/** Frase manuscrita sobre la foto. Apagada: hero-hogar.png ya trae "Pequeños productos, grandes soluciones" */
const SHOW_HANDWRITTEN = false;

// Sin preload: el archivo de la fuente solo se pide si la frase se muestra, y eso pasa solo en compu
const handwriting = Reenie_Beanie({ weight: "400", subsets: ["latin"], display: "swap", preload: false });

/** "/brand/hero-hogar.png" o "" si el archivo no está (lo resuelve next.config al compilar) */
const SRC = process.env.HERO_IMAGE;

/** 1×1 transparente: debajo de 1024px el <picture> no tiene fuente y la foto no se descarga */
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/**
 * Foto ambiental del hero, solo desde 1024px: a la derecha del titular, de alto igual al titular y el subtítulo.
 * La caja tiene la proporción de la foto (2072×759): se ve entera, sin recortar los productos de la derecha,
 * y se funde con el fondo hacia los costados y hacia abajo (.hero-photo en globals.css). Sin archivo, no se muestra nada.
 * Termina donde termina el contenido de la página (debajo del botón de Consultas), no en el borde de la pantalla.
 */
export default function HeroPhoto() {
  if (!SRC) return null;

  const {
    props: { srcSet, sizes, ...img },
  } = getImageProps({ src: SRC, alt: "", fill: true, sizes: "42rem" });

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
      {/* right-6: el mismo margen interno del contenedor de página desde 640px */}
      <div className="page-container relative h-full">
        <div className="hero-photo absolute inset-y-0 right-6 aspect-[2072/759]">
          <picture>
            <source media="(min-width: 1024px)" srcSet={srcSet} sizes={sizes} />
            <img {...img} src={BLANK} alt="" loading="eager" fetchPriority="high" className="object-cover" />
          </picture>
          {SHOW_HANDWRITTEN && (
            <p
              className={`${handwriting.className} absolute right-[8%] top-[18%] -rotate-8 text-center text-[2.5rem] leading-[0.95] text-ink`}
            >
              Pequeños productos,
              <br />
              grandes soluciones
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
