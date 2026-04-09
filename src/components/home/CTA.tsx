import Link from "next/link";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-panel py-20">
      <div className="halftone absolute inset-0 opacity-50" />
      {/* Central glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[350px] w-[700px] rounded-full bg-neon/8 blur-[120px]" />
      </div>

      {/* Lightning bolts decorativos */}
      <svg className="absolute left-[8%] top-[20%] w-10 text-neon/30 animate-lightning" viewBox="0 0 24 48" fill="currentColor">
        <polygon points="14,0 6,22 13,22 10,48 18,20 11,20" />
      </svg>
      <svg className="absolute right-[8%] top-[20%] w-10 text-neon/30 animate-lightning delay-500" viewBox="0 0 24 48" fill="currentColor">
        <polygon points="14,0 6,22 13,22 10,48 18,20 11,20" />
      </svg>
      <svg className="absolute left-[20%] bottom-[15%] w-6 text-gold/40 animate-lightning delay-300" viewBox="0 0 24 48" fill="currentColor">
        <polygon points="14,0 6,22 13,22 10,48 18,20 11,20" />
      </svg>
      <svg className="absolute right-[20%] bottom-[15%] w-6 text-gold/40 animate-lightning delay-700" viewBox="0 0 24 48" fill="currentColor">
        <polygon points="14,0 6,22 13,22 10,48 18,20 11,20" />
      </svg>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Stars row */}
        <div className="mb-6 flex justify-center gap-3">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-5 text-gold/60 animate-twinkle`}
              style={{ animationDelay: `${i * 0.3}s` }}
              viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
            </svg>
          ))}
        </div>

        <h2 className="font-display leading-tight tracking-wide">
          <span className="block text-5xl text-cream md:text-6xl">¿QUIERES UN TATTO</span>
          <span className="block text-5xl text-gold md:text-7xl">ÚNICO Y ÉPICO?</span>
        </h2>

        <p className="mt-3 font-display text-2xl italic tracking-wide text-neon/80 md:text-3xl">
          ¡Transforma tus ideas en tinta con estilo y power!
        </p>

        <div className="copy-box mx-auto mt-5 max-w-lg">
          <p className="text-sm text-cream/65 leading-relaxed">
            Reserva una cita y cuéntame tu idea. Te respondo con disponibilidad,
            guía de preparación y próximos pasos. Sin lista de espera interminable.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/book"
            className="rounded-full border-2 border-neon bg-neon px-8 py-4 text-sm font-bold tracking-[0.15em] text-bg shadow-neon transition hover:bg-transparent hover:text-neon hover:shadow-[0_0_48px_rgba(76,194,29,0.6)]"
          >
            ¡RESERVAR CITA!
          </Link>
          <Link
            href="/merch"
            className="rounded-full border-2 border-cream/20 bg-cream/5 px-8 py-4 text-sm font-bold tracking-[0.15em] text-cream transition hover:border-gold/40 hover:bg-gold/8 hover:text-gold"
          >
            CONTACTAR →
          </Link>
        </div>

        {/* Bottom handle */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-neon/30" />
          <a
            href="https://www.instagram.com/mikojesterink/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold tracking-[0.3em] text-cream/25 transition hover:text-neon"
          >
            @MIKOJESTERINK
          </a>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-neon/30" />
        </div>
      </div>
    </section>
  );
}
