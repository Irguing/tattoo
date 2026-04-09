import Link from "next/link";

const HERO_BG = "/images/hero-bg.jpg";

const MARQUEE_ITEMS = [
  "NEW SCHOOL", "⚡", "BLACKWORK", "⚡", "REALISMO", "⚡",
  "COLOR", "⚡", "ANIME", "⚡", "NEO TRAD", "⚡",
  "MADRID", "⚡", "ESTUDIO PRIVADO", "⚡", "MERCH", "⚡",
];

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      {/* ── BACKGROUND ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      {/* Dark vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/85 via-bg/50 to-bg/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/30 to-bg/60" />
      {/* Halftone texture */}
      <div className="halftone absolute inset-0 opacity-60" />

      {/* ── GLOW SPOTS ── */}
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-neon/12 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-20 left-0 h-80 w-80 rounded-full bg-neon/8 blur-[80px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/6 blur-[80px]" />

      {/* ── FLOATING STARS ── */}
      <FloatingStars />

      {/* ── LIGHTNING BOLTS (decorative) ── */}
      <LightningDecor />

      {/* ── MAIN CONTENT ── */}
      <div className="relative flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl px-6 pt-28 pb-16">
          <div className="grid gap-10 md:grid-cols-2 items-center">

            {/* LEFT — Copy */}
            <div>
              {/* Badge */}
              <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-4 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
                <span className="text-xs font-bold tracking-[0.25em] text-neon">ESTUDIO PRIVADO · MADRID · CENTRO</span>
              </div>

              {/* Heading — gold comic style */}
              <h1 className="animate-fade-up delay-100 mt-4 font-display leading-[0.85] tracking-wide">
                <span className="block text-gold text-7xl drop-shadow-lg md:text-8xl">
                  MIKO
                </span>
                <span className="block text-gold text-7xl drop-shadow-lg md:text-8xl">
                  JESTER
                </span>
                <span className="mt-1 block text-5xl text-neon-shine md:text-6xl">
                  TATTOO STUDIO
                </span>
              </h1>

              {/* Copy box — comic panel style */}
              <div className="animate-fade-up delay-200 copy-box mt-6 max-w-lg">
                <p className="text-sm leading-relaxed text-cream/80">
                  En el centro de Madrid, un ambiente cañero donde tus ideas se
                  convierten en <span className="font-bold text-neon">aventuras épicas</span>.
                  Tinta con vibra, ilustración con corazón.
                </p>
              </div>

              {/* CTAs */}
              <div className="animate-fade-up delay-300 mt-7 flex flex-wrap gap-4">
                <Link
                  href="/book"
                  className="group relative overflow-hidden rounded-full border-2 border-neon bg-neon px-7 py-3.5 text-sm font-bold tracking-[0.15em] text-bg shadow-neon transition-all duration-300 hover:bg-transparent hover:text-neon hover:shadow-[0_0_48px_rgba(76,194,29,0.6)]"
                >
                  <span className="relative z-10">¡RESERVAR CITA!</span>
                </Link>
                <Link
                  href="/designs"
                  className="rounded-full border-2 border-cream/20 bg-cream/5 px-7 py-3.5 text-sm font-bold tracking-[0.15em] text-cream backdrop-blur-sm transition-all duration-300 hover:border-neon/40 hover:bg-neon/8 hover:text-neon"
                >
                  VER GALERÍA →
                </Link>
              </div>

              {/* Stats row */}
              <div className="animate-fade-up delay-500 mt-8 flex flex-wrap gap-3">
                <StatChip value="+120" label="Flash" color="neon" />
                <StatChip value="100%" label="Custom" color="gold" />
                <StatChip value="+18" label="Adultos" color="neon" />
              </div>
            </div>

            {/* RIGHT — Artist panel */}
            <div className="relative hidden md:block">
              {/* Comic panel frame */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl comic-border">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${HERO_BG})` }}
                />
                <div className="halftone absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-bg/20 to-transparent" />

                {/* Bottom info card */}
                <div className="absolute bottom-4 left-4 right-4 panel-card rounded-2xl p-4">
                  <p className="font-display text-xl tracking-wide text-gold">ESTUDIO PRIVADO</p>
                  <p className="mt-1 text-xs text-cream/60 leading-relaxed">
                    Centro de Madrid · Cita previa · Diseño personalizado
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -right-4 top-8 animate-float rounded-2xl border border-neon/30 bg-panel px-4 py-3 shadow-neon">
                <p className="font-display text-2xl text-neon leading-none">NEW</p>
                <p className="font-display text-2xl text-gold leading-none">SCHOOL</p>
              </div>

              {/* Glow */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[0_0_60px_rgba(76,194,29,0.15)]" />
            </div>
          </div>
        </div>
      </div>

      {/* ── MARQUEE STRIP ── */}
      <div className="relative border-y border-neon/20 bg-panel/80 backdrop-blur-sm py-2.5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon/5 to-transparent" />
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className={
                item === "⚡"
                  ? "text-neon text-base"
                  : "text-[11px] font-bold tracking-[0.3em] text-cream/50"
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

function StatChip({ value, label, color }: { value: string; label: string; color: "neon" | "gold" }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 panel-card ${
      color === "neon" ? "border-neon/20" : "border-gold/20"
    }`}>
      <span className={`font-display text-2xl tracking-wide ${
        color === "neon" ? "text-neon-glow" : "text-gold-glow"
      }`}>{value}</span>
      <span className="text-xs text-cream/40">{label}</span>
    </div>
  );
}

function FloatingStars() {
  const stars = [
    { x: "5%",  y: "15%", s: 20, d: "0s",   dur: "5s"   },
    { x: "15%", y: "70%", s: 14, d: "1.3s",  dur: "6.5s" },
    { x: "82%", y: "12%", s: 24, d: "0.5s",  dur: "4.5s" },
    { x: "90%", y: "58%", s: 16, d: "2s",    dur: "7s"   },
    { x: "50%", y: "82%", s: 12, d: "0.9s",  dur: "5.5s" },
    { x: "38%", y: "8%",  s: 18, d: "1.7s",  dur: "6s"   },
    { x: "72%", y: "78%", s: 10, d: "3.1s",  dur: "5s"   },
  ];

  return (
    <div className="pointer-events-none absolute inset-0">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: s.x, top: s.y,
            animation: `float ${s.dur} ease-in-out infinite`,
            animationDelay: s.d,
          }}
        >
          <ComicStar size={s.s} />
        </div>
      ))}
    </div>
  );
}

function ComicStar({ size }: { size: number }) {
  const r = size / 2;
  const cx = r; const cy = r;
  const pts = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI) / 4 - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.45;
    return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon points={pts} fill="rgba(232,196,52,0.55)" />
    </svg>
  );
}

function LightningDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute left-[5%] top-[35%] w-8 text-neon/40 animate-lightning" viewBox="0 0 24 48" fill="currentColor">
        <polygon points="14,0 6,22 13,22 10,48 18,20 11,20" />
      </svg>
      <svg className="absolute right-[6%] top-[25%] w-6 text-gold/40 animate-lightning delay-700" viewBox="0 0 24 48" fill="currentColor">
        <polygon points="14,0 6,22 13,22 10,48 18,20 11,20" />
      </svg>
      <svg className="absolute left-[45%] bottom-[15%] w-5 text-neon/30 animate-lightning delay-300" viewBox="0 0 24 48" fill="currentColor">
        <polygon points="14,0 6,22 13,22 10,48 18,20 11,20" />
      </svg>
    </div>
  );
}
