import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isUnauthorized } from "@/lib/api-auth";

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      idea: true,
      placement: true,
      size: true,
      budget: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json(bookings);
}
