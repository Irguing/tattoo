import Link from "next/link";
import { prisma } from "@/lib/prisma";
import GalleryTeaserClient from "@/components/home/GalleryTeaser.client";

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
    <section className="relative overflow-hidden bg-dark py-20">
      {/* Blur spots */}
      <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-neon/8 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple/8 blur-[80px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Divider */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cream/15 to-transparent" />
          <span className="text-xs font-bold tracking-[0.4em] text-cream/30">TRABAJOS</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cream/15 to-transparent" />
        </div>

        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-6xl tracking-wide text-cream">GALERÍA</h2>
            <p className="mt-2 text-cream/50 max-w-xl text-sm">
              Explora una selección de mis tatuajes. Desde piezas pequeñas hasta trabajos a medida.
            </p>
          </div>
          <Link
            href="/designs"
            className="hidden md:inline-flex rounded-full border border-neon/40 bg-neon/10 px-5 py-2.5 text-xs font-bold tracking-widest text-neon transition hover:bg-neon hover:text-dark"
          >
            VER TODOS →
          </Link>
        </div>

        <GalleryTeaserClient images={images} />

        <Link
          href="/designs"
          className="mt-8 inline-flex md:hidden rounded-full border border-neon/40 bg-neon/10 px-5 py-2.5 text-xs font-bold tracking-widest text-neon transition hover:bg-neon hover:text-dark"
        >
          VER TODOS →
        </Link>
      </div>
    </section>
  );
}
