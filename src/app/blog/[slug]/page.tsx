export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Markdown from "@/components/markdown/Markdown";
import { absUrl } from "@/lib/seo/site";

// ✅ IMPORTANTE: params es Promise en tu setup (sync dynamic APIs)
type PageProps = {
  params: Promise<{ slug: string }>;
};

// ✅ SEO dinámico + Canonical + OpenGraph + Robots correctos + SIN drafts
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) {
    return {
      title: "Post | Miko Jester",
      description: "Editorial",
      robots: { index: false, follow: false },
    };
  }

  // Selección mínima para metadata
  const bySlug = await prisma.post.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverUrl: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Compat: si el link viejo usa id, intentamos por id (sin revelar drafts)
  const post =
    bySlug ??
    (await prisma.post.findUnique({
      where: { id: slug },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverUrl: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    }));

  if (!post || !post.isPublished) {
    return {
      title: "Post | Miko Jester",
      description: "Editorial",
      robots: { index: false, follow: false },
    };
  }

  const canonical = absUrl(`/blog/${post.slug}`);
  const title = `${post.title} | Miko Jester`;
  const description = post.excerpt ?? "Editorial";
  const image = post.coverUrl ? absUrl(post.coverUrl) : absUrl("/og-default.jpg");

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      images: [{ url: image }],
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug: param } = await params;

  if (!param) return notFound();

  // 1) Primero por slug
  const bySlug = await prisma.post.findUnique({
    where: { slug: param },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      coverUrl: true,
      tags: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // 2) Compat: si el link viejo usa id
  const post =
    bySlug ??
    (await prisma.post.findUnique({
      where: { id: param },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        coverUrl: true,
        tags: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    }));

  if (!post) return notFound();

  // Canonical: si entraron por id -> redirige al slug real
  if (param === post.id) {
    redirect(`/blog/${post.slug}`);
  }

  // Front solo publicados
  if (!post.isPublished) return notFound();

  // ✅ JSON-LD (Structured Data)
  const url = absUrl(`/blog/${post.slug}`);
  const image = post.coverUrl ? absUrl(post.coverUrl) : absUrl("/og-default.jpg");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: url,
    url,
    image: [image],
    author: {
      "@type": "Person",
      name: "Miko Jester",
    },
    publisher: {
      "@type": "Organization",
      name: "Miko Jester",
    },
  } as const;

  const tags = post.tags ? post.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [];

  return (
    <main className="relative overflow-hidden bg-bg min-h-screen pt-28 pb-20">
      <div className="halftone absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-neon/8 blur-[120px]" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative mx-auto max-w-3xl px-6 space-y-8">
        <header className="space-y-4">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((t: string) => (
                <span key={t} className="rounded-full border border-neon/30 bg-neon/8 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-neon uppercase">
                  {t}
                </span>
              ))}
            </div>
          )}
          <h1 className="font-display text-5xl tracking-wide text-gold md:text-6xl">{post.title}</h1>
          {post.excerpt && <p className="text-cream/55 leading-7">{post.excerpt}</p>}
          <div className="text-xs text-cream/30">
            Actualizado: {new Date(post.updatedAt).toLocaleDateString("es-ES")}
          </div>
        </header>

        {post.coverUrl && (
          <div className="relative w-full overflow-hidden rounded-2xl comic-border">
            <div className="pt-[56.25%]" />
            <Image
              src={post.coverUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <article className="panel-card rounded-2xl p-8">
          <Markdown content={post.content} />
        </article>
      </div>
    </main>
  );
}
