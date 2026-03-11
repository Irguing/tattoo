import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestIdFromHeaders } from "@/lib/observability";
import { logError } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  const requestId = await getRequestIdFromHeaders();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        ok: true,
        db: "up",
        ts: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
        requestId,
      },
      { status: 200 }
    );
  } catch (error) {
    logError({
      scope: "api.health",
      msg: "DB health check failed",
      requestId,
      error,
    });

    return NextResponse.json(
      {
        ok: false,
        db: "down",
        ts: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
        requestId,
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : "DB_UNAVAILABLE",
      },
      { status: 503 }
    );
  }
}
