import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "../../../../lib/prisma";
import { getCurrentAdmin } from "../../../../lib/auth";
import { getClientIp } from "../../../../lib/request-ip";
import { rateLimitFixedWindow } from "../../../../lib/rate-limit";
import { log } from "../../../../lib/logger";

type Status = "pending" | "confirmed" | "rejected";

function isStatus(v: unknown): v is Status {
  return v === "pending" || v === "confirmed" || v === "rejected";
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);

  // Solo admin
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit (admin actions): 60 cambios / minuto por IP
  const rl = rateLimitFixedWindow({
    key: `bookings_patch:${ip}`,
    limit: 60,
    windowSec: 60,
  });

  if (!rl.ok) {
    log({
      level: "warn",
      msg: "Rate limit exceeded",
      scope: "api:bookings:[id]:PATCH",
      data: { ip, adminId: admin.id, retryAfterSec: rl.retryAfterSec },
    });

    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  try {
    const { id } = await ctx.params;

    const body = (await req.json()) as { status?: unknown };
    const status = body.status;

    if (!isStatus(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Update + 404 correcto si no existe
    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/bookings");
    revalidatePath("/book");

    log({
      level: "info",
      msg: "Booking status updated",
      scope: "api:bookings:[id]:PATCH",
      data: { ip, adminId: admin.id, bookingId: id, status },
    });

    return NextResponse.json({ booking: updated });
  } catch (err) {
    // Prisma: record not found => 404 (P2025)
    const message = err instanceof Error ? err.message : "unknown_error";
    const isNotFound =
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: unknown }).code === "P2025";

    log({
      level: "error",
      msg: "Failed to update booking",
      scope: "api:bookings:[id]:PATCH",
      data: { ip, adminId: admin.id, error: message },
    });

    if (isNotFound) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
