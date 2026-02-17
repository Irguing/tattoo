export type PostInput = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  tags?: string | null; // CSV: "nextjs, prisma"
  isPublished?: boolean;
  publishedAt?: string | null; // ISO (solo desde forms)
};

export function normalizeSlug(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeTags(raw?: string | null) {
  if (!raw) return null;
  const tags = raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return tags.length ? tags.join(", ") : null;
}

export function assertPostInput(input: Partial<PostInput>) {
  const title = (input.title ?? "").trim();
  const slug = (input.slug ?? "").trim();
  const content = (input.content ?? "").trim();

  if (!title) throw new Error("El título es obligatorio.");
  if (!slug) throw new Error("El slug es obligatorio.");
  if (!content) throw new Error("El contenido es obligatorio.");

  if (slug.length < 3) throw new Error("El slug debe tener al menos 3 caracteres.");
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("El slug solo puede contener a-z, 0-9 y guiones.");

  return {
    title,
    slug,
    excerpt: input.excerpt?.trim() || null,
    content,
    coverImage: input.coverImage?.trim() || null,
    tags: normalizeTags(input.tags),
    isPublished: Boolean(input.isPublished),
  };
}
