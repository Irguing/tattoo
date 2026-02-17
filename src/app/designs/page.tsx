import { prisma } from "@/lib/prisma";
import DesignsGalleryClient from "../../components/designs/DesignsGallery.client";

export const dynamic = "force-dynamic";

type ImageItem = {
  id: string;
  title: string;
  alt: string | null;
  url: string;
  tags: string | null;
};

function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { tag?: string; q?: string };
}) {
  const activeTag = (searchParams?.tag ?? "").trim();
  const q = (searchParams?.q ?? "").trim();

  const rows = await prisma.galleryImage.findMany({
    where: {
      isPublished: true,
      AND: [
        activeTag ? { tags: { contains: activeTag } } : {},
        q
          ? {
              OR: [{ title: { contains: q } }, { tags: { contains: q } }],
            }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      alt: true,
      url: true,
      tags: true,
    },
  });

  // ✅ normalizamos null → string para cumplir ImageItem
  const images: ImageItem[] = rows.map((img) => ({
    id: img.id,
    title: img.title ?? "",
    alt: img.alt,
    url: img.url,
    tags: img.tags,
  }));

  // tags list (solo publicados)
  const all = await prisma.galleryImage.findMany({
    where: { isPublished: true },
    select: { tags: true },
  });

  const tagSet = new Set<string>();
  for (const row of all) {
    for (const t of parseTags(row.tags)) tagSet.add(t);
  }
  const tags = Array.from(tagSet).sort((a, b) => a.localeCompare(b, "es"));

  return (
    <main className="bg-sand py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8">
          <h1 className="font-display text-5xl tracking-wide text-green900">Galería</h1>
          <p className="mt-2 max-w-2xl text-ink/70">
            Explora flash y trabajos publicados. Filtra por tags.
          </p>
        </div>

        <DesignsGalleryClient images={images} tags={tags} activeTag={activeTag} initialQ={q} />
      </div>
    </main>
  );
}
