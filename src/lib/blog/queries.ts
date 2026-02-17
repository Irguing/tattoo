import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const PAGE_SIZE = 9;

function buildPostWhere(params: {
  q?: string;
  tag?: string;
}): Prisma.PostWhereInput {
  const q = params.q?.trim();
  const tag = params.tag?.trim();

  const where: Prisma.PostWhereInput = {
    isPublished: true,
  };

  if (tag) {
    where.tags = {
      contains: tag,
      mode: "insensitive",
    };
  }

  if (q) {
    where.OR = [
      {
        title: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        excerpt: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        tags: {
          contains: q,
          mode: "insensitive",
        },
      },
    ];
  }

  return where;
}

export async function getPublishedPostsPage(input: {
  q?: string;
  tag?: string;
  cursor?: string | null;
  take?: number;
}) {
  const take = input.take ?? PAGE_SIZE;

  const where = buildPostWhere({
    q: input.q,
    tag: input.tag,
  });

  const posts = await prisma.post.findMany({
    where,
    orderBy: [
      { createdAt: "desc" },
      { id: "desc" },
    ],
    take: take + 1,
    ...(input.cursor
      ? {
          cursor: { id: input.cursor },
          skip: 1,
        }
      : {}),
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverUrl: true,
      tags: true,
      createdAt: true,
    },
  });

  const hasMore = posts.length > take;
  const items = hasMore ? posts.slice(0, take) : posts;
  const nextCursor = hasMore
    ? items[items.length - 1]?.id ?? null
    : null;

  return { items, nextCursor };
}
