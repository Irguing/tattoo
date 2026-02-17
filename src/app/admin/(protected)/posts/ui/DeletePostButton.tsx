"use client";

import { useState, useTransition } from "react";

export default function DeletePostButton({ action }: { action: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
        >
          Eliminar
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await action();
              })
            }
            className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Eliminando..." : "Confirmar"}
          </button>
        </>
      )}
    </div>
  );
}
