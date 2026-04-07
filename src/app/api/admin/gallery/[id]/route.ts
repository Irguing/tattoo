import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isUnauthorized } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await params;
  return NextResponse.json({ ok: true, route: "/api/admin/gallery/[id]", id });
}
