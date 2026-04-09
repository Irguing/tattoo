import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal — Miko Jester",
};

export default function LegalPage() {
  return (
    <main className="relative overflow-hidden bg-bg min-h-screen pt-28 pb-20">
      <div className="halftone absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-neon/8 blur-[100px]" />

      <div className="relative mx-auto max-w-2xl px-6">
        <div className="mb-10">
          <h1 className="font-display text-5xl tracking-wide text-gold">AVISO LEGAL</h1>
        </div>

        <div className="panel-card rounded-2xl p-8 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="font-bold tracking-[0.15em] text-neon uppercase mb-3">Titular del sitio web</h2>
            <p className="text-cream/65">Miko Jester — Artista de tatuaje con sede en Madrid, España.</p>
            <p className="text-cream/65">Contacto: info@mikojester.com</p>
          </section>

          <section>
            <h2 className="font-bold tracking-[0.15em] text-neon uppercase mb-3">Objeto y ámbito de aplicación</h2>
            <p className="text-cream/65">
              El presente aviso legal regula el uso del sitio web mikojester.com. El acceso
              y uso del sitio implica la aceptación plena de las condiciones aquí recogidas.
            </p>
          </section>

          <section>
            <h2 className="font-bold tracking-[0.15em] text-neon uppercase mb-3">Propiedad intelectual</h2>
            <p className="text-cream/65">
              Todos los contenidos del sitio web — textos, imágenes, diseños, logotipos y
              obras gráficas — son propiedad de Miko Jester o de terceros que han autorizado
              su uso. Queda prohibida su reproducción sin autorización expresa.
            </p>
          </section>

          <section>
            <h2 className="font-bold tracking-[0.15em] text-neon uppercase mb-3">Responsabilidad</h2>
            <p className="text-cream/65">
              El titular no garantiza la disponibilidad continua del sitio y no se
              responsabiliza de los daños que pudieran derivarse de su uso.
            </p>
          </section>

          <section>
            <h2 className="font-bold tracking-[0.15em] text-neon uppercase mb-3">Legislación aplicable</h2>
            <p className="text-cream/65">
              Este aviso legal se rige por la legislación española. Para cualquier
              controversia, las partes se someten a los juzgados y tribunales de Madrid.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
