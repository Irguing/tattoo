import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="text-sm text-neutral-500">Panel de administración.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Link href="/admin/posts" className="rounded-lg border p-4 hover:bg-neutral-50">
          <div className="font-medium">Posts</div>
          <div className="text-sm text-neutral-500">CRUD de blog editorial</div>
        </Link>

        <Link href="/admin/bookings" className="rounded-lg border p-4 hover:bg-neutral-50">
          <div className="font-medium">Bookings</div>
          <div className="text-sm text-neutral-500">Reservas</div>
        </Link>

        <Link href="/admin/gallery" className="rounded-lg border p-4 hover:bg-neutral-50">
          <div className="font-medium">Gallery</div>
          <div className="text-sm text-neutral-500">Uploads e imágenes</div>
        </Link>
      </div>
    </div>
  );
}
