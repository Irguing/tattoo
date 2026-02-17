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

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

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
    <main className="bg-sand py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="font-display text-5xl tracking-wide text-green900">
          Reserva tu tattoo
        </h1>

        <p className="mt-3 text-ink/70">
          Cuéntame tu idea y te responderé con disponibilidad y presupuesto.
        </p>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-3xl border border-ink/10 bg-white/50 p-8 shadow-soft"
        >
          <Input label="Nombre" name="name" required />
          <Input label="Email" name="email" type="email" required />
          <Textarea label="Idea del tatuaje" name="idea" required />
          <Input label="Zona del cuerpo" name="placement" />
          <Input label="Tamaño aproximado" name="size" />
          <Input label="Presupuesto estimado" name="budget" />

          {error && <p className="text-sm text-red-500">{error}</p>}

          {success && (
            <p className="text-sm font-semibold text-green700">
              Solicitud enviada correctamente.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-neon px-6 py-3 text-sm font-semibold text-ink shadow-soft hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar solicitud"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Input({
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
      <label className="mb-2 block text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm outline-none focus:border-green700"
      />
    </div>
  );
}

function Textarea({
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
      <label className="mb-2 block text-sm font-semibold text-ink">
        {label}
      </label>
      <textarea
        name={name}
        required={required}
        rows={4}
        className="w-full rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm outline-none focus:border-green700"
      />
    </div>
  );
}
