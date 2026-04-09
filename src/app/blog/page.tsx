import type { Metadata } from "next";
import BlogFeedClient from "@/components/blog/BlogFeed.client";
import { getPublishedPostsPage } from "@/lib/blog/queries";
import { getPublishedTags } from "@/lib/blog/tags";

export const metadata: Metadata = {
  title: "Blog | Miko Jester",
  description: "Editorial: flashes, procesos y piezas destacadas.",
};

type BlogSearchParams = {
  tag?: string | string[];
  q?: string | string[];
  cursor?: string | string[];
};

function normalizeSearchParam(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return "";
}

type Props = {
  searchParams: Promise<BlogSearchParams>;
};

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;

  const tag = normalizeSearchParam(sp.tag).trim();
  const q = normalizeSearchParam(sp.q).trim();
  const cursorRaw = normalizeSearchParam(sp.cursor).trim();
  const cursor = cursorRaw ? cursorRaw : null;

  const page = await getPublishedPostsPage({ q, tag, cursor });

  const initialItems = page.items.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverUrl: p.coverUrl,
    tags: p.tags,
    createdAt: p.createdAt.toISOString(),
  }));

  const allTags = await getPublishedTags(24);

  return (
    <main className="relative overflow-hidden bg-bg min-h-screen pt-28 pb-20">
      <div className="halftone absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-neon/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gold/6 blur-[80px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/25 bg-neon/8 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
            <span className="text-xs font-bold tracking-[0.25em] text-neon">EDITORIAL · PROCESOS · FLASHES</span>
          </span>
          <h1 className="mt-4 font-display text-6xl tracking-wide text-gold md:text-7xl">BLOG</h1>
          <p className="mt-2 max-w-xl text-sm text-cream/50">
            Ideas, flashes y procesos. Filtra por tags o busca por palabras clave.
          </p>
        </div>

        <BlogFeedClient
          key={`blog:${q}|${tag}`}
          initialItems={initialItems}
          initialNextCursor={page.nextCursor}
          initialQuery={{ q, tag }}
          allTags={allTags}
        />
      </div>
    </main>
  );
}
