import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-start justify-center gap-3 px-6">
      <h1 className="text-3xl font-bold">404</h1>

      <p className="text-black/70 dark:text-white/70">
        Esta página no existe o fue movida.
      </p>

      <Link
        href="/"
        className="mt-2 rounded-lg bg-black px-4 py-2 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
      >
        Ir al inicio
      </Link>
    </main>
  );
}
