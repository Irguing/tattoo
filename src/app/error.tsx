"use client";

import * as React from "react";
import Link from "next/link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-start justify-center gap-4 px-6">
      <h1 className="text-3xl font-bold">Algo se rompió</h1>

      <p className="text-neutral-600">
        Ha ocurrido un error inesperado.
      </p>

      {error.digest ? (
        <p className="text-sm text-neutral-500">
          Código de error: <span className="font-mono">{error.digest}</span>
        </p>
      ) : null}

      {process.env.NODE_ENV === "development" && (
        <pre className="w-full overflow-auto rounded-lg bg-neutral-100 p-4 text-xs">
          {error.message}
          {"\n"}
          {error.stack}
        </pre>
      )}

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
        >
          Reintentar
        </button>

        <Link
          href="/"
          className="rounded-lg border px-4 py-2 hover:bg-neutral-50"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
