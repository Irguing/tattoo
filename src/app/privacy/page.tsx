import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — Miko Jester",
};

export default function PrivacyPage() {
  return (
    <main className="bg-sand min-h-[70vh] py-20">
      <div className="mx-auto max-w-2xl px-6">
        <h1 className="font-display text-4xl tracking-wide text-green900 mb-8">
          Política de Privacidad
        </h1>

        <div className="space-y-6 text-ink/80 leading-relaxed text-sm">
          <section>
            <h2 className="font-semibold text-ink mb-2">Responsable del tratamiento</h2>
            <p>Miko Jester — info@mikojester.com — Madrid, España.</p>
          </section>

          <section>
            <h2 className="font-semibold text-ink mb-2">Datos que recogemos</h2>
            <p>
              Al realizar una reserva o una compra, recogemos tu nombre, dirección de
              correo electrónico y los datos necesarios para completar la transacción.
              No almacenamos datos de tarjetas de crédito — el pago se procesa a través
              de Stripe, que cuenta con certificación PCI-DSS.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-ink mb-2">Finalidad y base legal</h2>
            <p>
              Tratamos tus datos para gestionar reservas y pedidos (ejecución de contrato),
              y para enviarte confirmaciones por correo (interés legítimo). No realizamos
              marketing sin consentimiento previo.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-ink mb-2">Conservación</h2>
            <p>
              Los datos se conservan durante el tiempo necesario para cumplir con la
              finalidad para la que fueron recogidos y con las obligaciones legales
              aplicables.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-ink mb-2">Tus derechos</h2>
            <p>
              Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición
              y portabilidad escribiendo a info@mikojester.com. También puedes presentar
              una reclamación ante la Agencia Española de Protección de Datos (aepd.es).
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-ink mb-2">Cookies</h2>
            <p>
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
