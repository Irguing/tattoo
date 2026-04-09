import Link from "next/link";
import { prisma } from "@/lib/prisma";
import GalleryTeaserClient from "@/components/home/GalleryTeaser.client";
import { SectionDivider } from "@/components/home/About";

export const dynamic = "force-dynamic";

type RawTeaserImage = {
  id: string;
  title: string | null;
  alt: string | null;
  url: string;
  tags: string | null;
};

type TeaserImage = {
  id: string;
  title: string;
  alt: string | null;
  url: string;
  tags: string | null;
};

export async function GalleryTeaser() {
  const rawImages: RawTeaserImage[] = await prisma.galleryImage.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      id: true,
      title: true,
      alt: true,
      url: true,
      tags: true,
    },
  });

  // ✅ Normalización segura aquí
  const images: TeaserImage[] = rawImages.map((img) => ({
    ...img,
    title: img.title ?? "Untitled",
  }));

  return (
    <section className="relative overflow-hidden bg-bg py-20">
      <div className="halftone absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-neon/8 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionDivider label="TRABAJOS" />

        <div className="mt-8 flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-6xl tracking-wide text-gold">GALERÍA</h2>
            <p className="mt-2 text-cream/50 max-w-xl text-sm">
              Explora una selección de mis tatuajes. Desde piezas pequeñas hasta trabajos a medida.
            </p>
          </div>
          <Link
            href="/designs"
            className="hidden md:inline-flex rounded-full border border-neon/30 bg-neon/8 px-5 py-2.5 text-xs font-bold tracking-[0.2em] text-neon transition hover:bg-neon hover:text-bg"
          >
            VER TODOS →
          </Link>
        </div>

        <GalleryTeaserClient images={images} />

        <Link
          href="/designs"
          className="mt-8 inline-flex md:hidden rounded-full border border-neon/30 bg-neon/8 px-5 py-2.5 text-xs font-bold tracking-[0.2em] text-neon transition hover:bg-neon hover:text-bg"
        >
          VER TODOS →
        </Link>
      </div>
    </section>
  );
}
