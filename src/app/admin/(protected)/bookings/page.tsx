import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import BookingStatusButtons from "./ui/BookingStatusButtons";
import { updateBookingStatus } from "./actions";

export const dynamic = "force-dynamic";

type RawSearchParams = Record<string, string | string[] | undefined>;
type Status = "pending" | "confirmed" | "rejected";

function first(v: string | string[] | undefined): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return "";
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  // 🔐 Seguridad explícita
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const sp = await searchParams;

  const q = first(sp.q).trim();
  const status = first(sp.status).trim() as Status | "";

  const where: {
    status?: Status;
    OR?: Array<
      | { name: { contains: string; mode: "insensitive" } }
      | { email: { contains: string; mode: "insensitive" } }
      | { idea: { contains: string; mode: "insensitive" } }
      | { placement: { contains: string; mode: "insensitive" } }
    >;
  } = {};

  if (status === "pending" || status === "confirmed" || status === "rejected") {
    where.status = status;
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { idea: { contains: q, mode: "insensitive" } },
      { placement: { contains: q, mode: "insensitive" } },
    ];
  }

  const bookings = await prisma.booking.findMany({
    where,
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

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Bookings</h1>
          <p className="text-sm text-neutral-500">
            Reservas y solicitudes entrantes.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <form className="grid gap-3 rounded-lg border p-4 md:grid-cols-3">
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Buscar (nombre, email, idea...)"
          className="rounded-md border px-3 py-2 text-sm"
        />

        <select
          id="status"
          name="status"
          defaultValue={status}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="rejected">rejected</option>
        </select>

        <button
          type="submit"
          className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
        >
          Aplicar
        </button>

        {(q || status) && (
          <Link
            href="/admin/bookings"
            className="text-sm text-neutral-600 hover:underline md:col-span-3"
          >
            Limpiar filtros
          </Link>
        )}
      </form>

      {/* Tabla */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50">
            <tr className="text-neutral-600">
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Idea</th>
              <th className="px-4 py-3">Detalles</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-neutral-500" colSpan={5}>
                  No hay resultados.
                </td>
              </tr>
            ) : (
              bookings.map((b) => {
                const boundUpdate = updateBookingStatus.bind(null, b.id);

                return (
                  <tr key={b.id} className="border-t align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium">{b.name}</div>
                      <div className="text-xs text-neutral-600">{b.email}</div>
                      <div className="mt-1 text-xs text-neutral-500">
                        {b.createdAt.toLocaleString("es-ES")}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="max-w-md whitespace-pre-wrap text-neutral-800">
                        {b.idea}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs text-neutral-700">
                      <div>
                        <span className="font-medium">placement:</span>{" "}
                        {b.placement ?? "—"}
                      </div>
                      <div>
                        <span className="font-medium">size:</span>{" "}
                        {b.size ?? "—"}
                      </div>
                      <div>
                        <span className="font-medium">budget:</span>{" "}
                        {b.budget ?? "—"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-800">
                        {b.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <BookingStatusButtons
                        status={b.status}
                        action={boundUpdate}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
