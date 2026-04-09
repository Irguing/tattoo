import { prisma } from "@/lib/prisma";
import DesignsGalleryClient from "../../components/designs/DesignsGallery.client";

export const dynamic = "force-dynamic";

type ImageItem = { id: string; title: string; alt: string | null; url: string; tags: string | null };

function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

export default async function Page({ searchParams }: { searchParams?: { tag?: string; q?: string } }) {
  const activeTag = (searchParams?.tag ?? "").trim();
  const q = (searchParams?.q ?? "").trim();

  const rows = await prisma.galleryImage.findMany({
    where: {
      isPublished: true,
      AND: [
        activeTag ? { tags: { contains: activeTag } } : {},
        q ? { OR: [{ title: { contains: q } }, { tags: { contains: q } }] } : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, alt: true, url: true, tags: true },
  });

  const images: ImageItem[] = rows.map((img) => ({
    id: img.id, title: img.title ?? "", alt: img.alt, url: img.url, tags: img.tags,
  }));

  const all = await prisma.galleryImage.findMany({
    where: { isPublished: true }, select: { tags: true },
  });
  const tagSet = new Set<string>();
  for (const row of all) for (const t of parseTags(row.tags)) tagSet.add(t);
  const tags = Array.from(tagSet).sort((a, b) => a.localeCompare(b, "es"));

  return (
    <main className="relative overflow-hidden bg-bg min-h-screen pt-28 pb-20">
      <div className="halftone absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-neon/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gold/6 blur-[80px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/25 bg-neon/8 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
            <span className="text-xs font-bold tracking-[0.25em] text-neon">GALERÍA · FLASH · CUSTOM</span>
          </span>
          <h1 className="mt-4 font-display text-6xl tracking-wide text-gold md:text-7xl">TATUAJES</h1>
          <p className="mt-2 max-w-xl text-sm text-cream/50">
            Explora flash y trabajos publicados. Filtra por estilos.
          </p>
        </div>

        <DesignsGalleryClient images={images} tags={tags} activeTag={activeTag} initialQ={q} />
      </div>
    </main>
  );
}
