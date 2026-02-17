"use client";

import * as React from "react";
import Link from "next/link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminProtectedError({ error, reset }: Props) {
  React.useEffect(() => {
    console.error(
      JSON.stringify({
        level: "error",
        scope: "admin:protected:error",
        message: error.message,
        digest: error.digest,
      })
    );
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center gap-3 px-6">
      <h1 className="text-2xl font-semibold">Error en el panel</h1>

      <p className="text-black/70 dark:text-white/70">
        Algo falló en el área de administración.
      </p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-black px-4 py-2 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          Reintentar
        </button>

        <Link
          href="/admin"
          className="rounded-lg border border-black/20 px-4 py-2 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Volver al dashboard
        </Link>
      </div>
    </main>
  );
}
