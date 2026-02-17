import Link from "next/link";

export function About() {
  return (
    <section className="py-16 bg-sand">
      <div className="mx-auto max-w-6xl px-6 grid gap-10 md:grid-cols-2 items-center">
        <div className="relative">
          {/* Placeholder imagen (luego lo cambiamos por foto real) */}
          <div className="aspect-[4/5] w-full rounded-[32px] bg-white border border-ink/10 shadow-soft overflow-hidden">
            <div className="h-full w-full bg-gradient-to-br from-green700/20 to-rust/10" />
          </div>
          <div className="absolute -bottom-4 -left-4 rounded-full bg-white border border-ink/10 px-5 py-3 shadow-soft">
            <p className="font-display text-2xl text-green900 leading-none">Desde 2021</p>
            <p className="text-xs text-ink/70 -mt-1">Madrid · Estudio privado</p>
          </div>
        </div>

        <div>
          <p className="inline-flex rounded-full bg-green900 text-sand px-3 py-1 text-xs font-semibold">
            ✦ Originalidad · Creatividad · Experimentación
          </p>

          <h2 className="mt-4 font-display text-5xl tracking-wide text-green900">
            Arte que se vive
          </h2>

          <p className="mt-4 text-ink/70 leading-relaxed">
            Este estudio creativo nace en pleno centro de Madrid pensado para ilustración,
            tatuaje artístico y talleres presenciales. Aquí el proceso importa tanto como el resultado:
            cada pieza se diseña con escucha, calma y un enfoque personal.
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              href="/book"
              className="rounded-xl bg-green700 px-5 py-3 text-sand font-semibold shadow-soft hover:bg-green500"
            >
              Reservar cita
            </Link>
            <Link
              href="/designs"
              className="rounded-xl border border-ink/15 px-5 py-3 font-semibold hover:bg-ink/5"
            >
              Ver galería
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
