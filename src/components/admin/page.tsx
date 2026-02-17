import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
      <p className="mt-2 text-sm text-gray-600">
        Panel de gestión del sitio.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/bookings"
          className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow"
        >
          <div className="text-sm text-gray-500">Module</div>
          <div className="mt-1 text-lg font-semibold">Bookings</div>
          <div className="mt-2 text-sm text-gray-600">
            Lista y gestiona reservas.
          </div>
        </Link>

        <div className="rounded-2xl border bg-white p-5 opacity-60">
          <div className="text-sm text-gray-500">Module</div>
          <div className="mt-1 text-lg font-semibold">Posts</div>
          <div className="mt-2 text-sm text-gray-600">Próximo.</div>
        </div>

        <div className="rounded-2xl border bg-white p-5 opacity-60">
          <div className="text-sm text-gray-500">Module</div>
          <div className="mt-1 text-lg font-semibold">Gallery</div>
          <div className="mt-2 text-sm text-gray-600">Próximo.</div>
        </div>
      </div>
    </main>
  );
}
