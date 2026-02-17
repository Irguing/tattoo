import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      title?: string;
      alt?: string;
      tags?: string;
      url?: string;
      filename?: string;
      mime?: string;
      size?: number;
      isPublished?: boolean;
    };

    const title = (body.title ?? "").trim();
    const url = (body.url ?? "").trim();
    const filename = (body.filename ?? "").trim();
    const mime = (body.mime ?? "").trim();
    const size = Number(body.size ?? 0);

    if (!title || !url || !filename || !mime || !Number.isFinite(size) || size <= 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const created = await prisma.galleryImage.create({
      data: {
        title,
        alt: body.alt?.trim() || null,
        tags: body.tags?.trim() || null,
        url,
        filename,
        mime,
        size,
        isPublished: body.isPublished ?? true,
      },
    });

    return NextResponse.json({ image: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create image" }, { status: 500 });
  }
}
