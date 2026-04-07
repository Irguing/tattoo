import Link from "next/link";

export function About() {
  return (
    <section className="relative overflow-hidden bg-dark py-20">
      {/* Blur spots */}
      <div className="pointer-events-none absolute top-0 left-0 h-80 w-80 rounded-full bg-purple/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-neon/8 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Divider label */}
        <div className="mb-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cream/15 to-transparent" />
          <span className="text-xs font-bold tracking-[0.4em] text-cream/30">EL ESTUDIO</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cream/15 to-transparent" />
        </div>

        <div className="grid gap-12 md:grid-cols-2 items-center">
          {/* Imagen placeholder con glow */}
          <div className="relative group">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-cream/10 bg-surface shadow-card">
              {/* Placeholder con gradiente artístico */}
              <div className="h-full w-full bg-gradient-to-br from-purple/30 via-dark to-neon/20" />
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(cream_1px,transparent_1px),linear-gradient(90deg,cream_1px,transparent_1px)] [background-size:40px_40px]" />
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-4xl tracking-widest text-cream/15">FOTO</span>
              </div>
            </div>

            {/* Badge flotante */}
            <div className="absolute -bottom-5 -right-5 rounded-2xl border border-neon/30 bg-dark px-5 py-3 shadow-neon">
              <p className="font-display text-2xl tracking-wide text-neon leading-none">Desde 2021</p>
              <p className="text-xs text-cream/50 mt-0.5">Madrid · Estudio privado</p>
            </div>

            {/* Glow en hover */}
            <div className="absolute inset-0 rounded-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 shadow-[0_0_60px_rgba(155,47,201,0.3)]" />
          </div>

          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-neon/25 bg-neon/8 px-3 py-1 text-xs font-bold tracking-widest text-neon">
              ✦ ORIGINALIDAD · CREATIVIDAD · EXPERIMENTACIÓN
            </span>

            <h2 className="mt-5 font-display text-5xl leading-tight tracking-wide md:text-6xl">
              <span className="text-cream">ARTE QUE</span>
              <br />
              <span className="text-shimmer">SE VIVE</span>
            </h2>

            <p className="mt-5 text-cream/60 leading-relaxed text-base">
              Este estudio creativo nace en pleno centro de Madrid pensado para ilustración,
              tatuaje artístico y talleres presenciales. Aquí el proceso importa tanto como
              el resultado: cada pieza se diseña con escucha, calma y un enfoque personal.
            </p>

            {/* Features */}
            <ul className="mt-6 space-y-2">
              {[
                "Diseños 100% personalizados",
                "Ambiente íntimo y privado",
                "New school, color, blackwork",
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-3 text-sm text-cream/70">
                  <span className="text-neon">◆</span>
                  {feat}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="rounded-full bg-neon px-6 py-3 text-sm font-bold tracking-widest text-dark shadow-neon transition hover:opacity-90"
              >
                RESERVAR CITA
              </Link>
              <Link
                href="/designs"
                className="rounded-full border border-cream/20 px-6 py-3 text-sm font-bold tracking-widest text-cream/70 transition hover:border-cream/50 hover:text-cream"
              >
                VER GALERÍA →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
