import Link from "next/link";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-dark py-20">
      {/* Blur spots */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[700px] rounded-full bg-neon/8 blur-[120px]" />
      </div>
      <div className="pointer-events-none absolute top-0 left-1/4 h-48 w-48 rounded-full bg-purple/10 blur-[80px]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Decorative line */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-neon/40" />
          <span className="text-neon">✦</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-neon/40" />
        </div>

        <h2 className="font-display text-6xl leading-tight tracking-wide text-cream md:text-7xl">
          ¿QUIERES CREAR
          <br />
          <span className="text-shimmer">ALGO ÚNICO?</span>
        </h2>

        <p className="mt-4 font-display text-2xl italic text-cream/40 tracking-wide md:text-3xl">
          Tu piel. Tu historia.
        </p>

        <p className="mx-auto mt-5 max-w-lg text-cream/55 leading-relaxed">
          Reserva una cita y cuéntame tu idea. Te respondo con disponibilidad,
          guía de preparación y próximos pasos.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/book"
            className="rounded-full border-2 border-neon bg-neon px-8 py-4 text-sm font-bold tracking-widest text-dark shadow-neon transition hover:bg-transparent hover:text-neon"
          >
            RESERVAR CITA
          </Link>
          <Link
            href="/merch"
            className="rounded-full border-2 border-purple/50 bg-purple/10 px-8 py-4 text-sm font-bold tracking-widest text-cream transition hover:border-purple hover:bg-purple/20 hover:shadow-purple"
          >
            VER MERCH →
          </Link>
        </div>

        {/* Bottom decorative */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-cream/10" />
          <span className="text-cream/20 text-xs tracking-widest">MIKOJESTERINK</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-cream/10" />
        </div>
      </div>
    </section>
  );
}
