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

  // ✅ Serializamos Date -> string (props client-safe)
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
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10">
        <p className="text-sm text-neutral-500">Editorial</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
          Blog
        </h1>
        <p className="mt-3 max-w-2xl text-neutral-600">
          Ideas, flashes y procesos. Filtra por tags o busca por palabras clave.
        </p>
      </header>

     <BlogFeedClient
  key={`blog:${q}|${tag}`}
  initialItems={initialItems}
  initialNextCursor={page.nextCursor}
  initialQuery={{ q, tag }}
  allTags={allTags}
/>


    </main>
  );
}
