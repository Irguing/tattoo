import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  // Pequeño resumen real para entrevista (opcional pero pro)
  const [bookingsTotal, pendingBookings, galleryTotal, publishedImages] =
    await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.galleryImage.count(),
      prisma.galleryImage.count({ where: { isPublished: true } }),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-zinc-400">Resumen rápido del panel</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Bookings total" value={bookingsTotal} />
        <StatCard label="Pending bookings" value={pendingBookings} />
        <StatCard label="Images total" value={galleryTotal} />
        <StatCard label="Published images" value={publishedImages} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
