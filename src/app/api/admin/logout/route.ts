import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "../../../../lib/prisma";
import { log } from "../../../../lib/logger";
import { getClientIp } from "../../../../lib/request-ip";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    const cookieStore = await cookies(); // Next 16 async
    const cookieName =
      process.env.SESSION_COOKIE_NAME?.trim() || "admin_session";

    const sessionToken = cookieStore.get(cookieName)?.value;

    if (sessionToken) {
      // deleteMany evita error si no existe
      await prisma.session.deleteMany({
        where: { id: sessionToken },
      });
    }

    cookieStore.delete(cookieName);

    log({
      level: "info",
      msg: "Admin logout",
      scope: "api:admin:logout",
      data: { ip },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    log({
      level: "error",
      msg: "Admin logout failed",
      scope: "api:admin:logout",
      data: {
        ip,
        error: error instanceof Error ? error.message : "unknown_error",
      },
    });

    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
