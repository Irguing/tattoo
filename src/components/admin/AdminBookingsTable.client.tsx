"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Status = "pending" | "confirmed" | "rejected";
type StatusFilter = Status | "all";

type Booking = {
  id: string;
  name: string;
  email: string;
  idea: string;
  placement: string | null;
  size: string | null;
  budget: string | null;
  status: string;
  createdAt: string; // ✅ en Client Components llega serializado
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function badgeClass(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-500/15 text-emerald-700 border-emerald-500/25";
    case "rejected":
      return "bg-rose-500/15 text-rose-700 border-rose-500/25";
    default:
      return "bg-amber-500/15 text-amber-800 border-amber-500/25";
  }
}

function setParam(params: URLSearchParams, key: string, value: string) {
  const p = new URLSearchParams(params.toString());
  if (!value) p.delete(key);
  else p.set(key, value);
  return p;
}

export default function AdminBookingsTable({
  initialBookings,
  initialQ,
  initialStatus,
}: {
  initialBookings: Booking[];
  initialQ: string;
  initialStatus: StatusFilter;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [rows, setRows] = React.useState<Booking[]>(initialBookings);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  // Mantener referencia al estado actual para evitar closures viejos
  const rowsRef = React.useRef<Booking[]>(initialBookings);

  React.useEffect(() => {
    setRows(initialBookings);
    rowsRef.current = initialBookings;
  }, [initialBookings]);

  React.useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);

  async function updateStatus(id: string, status: Status) {
    setBusyId(id);

    const prev = rowsRef.current;
    setRows((curr) => curr.map((b) => (b.id === id ? { ...b, status } : b)));

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        setRows(prev);
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Failed to update status");
      }

      router.refresh();
    } catch (e) {
      setRows(prev);
      alert(e instanceof Error ? e.message : "Error updating status");
    } finally {
      setBusyId(null);
    }
  }

  const q = initialQ;
  const status = initialStatus;

  return (
    <section className="rounded-2xl border bg-white/50 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Search</label>
            <input
              defaultValue={q}
              placeholder="name, email, idea..."
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 md:w-[320px]"
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                const next = setParam(searchParams, "q", (e.currentTarget.value ?? "").trim());
                router.push(`${pathname}?${next.toString()}`);
              }}
            />
            <p className="mt-1 text-[11px] text-gray-500">Pulsa Enter para aplicar.</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
            <select
              value={status}
              className="rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
              onChange={(e) => {
                const next = setParam(searchParams, "status", e.target.value);
                router.push(`${pathname}?${next.toString()}`);
              }}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{rows.length}</span> bookings
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr className="text-xs uppercase tracking-wide text-gray-600">
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Idea</th>
              <th className="px-4 py-3">Detalles</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Creado</th>
              <th className="px-4 py-3">Acción</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-gray-600" colSpan={6}>
                  No hay reservas con estos filtros.
                </td>
              </tr>
            ) : (
              rows.map((b) => (
                <tr key={b.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{b.name}</div>
                    <div className="text-xs text-gray-500">{b.email}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="max-w-[360px] text-gray-800 line-clamp-3">{b.idea}</div>
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-600">
                    <div>
                      Placement: <span className="text-gray-900">{b.placement ?? "—"}</span>
                    </div>
                    <div>
                      Size: <span className="text-gray-900">{b.size ?? "—"}</span>
                    </div>
                    <div>
                      Budget: <span className="text-gray-900">{b.budget ?? "—"}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass(
                        b.status
                      )}`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-600">
                    {formatDate(b.createdAt)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={
                          b.status === "pending" || b.status === "confirmed" || b.status === "rejected"
                            ? b.status
                            : "pending"
                        }
                        disabled={busyId === b.id}
                        className="rounded-xl border bg-white px-3 py-2 text-xs outline-none disabled:opacity-60"
                        onChange={(e) => updateStatus(b.id, e.target.value as Status)}
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="rejected">rejected</option>
                      </select>

                      <button
                        type="button"
                        disabled={busyId === b.id}
                        className="rounded-xl border px-3 py-2 text-xs font-medium hover:bg-gray-50 disabled:opacity-60"
                        onClick={() => router.refresh()}
                        title="Refrescar"
                      >
                        Refresh
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-[11px] text-gray-500">
        Tip: usa <span className="font-medium">q</span> y <span className="font-medium">status</span> en la URL (ej:{" "}
        <span className="font-mono">?status=pending&q=juan</span>).
      </div>
    </section>
  );
}
