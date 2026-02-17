import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED = new Set(["pending", "confirmed", "rejected"]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = (await req.json()) as { status?: string };
    const status = (body.status ?? "").trim();

    if (!ALLOWED.has(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        status: true,
        name: true,
        email: true,
        idea: true,
        placement: true,
        size: true,
        budget: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
