import { prisma } from "@/lib/prisma";

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function uniqueLowerPreserve(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of tags) {
    const key = t.toLowerCase();
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

export async function getPublishedTags(limit = 24): Promise<string[]> {
  const rows = await prisma.post.findMany({
    where: { isPublished: true, tags: { not: null } },
    select: { tags: true },
    orderBy: { createdAt: "desc" },
  });

  const all = rows.flatMap((r) => parseTags(r.tags));
  const uniq = uniqueLowerPreserve(all);

  return uniq.slice(0, limit);
}
    