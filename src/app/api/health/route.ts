import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // asegura Prisma en Node runtime
export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  try {
    // Ping DB (ligero)
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        ok: true,
        db: "up",
        ts: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        db: "down",
        ts: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
        // No exponemos detalles internos en prod
        error: process.env.NODE_ENV === "development"
          ? (err instanceof Error ? err.message : String(err))
          : "DB_UNAVAILABLE",
      },
      { status: 503 }
    );
  }
}
