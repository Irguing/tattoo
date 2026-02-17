import "server-only";
import { prisma } from "@/lib/prisma";
import {
  getAllPosts as getFilePosts,
  getPostBySlug as getFilePostBySlug,
} from "@/lib/blog";

export type UnifiedPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverUrl: string | null;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt?: Date;
};

// Lo que suele devolver el file-based (ajústalo si tu lib/blog difiere)
type FileBlogPost = {
  slug: string;
  content: string;
  frontmatter: {
    title?: string;
    excerpt?: string;
    tags?: string[] | string;
    date?: string;
    coverUrl?: string;
    cover?: string;
  };
};

function splitTags(tags: string | null | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function normalizeTags(input: FileBlogPost["frontmatter"]["tags"]): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((t) => String(t).trim()).filter(Boolean);
  if (typeof input === "string") return splitTags(input);
  return [];
}

async function hasDbPosts() {
  const count = await prisma.post.count();
  return count > 0;
}

export async function getAllPostsUnified(): Promise<UnifiedPost[]> {
  if (await hasDbPosts()) {
    const rows = await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      select: {
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

    return rows.map((p: (typeof rows)[number]) => ({

      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverUrl: p.coverUrl,
      tags: splitTags(p.tags),
      isPublished: p.isPublished,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  // Fallback file-based
  const filePosts = (await getFilePosts()) as unknown as FileBlogPost[];

  return filePosts.map((p: FileBlogPost) => {
    const fm = p.frontmatter ?? {};

    const title = (fm.title ?? p.slug).toString();
    const excerpt = fm.excerpt ? fm.excerpt.toString() : null;

    const coverUrl =
      (fm.coverUrl ?? fm.cover)?.toString() ?? null;

    const createdAt = fm.date ? new Date(fm.date) : new Date(0);

    return {
      slug: p.slug,
      title,
      excerpt,
      content: p.content,
      coverUrl,
      tags: normalizeTags(fm.tags),
      isPublished: true,
      createdAt,
    };
  });
}

export async function getPostBySlugUnified(slug: string): Promise<UnifiedPost | null> {
  if (await hasDbPosts()) {
    const p = await prisma.post.findFirst({
      where: { slug, isPublished: true },
      select: {
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

    if (!p) return null;

    return {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverUrl: p.coverUrl,
      tags: splitTags(p.tags),
      isPublished: p.isPublished,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }

  const fp = (await getFilePostBySlug(slug)) as unknown as FileBlogPost | null;
  if (!fp) return null;

  const fm = fp.frontmatter ?? {};
  const title = (fm.title ?? fp.slug).toString();
  const excerpt = fm.excerpt ? fm.excerpt.toString() : null;

  const coverUrl =
    (fm.coverUrl ?? fm.cover)?.toString() ?? null;

  const createdAt = fm.date ? new Date(fm.date) : new Date(0);

  return {
    slug: fp.slug,
    title,
    excerpt,
    content: fp.content,
    coverUrl,
    tags: normalizeTags(fm.tags),
    isPublished: true,
    createdAt,
  };
}
