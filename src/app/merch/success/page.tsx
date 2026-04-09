import Link from "next/link";

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function MerchSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionId = params.session_id;

  return (
    <main className="relative overflow-hidden bg-bg min-h-screen flex items-center justify-center py-20">
      <div className="halftone absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-neon/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gold/6 blur-[80px]" />

      <div className="relative mx-auto max-w-md px-6 text-center space-y-8">
        {/* Checkmark */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-neon/40 bg-neon/10 shadow-neon">
          <svg
            className="h-12 w-12 text-neon"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div className="panel-card rounded-3xl p-8 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/25 bg-neon/8 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
            <span className="text-xs font-bold tracking-[0.25em] text-neon">PEDIDO CONFIRMADO</span>
          </span>

          <h1 className="font-display text-5xl tracking-wide text-gold">
            ¡GRACIAS!
          </h1>
          <p className="text-cream/60 leading-relaxed">
            Tu pedido está confirmado. Recibirás un email de confirmación en breve.
          </p>
          {sessionId && (
            <p className="text-xs font-mono text-cream/25 break-all pt-2">
              Ref: {sessionId}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/merch"
            className="rounded-full border-2 border-neon bg-neon px-6 py-3 text-sm font-bold tracking-[0.15em] text-bg shadow-neon transition-all hover:bg-transparent hover:text-neon"
          >
            SEGUIR COMPRANDO
          </Link>
          <Link
            href="/"
            className="rounded-full border border-cream/15 px-6 py-3 text-sm font-bold tracking-[0.15em] text-cream/50 transition hover:border-neon/30 hover:text-neon"
          >
            VOLVER AL INICIO
          </Link>
        </div>
      </div>
    </main>
  );
}
