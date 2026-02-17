import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "../../../../lib/prisma";
import { rateLimitFixedWindow } from "../../../../lib/rate-limit";
import { getClientIp } from "../../../../lib/request-ip";
import { log } from "../../../../lib/logger";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

function normalizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function getSessionExpiryMs(): number {
  const raw = process.env.SESSION_EXPIRES_HOURS?.trim();
  const hours = raw ? Number(raw) : 24;
  const safeHours = Number.isFinite(hours) && hours > 0 ? hours : 24;
  return safeHours * 60 * 60 * 1000;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Rate limit: 10 intentos / 10 minutos por IP
  const rl = rateLimitFixedWindow({
    key: `admin_login:${ip}`,
    limit: 10,
    windowSec: 10 * 60,
  });

  if (!rl.ok) {
    log({
      level: "warn",
      msg: "Admin login rate limited",
      scope: "api:admin:login",
      data: { ip, retryAfterSec: rl.retryAfterSec },
    });

    return NextResponse.json(
      { error: "Too many attempts" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  try {
    const body = (await req.json()) as LoginBody;

    const email = normalizeString(body.email).toLowerCase();
    const password = normalizeString(body.password);

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({
      where: { email },
      select: { id: true, password: true },
    });

    // Respuesta genérica (no filtra si el email existe)
    if (!user) {
      log({
        level: "warn",
        msg: "Invalid credentials (user not found)",
        scope: "api:admin:login",
        data: { ip },
      });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      log({
        level: "warn",
        msg: "Invalid credentials (bad password)",
        scope: "api:admin:login",
        data: { ip, userId: user.id },
      });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const sessionToken = randomUUID();
    const expiresAt = new Date(Date.now() + getSessionExpiryMs());

    await prisma.session.create({
      data: {
        id: sessionToken,
        userId: user.id,
        expiresAt,
      },
    });

    const cookieStore = await cookies(); // Next 16
    const cookieName = process.env.SESSION_COOKIE_NAME?.trim() || "admin_session";

    cookieStore.set(cookieName, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt, // importante: expira con la sesión
    });

    log({
      level: "info",
      msg: "Admin login success",
      scope: "api:admin:login",
      data: { ip, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    log({
      level: "error",
      msg: "LOGIN ERROR",
      scope: "api:admin:login",
      data: {
        ip,
        error: error instanceof Error ? error.message : "unknown_error",
      },
    });

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
