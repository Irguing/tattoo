"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/getCurrentAdmin";

async function mustBeAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

// ✅ Export con el nombre exacto que espera bookings/page.tsx
export async function updateBookingStatus(bookingId: string, formData: FormData) {
  await mustBeAdmin();

  const status = String(formData.get("status") ?? "").trim();
  if (!["pending", "confirmed", "rejected"].includes(status)) {
    throw new Error("Estado inválido.");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  revalidatePath("/admin/bookings");
}
