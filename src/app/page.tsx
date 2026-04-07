export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { CTA } from "@/components/home/CTA";

const STYLES = [
  {
    label: "NEW SCHOOL",
    desc: "El estilo que define el estudio. Colores vivos, líneas bold y personajes únicos.",
    image: "/uploads/tattoolobo-mlqogn93.jpeg",
    accent: "neon",
    href: "/designs",
  },
  {
    label: "BLACKWORK",
    desc: "Geometría, mandalas y sólidos en negro puro. Elegancia atemporal.",
    image: "/uploads/tattoolink-mlr0t8w6.jpeg",
    accent: "cream",
    href: "/designs",
  },
  {
    label: "REALISMO",
    desc: "Retratos, naturaleza y piezas de alto detalle. Arte en tu piel.",
    image: "/uploads/tattoolobo-mlo4qwyw.jpeg",
    accent: "gold",
    href: "/designs",
  },
  {
    label: "ANIME",
    desc: "Personajes icónicos con el sello ilustrado de Miko. Full color o línea.",
    image: "/uploads/tattoolink-mlo4qmuf.jpeg",
    accent: "purple",
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
    <section className="relative overflow-hidden bg-surface py-20">
      {/* Blur spot */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[300px] w-[800px] rounded-full bg-neon/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cream/15 to-transparent" />
          <span className="text-xs font-bold tracking-[0.4em] text-cream/30">ESTILOS</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cream/15 to-transparent" />
        </div>

        <div className="mb-10 text-center">
          <h2 className="font-display text-6xl tracking-wide text-cream">
            ¿QUÉ QUIERES
            <br />
            <span className="text-shimmer">HACER?</span>
          </h2>
          <p className="mt-3 text-cream/40 text-sm max-w-lg mx-auto">
            Ilustración, tatuajes o talleres creativos. Cada estilo tiene su propia energía.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STYLES.map((s) => (
            <StyleCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StyleCard({
  label,
  desc,
  image,
  accent,
  href,
}: {
  label: string;
  desc: string;
  image: string;
  accent: string;
  href: string;
}) {
  const accentClass: Record<string, string> = {
    neon:   "text-neon   border-neon/40   group-hover:shadow-neon",
    cream:  "text-cream  border-cream/30  group-hover:shadow-[0_0_24px_rgba(240,232,216,0.2)]",
    gold:   "text-gold   border-gold/40   group-hover:shadow-gold",
    purple: "text-purple border-purple/40 group-hover:shadow-purple",
  };

  const cls = accentClass[accent] ?? accentClass.neon;

  return (
    <Link
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-cream/8 bg-dark shadow-card transition-all duration-300 hover:-translate-y-1 ${cls}`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={label}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className={`font-display text-2xl tracking-wide ${cls.split(" ")[0]}`}>
          {label}
        </p>
        <p className="mt-1 text-xs text-cream/50 leading-relaxed line-clamp-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          {desc}
        </p>
        <span className={`mt-2 inline-flex items-center gap-1 text-xs font-bold tracking-widest opacity-0 transition-all duration-300 group-hover:opacity-100 ${cls.split(" ")[0]}`}>
          VER →
        </span>
      </div>
    </Link>
  );
}
