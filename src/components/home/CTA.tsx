import Link from "next/link";

export function CTA() {
  return (
    <section className="py-16 bg-sand">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-[32px] border border-ink/10 bg-white p-8 shadow-soft md:p-12">
          <h2 className="font-display text-5xl tracking-wide text-green900">
            ¿Quieres crear algo único?
          </h2>
          <p className="mt-3 max-w-2xl text-ink/70">
            Reserva una cita y cuéntame tu idea. Te respondo con disponibilidad, guía de preparación y próximos pasos.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="rounded-xl bg-green700 px-6 py-3 text-sand font-semibold shadow-soft hover:bg-green500"
            >
              Reservar cita
            </Link>
            <Link
              href="/merch"
              className="rounded-xl border border-ink/15 px-6 py-3 font-semibold hover:bg-ink/5"
            >
              Ver merch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
