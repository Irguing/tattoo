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
    <section className="py-16 bg-green900 text-sand">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-5xl tracking-wide">Galería</h2>
            <p className="mt-2 text-sand/80 max-w-2xl">
              Explora una selección de mis tatuajes. Desde piezas pequeñas hasta trabajos a medida.
            </p>
          </div>

          <Link
            href="/designs"
            className="hidden md:inline-flex rounded-xl bg-neon px-5 py-3 font-semibold text-ink hover:opacity-90"
          >
            Ver todos →
          </Link>
        </div>

        <GalleryTeaserClient images={images} />

        <Link
          href="/designs"
          className="mt-8 inline-flex md:hidden rounded-xl bg-neon px-5 py-3 font-semibold text-ink hover:opacity-90"
        >
          Ver todos →
        </Link>
      </div>
    </section>
  );
}
