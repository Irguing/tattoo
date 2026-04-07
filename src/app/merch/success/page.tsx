import Link from "next/link";

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function MerchSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionId = params.session_id;

  return (
    <main className="bg-sand min-h-[70vh] flex items-center justify-center py-20">
      <div className="mx-auto max-w-md px-6 text-center space-y-6">
        {/* Checkmark */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green900/10">
          <svg
            className="h-10 w-10 text-green900"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div>
          <h1 className="font-display text-4xl tracking-wide text-green900">
            ¡Pedido confirmado!
          </h1>
          <p className="mt-3 text-ink/70 leading-relaxed">
            Gracias por tu compra. Recibirás un email de confirmación en breve.
          </p>
          {sessionId && (
            <p className="mt-2 text-xs font-mono text-ink/40 break-all">
              Ref: {sessionId}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/merch"
            className="rounded-full bg-green900 px-6 py-3 text-sm font-semibold text-sand hover:opacity-90 transition"
          >
            Seguir comprando
          </Link>
          <Link
            href="/"
            className="rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold text-ink hover:bg-ink/5 transition"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
