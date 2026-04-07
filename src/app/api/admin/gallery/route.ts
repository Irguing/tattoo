import { NextResponse } from "next/server";
import { requireAdmin, isUnauthorized } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;
  return NextResponse.json({ ok: true, route: "/api/admin/gallery" });
}
