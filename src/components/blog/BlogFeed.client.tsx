"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type BlogFeedItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverUrl: string | null;
  tags: string | null; // CSV
  createdAt: string; // ISO
};

type Props = {
  initialItems: BlogFeedItem[];
  initialNextCursor: string | null;
  initialQuery: { q: string; tag: string };
  allTags: string[]; // ✅ NUEVO: tags globales desde DB
};

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function BlogFeedClient({
  initialItems,
  initialNextCursor,
  initialQuery,
  allTags,
}: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState<BlogFeedItem[]>(() => initialItems ?? []);
  const [nextCursor, setNextCursor] = useState<string | null>(() => initialNextCursor ?? null);

  // URL source of truth (fallback a initialQuery)
  const q = (sp.get("q") ?? initialQuery.q ?? "").trim();
  const tag = (sp.get("tag") ?? initialQuery.tag ?? "").trim();

  // input controlado (solo UI; la búsqueda real se activa al push de URL)
  const [qDraft, setQDraft] = useState<string>(() => q);

  const baseParams = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (tag) p.set("tag", tag);
    return p;
  }, [q, tag]);

  // ✅ Tags globales (no dependen de items paginados)
  const availableTags = useMemo(() => {
    return (allTags ?? []).slice(0, 12);
  }, [allTags]);

  function pushFilters(next: { q?: string; tag?: string }) {
    const p = new URLSearchParams();
    const nextQ = (next.q ?? "").trim();
    const nextTag = (next.tag ?? "").trim();

    if (nextQ) p.set("q", nextQ);
    if (nextTag) p.set("tag", nextTag);

    // ✅ clave: al cambiar filtros, NO mantenemos cursor
    startTransition(() => {
      router.push(`/blog?${p.toString()}`);
    });
  }

  function onSubmitSearch(e: React.FormEvent) {
    e.preventDefault();
    pushFilters({ q: qDraft, tag });
  }

  function onPickTag(t: string) {
    const nextTag = tag && t.toLowerCase() === tag.toLowerCase() ? "" : t;
    pushFilters({ q: qDraft, tag: nextTag });
  }

  function onClear() {
    setQDraft("");
    pushFilters({ q: "", tag: "" });
  }

  async function onLoadMore() {
    if (!nextCursor) return;

    const p = new URLSearchParams(baseParams.toString());
    p.set("cursor", nextCursor);

    startTransition(async () => {
      const res = await fetch(`/api/blog/page?${p.toString()}`, {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) return;

      const data = (await res.json()) as {
        items: BlogFeedItem[];
        nextCursor: string | null;
      };

      setItems((prev) => [...prev, ...(data.items ?? [])]);
      setNextCursor(data.nextCursor ?? null);

      // mantenemos cursor en URL solo para paginación
      router.replace(`/blog?${p.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="rounded-2xl border bg-white p-4">
        <form onSubmit={onSubmitSearch} className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <input
              value={qDraft}
              onChange={(e) => setQDraft(e.target.value)}
              placeholder="Buscar..."
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
              aria-label="Buscar en el blog"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={onClear}
              disabled={isPending && (!q && !tag)}
              className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
            >
              Limpiar
            </button>
          </div>
        </form>

        {availableTags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {availableTags.map((t) => {
              const active = !!tag && t.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onPickTag(t)}
                  className={[
                    "rounded-full border px-3 py-1 text-xs transition",
                    active ? "bg-neutral-900 text-white" : "bg-white text-neutral-800 hover:bg-neutral-50",
                  ].join(" ")}
                >
                  {t}
                </button>
              );
            })}
          </div>
        ) : null}

        {(q || tag) ? (
          <div className="mt-3 text-xs text-neutral-500">
            Filtros activos:
            {q ? <span className="ml-2">q: “{q}”</span> : null}
            {tag ? <span className="ml-2">tag: “{tag}”</span> : null}
          </div>
        ) : null}
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(items ?? []).map((p) => {
          const tags = parseTags(p.tags);
          const href = `/blog/${p.slug}`;

          return (
            <Link
              key={p.id}
              href={href}
              className="group overflow-hidden rounded-2xl border bg-white transition hover:shadow-md"
            >
              <div className="relative aspect-[16/10] w-full bg-neutral-100">
                {p.coverUrl ? (
                  <Image
                    src={p.coverUrl}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition group-hover:scale-[1.02]"
                  />
                ) : null}
              </div>

              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-full border px-2 py-0.5 text-xs text-neutral-700">
                      {t}
                    </span>
                  ))}
                </div>

                <h3 className="mt-3 text-lg font-semibold tracking-tight text-neutral-900">
                  {p.title}
                </h3>

                {p.excerpt ? (
                  <p className="mt-2 line-clamp-3 text-sm text-neutral-600">
                    {p.excerpt}
                  </p>
                ) : null}

                <div className="mt-4 text-xs text-neutral-500">
                  {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onLoadMore}
          disabled={!nextCursor || isPending}
          className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
        >
          {isPending ? "Cargando..." : nextCursor ? "Cargar más" : "No hay más"}
        </button>
      </div>
    </div>
  );
}
