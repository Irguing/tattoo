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

export default function BookPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

      <div className="relative mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="mb-10">
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

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="panel-card rounded-3xl p-8 space-y-6"
        >
          <BookInput label="Nombre" name="name" required />
          <BookInput label="Email" name="email" type="email" required />
          <BookTextarea label="Idea del tatuaje" name="idea" required />
          <BookInput label="Zona del cuerpo" name="placement" />
          <BookInput label="Tamaño aproximado" name="size" />
          <BookInput label="Presupuesto estimado" name="budget" />

          {error && (
            <p className="rounded-xl border border-rust/30 bg-rust/10 px-4 py-3 text-sm text-rust">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-xl border border-neon/30 bg-neon/10 px-4 py-3 text-sm font-bold text-neon">
              ✓ Solicitud enviada correctamente. ¡Te contactamos pronto!
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
            Respondemos en 24–48 h · Sin compromiso
          </p>
        </form>
      </div>
    </main>
  );
}

function BookInput({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
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
