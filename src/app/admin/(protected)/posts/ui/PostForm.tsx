"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { normalizeSlug } from "@/lib/validation/posts";

type Initial = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  tags: string;
  isPublished: boolean;
};

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.set("file", file);

  const res = await fetch("/api/uploads", { method: "POST", body: fd });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || "Upload falló.");
  }
  const data = (await res.json()) as { url: string };
  return data.url;
}

export default function PostForm({
  mode,
  initial,
  action,
}: {
  mode: "create" | "edit";
  initial: Initial;
  action: (formData: FormData) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [coverUrl, setCoverUrl] = useState(initial.coverUrl);
  const [tags, setTags] = useState(initial.tags);
  const [isPublished, setIsPublished] = useState(initial.isPublished);

  const [content, setContent] = useState(initial.content);
  const [contentPreview, setContentPreview] = useState(initial.content);
  const [showPreview, setShowPreview] = useState(false);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);

  const slugTouchedRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const autoSlug = useMemo(() => normalizeSlug(title), [title]);

  useEffect(() => {
    const id = window.setTimeout(() => setContentPreview(content), 200);
    return () => window.clearTimeout(id);
  }, [content]);

  function insertAtCursor(text: string) {
    const el = textareaRef.current;
    if (!el) {
      setContent((prev) => prev + text);
      return;
    }
    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;
    const next = content.slice(0, start) + text + content.slice(end);
    setContent(next);

    requestAnimationFrame(() => {
      el.focus();
      const pos = start + text.length;
      el.setSelectionRange(pos, pos);
    });
  }

  function onSubmit(formData: FormData) {
    setError(null);

    formData.set("title", title);
    formData.set("slug", slug);
    formData.set("excerpt", excerpt);
    formData.set("coverUrl", coverUrl);
    formData.set("tags", tags);
    formData.set("content", content);

    if (isPublished) formData.set("isPublished", "on");
    else formData.delete("isPublished");

    startTransition(async () => {
      try {
        await action(formData);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error inesperado.");
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-lg border p-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título</label>
          <input
            name="title"
            value={title}
            onChange={(e) => {
              const nextTitle = e.target.value;
              setTitle(nextTitle);
              if (!slugTouchedRef.current) setSlug(normalizeSlug(nextTitle));
            }}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Título del post"
            required
          />
          <div className="text-xs text-neutral-500">
            Slug sugerido: <span className="font-mono">{autoSlug || "—"}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Slug</label>
          <input
            name="slug"
            value={slug}
            onChange={(e) => {
              slugTouchedRef.current = true;
              setSlug(e.target.value);
            }}
            className="w-full rounded-md border px-3 py-2 text-sm font-mono"
            placeholder="mi-post"
            required
          />
          <div className="text-xs text-neutral-500">a-z, 0-9 y guiones.</div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Excerpt</label>
        <textarea
          name="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="min-h-[80px] w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Resumen corto (opcional)"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Imagen destacada (cover)</label>

          <input
            name="coverUrl"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="/uploads/..."
          />

          <div className="flex items-center gap-2">
        <input
  type="file"
  accept="image/*"
  className="text-sm"
  onChange={(e) => {
    const input = e.currentTarget;          // ✅ captura referencia estable
    const file = input.files?.[0];
    if (!file) return;

    setError(null);
    setUploadingCover(true);

    (async () => {
      try {
        const url = await uploadFile(file);
        setCoverUrl(url);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error subiendo cover.");
      } finally {
        setUploadingCover(false);
        // ✅ evita "Cannot set properties of null"
        try {
          input.value = "";
        } catch {}
      }
    })();
  }}
/>

            {uploadingCover && <span className="text-xs text-neutral-500">Subiendo...</span>}
          </div>

          {coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="Cover preview" className="h-32 w-full rounded-md border object-cover" />
          )}

          <div className="text-xs text-neutral-500">
            Se guarda como <span className="font-mono">Post.coverUrl</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tags (CSV)</label>
          <input
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="tattoo, blackwork"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isPublished"
          name="isPublished"
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="isPublished" className="text-sm">
          Published
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium">Content (Markdown)</label>

          <div className="flex items-center gap-2">
<label className="rounded-md border px-3 py-1.5 text-xs hover:bg-neutral-50 cursor-pointer">
  Insertar imagen
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const input = e.currentTarget;
      const file = input.files?.[0];
      if (!file) return;

      setError(null);
      setUploadingInline(true);

      (async () => {
        try {
          const url = await uploadFile(file);
          insertAtCursor(`\n\n![${file.name}](${url})\n\n`);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : "Error subiendo imagen.");
        } finally {
          setUploadingInline(false);
          try {
            input.value = "";
          } catch {}
        }
      })();
    }}
  />
</label>

            {uploadingInline && <span className="text-xs text-neutral-500">Subiendo...</span>}

            <button
              type="button"
              onClick={() => insertAtCursor("\n\n---\n\n")}
              className="rounded-md border px-3 py-1.5 text-xs hover:bg-neutral-50"
            >
              Separador
            </button>

            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="rounded-md border px-3 py-1.5 text-xs hover:bg-neutral-50"
            >
              {showPreview ? "Ocultar preview" : "Ver preview (raw)"}
            </button>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[320px] w-full rounded-md border px-3 py-2 text-sm font-mono"
          placeholder="# Título\n\nContenido..."
          required
        />

        {showPreview && (
          <div className="rounded-md border bg-neutral-50 p-3">
            <div className="mb-2 text-xs font-medium text-neutral-500">Preview (raw)</div>
            <pre className="whitespace-pre-wrap break-words text-sm text-neutral-700">{contentPreview}</pre>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Guardando..." : mode === "create" ? "Crear" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
