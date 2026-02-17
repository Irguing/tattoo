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

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">{post.title}</h1>
        {post.excerpt && <p className="text-neutral-600 leading-7">{post.excerpt}</p>}
        <div className="text-sm text-neutral-500">
          Actualizado: {new Date(post.updatedAt).toLocaleDateString("es-ES")}
        </div>
      </header>

      {post.coverUrl && (
        <div className="relative w-full overflow-hidden rounded-xl border">
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

      <article>
        <Markdown content={post.content} />
      </article>
    </main>
  );
}
