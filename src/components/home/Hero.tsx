import Link from "next/link";
import { Button } from "@/components/ui/Button";
import SiteHeader from "../SiteHeader";
const HERO_BG = "/images/hero-bg.jpg";


export function Hero() {
  return (
<section className="relative overflow-hidden text-sand">
  {/* Imagen de fondo */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: `url(${HERO_BG})` }}
  />

  {/* Overlay/gradiente para legibilidad */}
  <div className="absolute inset-0 bg-gradient-to-b from-green900/60 via-green900/35 to-green900/65" />
      {/* textura/ruido simple */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* decoraciones tipo “estrellas” */}
      <Decorations />


<SiteHeader />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-sand/20 bg-sand/10 px-3 py-1 text-xs font-semibold">
            ✦ Ilustración · Tattoo Artist · Estudio Privado

          </p>

          <h1 className="mt-5 font-display text-6xl leading-[0.9] tracking-wide md:text-7xl">
            Miko Jester
            <span className="block text-neon">Tattoo Studio</span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-sand/80 md:text-lg">
            Diseños con vibra ilustrada, flash con personalidad y una tienda de merch que
            vamos a convertir en un proyecto fullstack de entrevista.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/book">
              <Button className="bg-neon text-ink hover:opacity-90">
                Reservar cita
              </Button>
            </Link>
            <Link href="/designs">
              <Button variant="outline" className="border-sand/30 bg-transparent text-sand hover:bg-sand/10">
                Ver tatuajes
              </Button>
            </Link>
            <Link href="/merch">
              <Button variant="ghost" className="text-sand hover:bg-sand/10">
                Ir a la tienda
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-sand/75 max-w-sm">
  <Stat title="Flash disponibles" value="+120" />
  <Stat title="Reservas" value="Online" />
</div>

        </div>

        {/* bloque “ilustración” (placeholder) */}
        <div className="relative">
        <div className="aspect-[4/5] w-full rounded-[28px] border border-sand/20 bg-gradient-to-br from-sand/10 to-transparent shadow-soft backdrop-blur-xl" />
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-neon/25 blur-2xl" />
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-rust/25 blur-2xl" />

          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-sand/15 bg-sand/10 p-4 backdrop-blur">
            <p className="font-display text-2xl tracking-wide">ESTUDIO PRIVADO</p>
            <p className="mt-1 text-sm text-sand/75">
               Tattoo studio en el centro de Madrid, pensado como un espacio íntimo,
    tranquilo y personalizado donde cada pieza nace desde la ilustración.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-sand/15 bg-sand/5 p-3">
      <div className="font-display text-xl tracking-wide">{value}</div>
      <div className="mt-1">{title}</div>
    </div>
  );
}

function Decorations() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      viewBox="0 0 1200 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* estrellas simples */}
      <g opacity="0.35">
        <Star x={120} y={90} s={16} />
        <Star x={280} y={140} s={10} />
        <Star x={980} y={120} s={18} />
        <Star x={1040} y={230} s={10} />
        <Star x={160} y={420} s={12} />
        <Star x={920} y={460} s={14} />
      </g>

      {/* líneas curvas suaves */}
      <path
        d="M-50 200 C 250 120, 360 260, 620 180 C 860 110, 980 160, 1250 90"
        stroke="rgba(243,235,221,0.18)"
        strokeWidth="2"
      />
      <path
        d="M-40 520 C 260 420, 420 560, 680 480 C 920 410, 1030 500, 1260 420"
        stroke="rgba(243,235,221,0.14)"
        strokeWidth="2"
      />
    </svg>
  );
}

function Star({ x, y, s }: { x: number; y: number; s: number }) {
  const r = s / 2;
  return (
    <path
      d={`M ${x} ${y - r} L ${x + r * 0.35} ${y - r * 0.35} L ${x + r} ${y} L ${x + r * 0.35} ${y + r * 0.35} L ${x} ${
        y + r
      } L ${x - r * 0.35} ${y + r * 0.35} L ${x - r} ${y} L ${x - r * 0.35} ${y - r * 0.35} Z`}
      fill="rgba(243,235,221,0.22)"
    />
  );
}
