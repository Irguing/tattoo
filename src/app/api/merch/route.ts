import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isUnauthorized } from "@/lib/api-auth";

// GET — público, solo productos publicados
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category")?.trim() || undefined;

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      price: true,
      imageUrl: true,
      category: true,
      stock: true,
      createdAt: true,
    },
  });

  return NextResponse.json(products);
}

// POST — solo admin
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await req.json();

    if (!body.slug || !body.name || typeof body.price !== "number") {
      return NextResponse.json(
        { error: "slug, name y price son requeridos" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        slug: body.slug,
        name: body.name,
        description: body.description ?? null,
        price: Math.round(body.price),
        imageUrl: body.imageUrl ?? null,
        imageFilename: body.imageFilename ?? null,
        category: body.category ?? "general",
        stock: body.stock ?? 0,
        isPublished: body.isPublished ?? false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "P2002") {
      return NextResponse.json({ error: "El slug ya existe" }, { status: 409 });
    }
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
