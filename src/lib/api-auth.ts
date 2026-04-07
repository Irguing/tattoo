import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";

type AdminUser = { id: string; email: string; createdAt: Date };
type RequireAdminResult = AdminUser | NextResponse;

export async function requireAdmin(): Promise<RequireAdminResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return admin;
}

export function isUnauthorized(
  result: RequireAdminResult
): result is NextResponse {
  return result instanceof NextResponse;
}
