import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — Miko Jester",
};

export default function PrivacyPage() {
  return (
    <main className="relative overflow-hidden bg-bg min-h-screen pt-28 pb-20">
      <div className="halftone absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-neon/8 blur-[100px]" />

      <div className="relative mx-auto max-w-2xl px-6">
        <div className="mb-10">
          <h1 className="font-display text-5xl tracking-wide text-gold">PRIVACIDAD</h1>
        </div>

        <div className="panel-card rounded-2xl p-8 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="font-bold tracking-[0.15em] text-neon uppercase mb-3">Responsable del tratamiento</h2>
            <p className="text-cream/65">Miko Jester — info@mikojester.com — Madrid, España.</p>
          </section>

          <section>
            <h2 className="font-bold tracking-[0.15em] text-neon uppercase mb-3">Datos que recogemos</h2>
            <p className="text-cream/65">
              Al realizar una reserva o una compra, recogemos tu nombre, dirección de
              correo electrónico y los datos necesarios para completar la transacción.
              No almacenamos datos de tarjetas de crédito — el pago se procesa a través
              de Stripe, que cuenta con certificación PCI-DSS.
            </p>
          </section>

          <section>
            <h2 className="font-bold tracking-[0.15em] text-neon uppercase mb-3">Finalidad y base legal</h2>
            <p className="text-cream/65">
              Tratamos tus datos para gestionar reservas y pedidos (ejecución de contrato),
              y para enviarte confirmaciones por correo (interés legítimo). No realizamos
              marketing sin consentimiento previo.
            </p>
          </section>

          <section>
            <h2 className="font-bold tracking-[0.15em] text-neon uppercase mb-3">Conservación</h2>
            <p className="text-cream/65">
              Los datos se conservan durante el tiempo necesario para cumplir con la
              finalidad para la que fueron recogidos y con las obligaciones legales
              aplicables.
            </p>
          </section>

          <section>
            <h2 className="font-bold tracking-[0.15em] text-neon uppercase mb-3">Tus derechos</h2>
            <p className="text-cream/65">
              Podés ejercer tus derechos de acceso, rectificación, supresión, oposición
              y portabilidad escribiendo a info@mikojester.com. También podés presentar
              una reclamación ante la Agencia Española de Protección de Datos (aepd.es).
            </p>
          </section>

          <section>
            <h2 className="font-bold tracking-[0.15em] text-neon uppercase mb-3">Cookies</h2>
            <p className="text-cream/65">
              Este sitio utiliza únicamente cookies técnicas necesarias para el
              funcionamiento de la sesión de administración. No se utilizan cookies
              de seguimiento ni publicidad.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
