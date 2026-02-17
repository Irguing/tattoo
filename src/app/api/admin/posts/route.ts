import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const created = await prisma.post.create({
      data: {
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt ?? null,
        content: body.content,
        coverUrl: body.coverUrl ?? null,
        tags: body.tags ?? null,
        isPublished: body.isPublished ?? false,
      },
    });

    return NextResponse.json(created);
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
