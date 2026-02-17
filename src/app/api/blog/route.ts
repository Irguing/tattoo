import { NextResponse } from "next/server";
import { getPublishedPostsPage } from "@/lib/blog/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const cursor = searchParams.get("cursor");

  const page = await getPublishedPostsPage({ q, tag, cursor });

  return NextResponse.json(
    {
      items: page.items.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
      })),
      nextCursor: page.nextCursor,
    },
    { status: 200 }
  );
}
