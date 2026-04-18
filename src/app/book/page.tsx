"use client";

import { useRef, useState } from "react";

type ApiErrorShape = { error?: unknown };

function getErrorMessageFromUnknown(data: unknown, fallback: string): string {
  if (typeof data === "object" && data !== null && "error" in data) {
    const err = (data as ApiErrorShape).error;
    return typeof err === "string" ? err : String(err);
  }
  return fallback;
}

const TRUST_CARDS = [
  {
    icon: "⭐",
    title: "4.9 en Google",
    desc: "Más de 80 reseñas verificadas",
    color: "gold",
  },
  {
    icon: "🎨",
    title: "Diseño 100% tuyo",
    desc: "Nunca repetimos un diseño",
    color: "neon",
  },
  {
    icon: "📍",
    title: "Madrid Centro",
    desc: "Estudio privado, ambiente íntimo",
    color: "neon",
  },
  {
    icon: "⚡",
    title: "Respuesta rápida",
    desc: "Siempre en menos de 48h",
    color: "gold",
  },
];

const FAQS = [
  {
    q: "¿Cuánto cuesta un tatuaje?",
    a: "Depende del tamaño, detalle y tiempo de sesión. Rellená el formulario para un estimado preciso.",
  },
  {
    q: "¿Cuánto tiempo dura la sesión?",
    a: "Una pieza pequeña toma 1–2 horas. Mangas o espaldas requieren múltiples sesiones.",
  },
  {
    q: "¿Necesito dejar seña?",
    a: "Sí, pedimos una seña para reservar la fecha y comenzar el diseño. Se descuenta del precio final.",
  },
];

export default function BookPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      idea: String(formData.get("idea") ?? "").trim(),
      placement: String(formData.get("placement") ?? "").trim() || null,
      size: String(formData.get("size") ?? "").trim() || null,
      budget: String(formData.get("budget") ?? "").trim() || null,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: unknown = null;
      try { data = text ? JSON.parse(text) : null; } catch { data = null; }

      if (!res.ok) {
        const fallback = `Error ${res.status}: el servidor devolvió una respuesta no-JSON o inválida.`;
        throw new Error(getErrorMessageFromUnknown(data, fallback));
      }

      setSuccess(true);
      formRef.current?.reset();
    } catch (err: unknown) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative overflow-hidden bg-bg min-h-screen pt-28 pb-20">
      <div className="halftone absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-neon/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gold/6 blur-[80px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

          {/* ── LEFT: FORM ── */}
          <div>
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-neon/25 bg-neon/8 px-4 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
                <span className="text-xs font-bold tracking-[0.25em] text-neon">RESERVAS · CITAS · CONSULTAS</span>
              </span>
              <h1 className="mt-4 font-display text-6xl tracking-wide text-gold md:text-7xl">
                RESERVÁ
              </h1>
              <p className="mt-2 max-w-xl text-sm text-cream/50">
                Contame tu idea y te respondo con disponibilidad y presupuesto.
              </p>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="panel-card rounded-3xl p-8 space-y-6"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <BookInput label="Nombre" name="name" required />
                <BookInput label="Email" name="email" type="email" required />
              </div>
              <BookTextarea label="Idea del tatuaje" name="idea" required />
              <div className="grid gap-6 sm:grid-cols-2">
                <BookInput label="Zona del cuerpo" name="placement" />
                <BookInput label="Tamaño aproximado" name="size" />
              </div>
              <BookInput
                label="Presupuesto estimado"
                name="budget"
                hint="Sin presupuesto fijo? Escribí 'A consultar'"
              />

              {error && (
                <p className="rounded-xl border border-rust/30 bg-rust/10 px-4 py-3 text-sm text-rust">
                  {error}
                </p>
              )}

              {success && (
                <p className="rounded-xl border border-neon/30 bg-neon/10 px-4 py-3 text-sm font-bold text-neon">
                  ✓ Solicitud enviada. ¡Te contactamos en menos de 48h!
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full border-2 border-neon bg-neon px-6 py-4 text-sm font-bold tracking-[0.15em] text-bg shadow-neon transition-all duration-300 hover:bg-transparent hover:text-neon disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "ENVIANDO..." : "ENVIAR SOLICITUD →"}
              </button>

              <p className="text-center text-xs text-cream/25">
                Respondemos en 24–48 h · Sin compromiso · Sin lista de espera
              </p>
            </form>
          </div>

          {/* ── RIGHT: TRUST SIDEBAR ── */}
          <div className="flex flex-col gap-6 lg:pt-24">
            <h2 className="font-display text-2xl tracking-wide text-gold">
              ¿POR QUÉ MIKO?
            </h2>

            {/* Trust cards */}
            <div className="flex flex-col gap-3">
              {TRUST_CARDS.map((c) => (
                <div
                  key={c.title}
                  className={`flex items-start gap-4 rounded-2xl border bg-panel p-4 transition-all duration-200 hover:-translate-y-0.5 ${
                    c.color === "neon" ? "border-neon/15 hover:border-neon/30" : "border-gold/15 hover:border-gold/30"
                  }`}
                >
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className={`text-sm font-bold ${c.color === "neon" ? "text-neon" : "text-gold"}`}>
                      {c.title}
                    </p>
                    <p className="mt-0.5 text-xs text-cream/55">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Instagram proof */}
            <div className="rounded-2xl border border-cream/8 bg-panel p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">📸</span>
                <div>
                  <p className="text-sm font-bold text-cream">@mikojesterink</p>
                  <p className="text-xs text-neon">12K seguidores</p>
                </div>
                <a
                  href="https://www.instagram.com/mikojesterink/"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto rounded-full border border-neon/30 px-3 py-1 text-[10px] font-bold tracking-widest text-neon transition hover:bg-neon/10"
                >
                  VER
                </a>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-panel2 border border-cream/8" />
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold tracking-[0.4em] text-cream/30 uppercase">Preguntas frecuentes</p>
              {FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-cream/8 bg-panel overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-xs font-bold tracking-wide text-cream/70 transition hover:text-cream"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-neon transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-cream/8 px-4 py-3">
                      <p className="text-xs leading-relaxed text-cream/50">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function BookInput({
  label,
  name,
  type = "text",
  required,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold tracking-[0.15em] text-cream/60 uppercase">
        {label}{required && <span className="ml-1 text-neon">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-2xl border border-cream/10 bg-panel2 px-4 py-3 text-sm text-cream placeholder-cream/25 outline-none transition focus:border-neon/40 focus:ring-0"
      />
      {hint && <p className="mt-1.5 text-[11px] text-cream/35">{hint}</p>}
    </div>
  );
}

function BookTextarea({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold tracking-[0.15em] text-cream/60 uppercase">
        {label}{required && <span className="ml-1 text-neon">*</span>}
      </label>
      <textarea
        name={name}
        required={required}
        rows={5}
        className="w-full rounded-2xl border border-cream/10 bg-panel2 px-4 py-3 text-sm text-cream placeholder-cream/25 outline-none transition focus:border-neon/40 focus:ring-0 resize-none"
      />
    </div>
  );
}
