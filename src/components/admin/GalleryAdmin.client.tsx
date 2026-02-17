"use client";

import * as React from "react";

type GalleryImage = {
  id: string;
  title: string;
  alt: string | null;
  tags: string | null;
  url: string;
  filename: string;
  mime: string;
  size: number;
  isPublished: boolean;
  createdAt: Date;
};

function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function GalleryAdminClient({
  initialImages,
}: {
  initialImages: GalleryImage[];
}) {
  const [images, setImages] = React.useState<GalleryImage[]>(initialImages);

  const [file, setFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState("");
  const [alt, setAlt] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [isPublished, setIsPublished] = React.useState(true);

  const [q, setQ] = React.useState("");
  const [onlyPublished, setOnlyPublished] = React.useState(false);

  const [busyUpload, setBusyUpload] = React.useState(false);
  const [busyDeleteId, setBusyDeleteId] = React.useState<string | null>(null);

  async function refreshList() {
    const res = await fetch("/api/gallery", { cache: "no-store" });
    const data = (await res.json()) as { images?: GalleryImage[] };
    setImages(data.images ?? []);
  }

  async function deleteImage(id: string) {
    const ok = confirm(
      "¿Eliminar esta imagen?\n\nEsto borrará el archivo en /public/uploads y el registro en DB."
    );
    if (!ok) return;

    setBusyDeleteId(id);

    // Optimistic UI
    const prev = images;
    setImages((curr) => curr.filter((x) => x.id !== id));

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        // rollback
        setImages(prev);
        throw new Error(`Delete failed (${res.status}): ${text.slice(0, 160)}`);
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error deleting image");
    } finally {
      setBusyDeleteId(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      alert("Selecciona una imagen.");
      return;
    }
    if (!title.trim()) {
      alert("Title es obligatorio.");
      return;
    }

    setBusyUpload(true);
    try {
      // 1) Upload file (multipart/form-data)
      const fd = new FormData();
      fd.append("file", file);

      const up = await fetch("/api/gallery/upload", { method: "POST", body: fd });
      const upText = await up.text();
      if (!up.ok) {
        throw new Error(`Upload failed (${up.status}): ${upText.slice(0, 180)}`);
      }

      const uploaded = JSON.parse(upText) as {
        url: string;
        filename: string;
        mime: string;
        size: number;
      };

      // 2) Create DB record (json)
      const create = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          alt: alt.trim() || null,
          tags: tags.trim() || null,
          isPublished,
          ...uploaded,
        }),
      });

      const createText = await create.text();
      if (!create.ok) {
        throw new Error(`DB insert failed (${create.status}): ${createText.slice(0, 180)}`);
      }

      const createdJson = JSON.parse(createText) as { image?: GalleryImage };
      if (createdJson.image) {
        // Insert instantáneo arriba (optimistic real)
        setImages((prev) => [createdJson.image!, ...prev]);
      } else {
        // Fallback si el payload no vino como esperamos
        await refreshList();
      }

      // Reset form
      setFile(null);
      setTitle("");
      setAlt("");
      setTags("");
      setIsPublished(true);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error uploading image");
    } finally {
      setBusyUpload(false);
    }
  }

  const filtered = images.filter((img) => {
    if (onlyPublished && !img.isPublished) return false;
    if (!q.trim()) return true;
    const needle = q.toLowerCase();
    const hay = `${img.title} ${img.tags ?? ""} ${img.filename}`.toLowerCase();
    return hay.includes(needle);
  });

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Upload image</h3>
            <p className="mt-1 text-sm text-gray-600">
              Guarda el archivo en{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5">/public/uploads</code> y la
              metadata en DB.
            </p>
          </div>

          <button
            type="submit"
            disabled={busyUpload}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {busyUpload ? "Subiendo..." : "Subir"}
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Imagen</label>
            <input
              type="file"
              accept="image/*"
              className="block w-full rounded-xl border bg-white px-3 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-gray-800"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-gray-500">
              {file ? `${file.name} · ${formatBytes(file.size)}` : "Selecciona un archivo .png/.jpg/.webp"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Sunset Tattoo Flash"
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Alt</label>
            <input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Texto alternativo SEO"
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Tags</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="blackwork, fineline, skull"
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="flex items-center gap-2 md:col-span-2">
            <input
              id="published"
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="published" className="text-sm text-gray-700">
              Publicado
            </label>
          </div>
        </div>
      </form>

      {/* Search */}
      <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por title / tags / filename..."
          className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 md:max-w-md"
        />

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={onlyPublished}
            onChange={(e) => setOnlyPublished(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          Solo publicados
        </label>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-gray-600 shadow-sm">
          No hay imágenes.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((img) => (
            <div key={img.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="aspect-[4/3] bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt ?? img.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-gray-900">{img.title}</div>
                    <div className="mt-1 truncate text-xs text-gray-500">
                      {img.filename} · {formatBytes(img.size)}
                    </div>
                  </div>

                  <span
                    className={cx(
                      "shrink-0 rounded-full border px-2 py-1 text-xs font-medium",
                      img.isPublished
                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700"
                        : "border-amber-500/25 bg-amber-500/10 text-amber-800"
                    )}
                  >
                    {img.isPublished ? "published" : "draft"}
                  </span>
                </div>

                {img.tags ? (
                  <div className="mt-3 text-xs text-gray-600">
                    <span className="font-medium text-gray-900">Tags:</span> {img.tags}
                  </div>
                ) : null}

                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => deleteImage(img.id)}
                    disabled={busyDeleteId === img.id}
                    className="rounded-xl border px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                  >
                    {busyDeleteId === img.id ? "Eliminando..." : "Delete"}
                  </button>

                  <a
                    href={img.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-gray-700 underline decoration-gray-300 hover:text-gray-900"
                    title="Abrir imagen"
                  >
                    Open
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
