import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal — Miko Jester",
};

export default function LegalPage() {
  return (
    <main className="bg-sand min-h-[70vh] py-20">
      <div className="mx-auto max-w-2xl px-6">
        <h1 className="font-display text-4xl tracking-wide text-green900 mb-8">
          Aviso Legal
        </h1>

        <div className="space-y-6 text-ink/80 leading-relaxed text-sm">
          <section>
            <h2 className="font-semibold text-ink mb-2">Titular del sitio web</h2>
            <p>Miko Jester — Artista de tatuaje con sede en Madrid, España.</p>
            <p>Contacto: info@mikojester.com</p>
          </section>

          <section>
            <h2 className="font-semibold text-ink mb-2">Objeto y ámbito de aplicación</h2>
            <p>
              El presente aviso legal regula el uso del sitio web mikojester.com. El acceso
              y uso del sitio implica la aceptación plena de las condiciones aquí recogidas.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-ink mb-2">Propiedad intelectual</h2>
            <p>
              Todos los contenidos del sitio web — textos, imágenes, diseños, logotipos y
              obras gráficas — son propiedad de Miko Jester o de terceros que han autorizado
              su uso. Queda prohibida su reproducción sin autorización expresa.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-ink mb-2">Responsabilidad</h2>
            <p>
              El titular no garantiza la disponibilidad continua del sitio y no se
              responsabiliza de los daños que pudieran derivarse de su uso.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-ink mb-2">Legislación aplicable</h2>
            <p>
              Este aviso legal se rige por la legislación española. Para cualquier
              controversia, las partes se someten a los juzgados y tribunales de Madrid.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
