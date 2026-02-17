import { NextRequest, NextResponse } from "next/server";

import { prisma } from "../../../lib/prisma";
import { rateLimitFixedWindow } from "../../../lib/rate-limit";
import { getClientIp } from "../../../lib/request-ip";
import { log } from "../../../lib/logger";
import { getCurrentAdmin } from "../../../lib/auth";

type BookingPayload = {
  name?: string;
  email?: string;
  idea?: string;
  placement?: string;
  size?: string;
  budget?: string;
};

function normalizeOptional(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return v.length ? v : null;
}

function normalizeRequired(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Log sin PII
    log({
      level: "info",
      msg: "Bookings fetched",
      scope: "api:bookings:GET",
      data: { ip, adminId: admin.id, count: bookings.length },
    });

    return NextResponse.json({ bookings });
  } catch (err) {
    log({
      level: "error",
      msg: "Failed to fetch bookings",
      scope: "api:bookings:GET",
      data: { ip, error: err instanceof Error ? err.message : "unknown_error" },
    });

    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Público: rate limit para evitar spam
  const rl = rateLimitFixedWindow({
    key: `bookings_create:${ip}`,
    limit: 5,
    windowSec: 60,
  });

  if (!rl.ok) {
    log({
      level: "warn",
      msg: "Rate limit exceeded",
      scope: "api:bookings:POST",
      data: { ip, retryAfterSec: rl.retryAfterSec },
    });

    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSec) },
      }
    );
  }

  try {
    const body = (await req.json()) as BookingPayload;

    const name = normalizeRequired(body.name);
    const email = normalizeRequired(body.email);
    const idea = normalizeRequired(body.idea);

    if (!name || !email || !idea) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, idea" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        idea,
        placement: normalizeOptional(body.placement),
        size: normalizeOptional(body.size),
        budget: normalizeOptional(body.budget),
      },
    });

    // Log sin PII
    log({
      level: "info",
      msg: "Booking created",
      scope: "api:bookings:POST",
      data: { ip, bookingId: booking.id },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    log({
      level: "error",
      msg: "Failed to create booking",
      scope: "api:bookings:POST",
      data: { ip, error: err instanceof Error ? err.message : "unknown_error" },
    });

    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
