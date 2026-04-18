import { SectionDivider } from "./About";

const TESTIMONIALS = [
  {
    quote: "El mejor tatuaje que me he hecho. Miko te escucha y mejora tu idea.",
    author: "Laura M.",
  },
  {
    quote: "Ambiente increíble, trabajo impecable. 100% recomendado.",
    author: "Carlos R.",
  },
  {
    quote: "Vine con una idea simple y salí con algo épico. ¡Crack!",
    author: "Ana P.",
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-bg py-20">
      <div className="halftone absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[200px] w-[600px] rounded-full bg-gold/4 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionDivider label="LO QUE DICEN" />

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.author}
              className="relative rounded-2xl border border-cream/8 bg-panel p-6 comic-border transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote mark */}
              <span className="absolute right-4 top-4 font-display text-5xl leading-none text-cream/6 select-none">
                "
              </span>

              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 text-gold" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                  </svg>
                ))}
              </div>

              <p className="text-sm leading-relaxed text-cream/75">"{t.quote}"</p>
              <p className="mt-4 text-xs font-bold tracking-[0.2em] text-neon uppercase">— {t.author}</p>
            </div>
          ))}
        </div>

        {/* Google badge */}
        <div className="mt-10 flex justify-center">
          <a
            href="https://g.page/r/mikojesterink/review"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-gold/20 bg-panel px-6 py-3 text-sm font-bold tracking-wide text-cream/60 transition hover:border-gold/40 hover:text-gold"
          >
            <svg className="w-4 text-gold" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
            </svg>
            4.9 en Google · Ver todas las reseñas →
          </a>
        </div>
      </div>
    </section>
  );
}
