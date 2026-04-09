export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { About, SectionDivider } from "@/components/home/About";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { CTA } from "@/components/home/CTA";

const STYLES = [
  {
    label: "COLOR",
    desc:  "Paleta explosiva, trazos bold y personajes únicos. El sello de Miko.",
    image: "/uploads/tattoolobo-mlqogn93.jpeg",
    accent: "neon",
    href: "/designs",
  },
  {
    label: "BLACKWORK",
    desc:  "Geometría, mandalas y sólidos en negro puro. Elegancia atemporal.",
    image: "/uploads/tattoolink-mlr0t8w6.jpeg",
    accent: "cream",
    href: "/designs",
  },
  {
    label: "ANIME",
    desc:  "Personajes icónicos con el sello ilustrado de Miko. Full color o línea.",
    image: "/uploads/tattoolink-mlo4qmuf.jpeg",
    accent: "gold",
    href: "/designs",
  },
  {
    label: "NEO TRAD",
    desc:  "Animales, personajes y flores con línea gruesa y colores sólidos.",
    image: "/uploads/tattoolobo-mlo4qwyw.jpeg",
    accent: "rust",
    href: "/designs",
  },
];

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <StylesSection />
      <GalleryTeaser />
      <CTA />
    </>
  );
}

function StylesSection() {
  return (
    <section className="relative overflow-hidden bg-panel2 py-20">
      <div className="halftone absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[200px] w-[600px] rounded-full bg-neon/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionDivider label="ESTILOS" />

        <div className="mt-8 text-center">
          <h2 className="font-display leading-tight tracking-wide">
            <span className="block text-5xl text-cream md:text-6xl">¿QUÉ QUIERES</span>
            <span className="block text-5xl text-gold md:text-6xl">HACER?</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-cream/40">
            Cada estilo tiene su propia energía. Elige el tuyo o combínalos.
          </p>
        </div>

        {/* Style cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STYLES.map((s) => (
            <StyleCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

const ACCENT_CLASSES: Record<string, { label: string; hover: string; border: string }> = {
  neon:  { label: "text-neon",  hover: "hover:shadow-neon   hover:border-neon/40",  border: "border-neon/15"  },
  cream: { label: "text-cream", hover: "hover:shadow-[0_0_24px_rgba(242,232,178,0.2)] hover:border-cream/30", border: "border-cream/10" },
  gold:  { label: "text-gold",  hover: "hover:shadow-gold   hover:border-gold/40",  border: "border-gold/15"  },
  rust:  { label: "text-rust",  hover: "hover:shadow-[0_0_24px_rgba(200,62,46,0.35)] hover:border-rust/40", border: "border-rust/15"  },
};

function StyleCard({ label, desc, image, accent, href }: {
  label: string; desc: string; image: string; accent: string; href: string;
}) {
  const a = ACCENT_CLASSES[accent] ?? ACCENT_CLASSES.neon;

  return (
    <Link
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-panel comic-border transition-all duration-300 hover:-translate-y-1 ${a.border} ${a.hover}`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-panel2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={label}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />

        {/* Label tab — top */}
        <div className={`absolute left-3 top-3 rounded-full border bg-bg/80 px-3 py-1 text-[11px] font-bold tracking-[0.2em] backdrop-blur-sm ${a.label} ${a.border}`}>
          {label}
        </div>
      </div>

      {/* Bottom info — slides up on hover */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <p className={`font-display text-2xl tracking-wide ${a.label}`}>{label}</p>
        <p className="mt-1 text-xs text-cream/55 leading-snug">{desc}</p>
        <span className={`mt-2 inline-flex items-center gap-1 text-[11px] font-bold tracking-widest ${a.label}`}>
          VER TRABAJOS →
        </span>
      </div>
    </Link>
  );
}
