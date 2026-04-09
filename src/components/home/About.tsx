import Link from "next/link";

export function About() {
  return (
    <section className="relative overflow-hidden bg-panel py-20">
      {/* Halftone */}
      <div className="halftone absolute inset-0 opacity-40" />
      {/* Glow */}
      <div className="pointer-events-none absolute top-0 left-0 h-72 w-72 rounded-full bg-neon/8 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gold/6 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section label */}
        <SectionDivider label="EL ESTUDIO" />

        <div className="mt-10 grid gap-12 md:grid-cols-2 items-center">
          {/* Image panel */}
          <div className="relative group">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl comic-border">
              <div className="h-full w-full bg-gradient-to-br from-neon/20 via-panel2 to-gold/10" />
              <div className="halftone absolute inset-0" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-5xl tracking-widest text-cream/10">FOTO</span>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-4 animate-float-alt rounded-2xl border border-gold/30 bg-panel px-5 py-3 shadow-gold">
              <p className="font-display text-2xl tracking-wide text-gold leading-none">Desde 2021</p>
              <p className="mt-0.5 text-xs text-cream/50">Madrid · Estudio privado</p>
            </div>

            {/* Lightning */}
            <svg className="absolute -top-3 -left-3 w-7 text-neon/60 animate-lightning" viewBox="0 0 24 48" fill="currentColor">
              <polygon points="14,0 6,22 13,22 10,48 18,20 11,20" />
            </svg>
          </div>

          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-neon/25 bg-neon/8 px-4 py-1.5">
              <span className="text-xs font-bold tracking-[0.25em] text-neon">✦ ORIGINALIDAD · CREATIVIDAD · PASIÓN</span>
            </span>

            <h2 className="mt-5 font-display leading-tight tracking-wide">
              <span className="block text-5xl text-cream md:text-6xl">ARTE QUE</span>
              <span className="block text-5xl text-gold md:text-6xl">SE VIVE</span>
            </h2>

            {/* Copy box */}
            <div className="copy-box mt-5">
              <p className="text-sm leading-relaxed text-cream/75">
                En el centro de Madrid, nuestro estudio es un templo del tattoo
                creativo lleno de vida y buen rollo. Cada tatuaje es único, tratado
                con mimo y detalle artesano.{" "}
                <span className="font-bold text-neon">¡Aquí se tatúa con corazón!</span>
              </p>
            </div>

            {/* Feature list */}
            <ul className="mt-5 space-y-2.5">
              {[
                "Diseños 100% personalizados",
                "New school, color, blackwork, anime",
                "Ambiente íntimo y privado",
                "Cita previa — sin listas de espera eternas",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-cream/70">
                  <span className="text-neon text-base">◆</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="rounded-full border-2 border-neon bg-neon px-6 py-3 text-sm font-bold tracking-[0.15em] text-bg shadow-neon transition hover:bg-transparent hover:text-neon"
              >
                ¡RESERVAR CITA!
              </Link>
              <Link
                href="/designs"
                className="rounded-full border-2 border-cream/15 px-6 py-3 text-sm font-bold tracking-[0.15em] text-cream/70 transition hover:border-neon/40 hover:text-neon"
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

export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neon/25 to-transparent" />
      <span className="text-[10px] font-bold tracking-[0.5em] text-neon/50">{label}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neon/25 to-transparent" />
    </div>
  );
}
