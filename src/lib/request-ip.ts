import type { NextRequest } from "next/server";

export function getClientIp(req: NextRequest): string {
  // Proxies comunes: x-forwarded-for puede venir como lista "ip, ip, ip"
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}
