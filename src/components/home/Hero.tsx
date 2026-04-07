import Link from "next/link";

const HERO_BG = "/images/hero-bg.jpg";

const MARQUEE_ITEMS = [
  "NEW SCHOOL",
  "✦",
  "BLACKWORK",
  "✦",
  "REALISMO",
  "✦",
  "ILUSTRACIÓN",
  "✦",
  "MADRID",
  "✦",
  "ESTUDIO PRIVADO",
  "✦",
  "MERCH",
  "✦",
  "COLOR",
  "✦",
  "ANIME",
  "✦",
];

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      {/* ── Fondo ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      {/* Gradient overlay — oscuro arriba y abajo para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/40 to-dark/90" />
      {/* Viñeta lateral */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-transparent to-dark/40" />

      {/* ── Decoraciones flotantes ── */}
      <FloatingSparkles />

      {/* ── Blur spots de color ── */}
      <div className="pointer-events-none absolute top-20 right-16 h-72 w-72 rounded-full bg-neon/15 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-32 left-10 h-64 w-64 rounded-full bg-purple/15 blur-[80px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-gold/10 blur-[60px]" />

      {/* ── Contenido principal ── */}
      <div className="relative flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl px-6 pt-28 pb-12">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/8 px-4 py-1.5 text-xs font-bold tracking-widest text-neon">
              <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
              ESTUDIO PRIVADO · MADRID · CENTRO
            </div>

            {/* Heading */}
            <h1 className="animate-fade-up delay-100 mt-5 font-display leading-[0.85] tracking-wide">
              <span className="block text-7xl text-cream drop-shadow-lg md:text-8xl lg:text-9xl">
                MIKO
              </span>
              <span className="block text-7xl text-cream drop-shadow-lg md:text-8xl lg:text-9xl">
                JESTER
              </span>
              <span className="text-shimmer block text-6xl md:text-7xl lg:text-8xl">
                TATTOO STUDIO
              </span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-up delay-200 mt-6 max-w-lg text-base text-cream/65 leading-relaxed md:text-lg">
              Tinta llena de vida, ilustrada con personalidad y un ambiente vibrante
              donde tus ideas se convierten en obras de arte.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up delay-300 mt-8 flex flex-wrap gap-4">
              <Link
                href="/book"
                className="group relative rounded-full border-2 border-neon bg-neon px-7 py-3.5 text-sm font-bold tracking-widest text-dark shadow-neon transition-all hover:bg-transparent hover:text-neon hover:shadow-[0_0_40px_rgba(76,194,29,0.5)]"
              >
                RESERVAR CITA
              </Link>
              <Link
                href="/designs"
                className="rounded-full border-2 border-cream/20 bg-cream/5 px-7 py-3.5 text-sm font-bold tracking-widest text-cream backdrop-blur transition-all hover:border-cream/50 hover:bg-cream/10"
              >
                VER TRABAJOS →
              </Link>
            </div>

            {/* Stats */}
            <div className="animate-fade-up delay-500 mt-10 flex flex-wrap gap-4">
              <StatPill value="+120" label="Flash disponibles" />
              <StatPill value="100%" label="Custom design" />
              <StatPill value="Online" label="Reservas" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Marquee strip ── */}
      <div className="relative border-t border-cream/10 bg-dark/60 backdrop-blur-sm py-3 overflow-hidden">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className={
                item === "✦"
                  ? "text-neon text-lg"
                  : "text-xs font-bold tracking-[0.3em] text-cream/40"
              }
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-cream/10 bg-surface/60 px-4 py-2.5 backdrop-blur-sm">
      <span className="font-display text-2xl text-neon tracking-wide">{value}</span>
      <span className="text-xs text-cream/50 leading-tight">{label}</span>
    </div>
  );
}

function FloatingSparkles() {
  const sparkles = [
    { x: "8%",  y: "18%", size: 18, delay: "0s",    dur: "5s"  },
    { x: "18%", y: "72%", size: 12, delay: "1.2s",  dur: "6s"  },
    { x: "80%", y: "14%", size: 22, delay: "0.4s",  dur: "4.5s"},
    { x: "88%", y: "60%", size: 14, delay: "2s",    dur: "7s"  },
    { x: "55%", y: "80%", size: 10, delay: "0.8s",  dur: "5.5s"},
    { x: "42%", y: "10%", size: 16, delay: "1.6s",  dur: "6.5s"},
    { x: "92%", y: "35%", size: 10, delay: "3s",    dur: "5s"  },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: s.x,
            top: s.y,
            animation: `float ${s.dur} ease-in-out infinite`,
            animationDelay: s.delay,
          }}
        >
          <Star size={s.size} />
        </div>
      ))}
    </div>
  );
}

function Star({ size }: { size: number }) {
  const r = size / 2;
  const x = r;
  const y = r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <path
        d={`M ${x} 0 L ${x + r * 0.35} ${y - r * 0.35} L ${size} ${y} L ${x + r * 0.35} ${y + r * 0.35} L ${x} ${size} L ${x - r * 0.35} ${y + r * 0.35} L 0 ${y} L ${x - r * 0.35} ${y - r * 0.35} Z`}
        fill="rgba(232,160,32,0.35)"
      />
    </svg>
  );
}
