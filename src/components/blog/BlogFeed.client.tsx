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
  allTags: string[];
};

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(",").map((t) => t.trim()).filter(Boolean);
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

  const q = (sp.get("q") ?? initialQuery.q ?? "").trim();
  const tag = (sp.get("tag") ?? initialQuery.tag ?? "").trim();
  const [qDraft, setQDraft] = useState<string>(() => q);

  const baseParams = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (tag) p.set("tag", tag);
    return p;
  }, [q, tag]);

  const availableTags = useMemo(() => (allTags ?? []).slice(0, 12), [allTags]);

  function pushFilters(next: { q?: string; tag?: string }) {
    const p = new URLSearchParams();
    const nextQ = (next.q ?? "").trim();
    const nextTag = (next.tag ?? "").trim();
    if (nextQ) p.set("q", nextQ);
    if (nextTag) p.set("tag", nextTag);
    startTransition(() => { router.push(`/blog?${p.toString()}`); });
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
      const res = await fetch(`/api/blog/page?${p.toString()}`, { method: "GET", cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { items: BlogFeedItem[]; nextCursor: string | null };
      setItems((prev) => [...prev, ...(data.items ?? [])]);
      setNextCursor(data.nextCursor ?? null);
      router.replace(`/blog?${p.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="rounded-2xl border border-cream/10 bg-panel p-4 space-y-4">
        <form onSubmit={onSubmitSearch} className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <input
              value={qDraft}
              onChange={(e) => setQDraft(e.target.value)}
              placeholder="Buscar..."
              className="w-full rounded-xl border border-cream/10 bg-panel2 px-3 py-2 text-sm text-cream placeholder-cream/30 outline-none focus:border-neon/40"
              aria-label="Buscar en el blog"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl border border-neon/30 bg-neon/10 px-4 py-2 text-sm font-bold tracking-widest text-neon transition hover:bg-neon/20 disabled:opacity-50"
            >
              BUSCAR
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-xl border border-cream/10 px-4 py-2 text-sm font-bold tracking-widest text-cream/40 transition hover:border-neon/30 hover:text-neon disabled:opacity-50"
            >
              ✕
            </button>
          </div>
        </form>

        {availableTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {availableTags.map((t) => {
              const active = !!tag && t.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onPickTag(t)}
                  className={[
                    "rounded-full border px-3 py-1 text-[11px] font-bold tracking-[0.15em] uppercase transition",
                    active
                      ? "border-neon bg-neon/15 text-neon"
                      : "border-cream/15 text-cream/45 hover:border-neon/40 hover:text-neon",
                  ].join(" ")}
                >
                  {t}
                </button>
              );
            })}
          </div>
        )}

        {(q || tag) && (
          <div className="text-xs text-cream/35">
            Filtros activos:
            {q && <span className="ml-2 text-neon/70">q: &ldquo;{q}&rdquo;</span>}
            {tag && <span className="ml-2 text-neon/70">tag: &ldquo;{tag}&rdquo;</span>}
          </div>
        )}
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="panel-card rounded-2xl p-8 text-center text-cream/40">
          No hay posts para estos filtros.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => {
            const tags = parseTags(p.tags);
            const href = `/blog/${p.slug}`;
            const date = new Date(p.createdAt).toLocaleDateString("es-ES", {
              year: "numeric", month: "short", day: "2-digit",
            });

            return (
              <Link
                key={p.id}
                href={href}
                className="group relative flex flex-col overflow-hidden rounded-2xl comic-border bg-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-neon"
              >
                {/* Cover */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-panel2">
                  {p.coverUrl ? (
                    <Image
                      src={p.coverUrl}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="halftone flex h-full items-center justify-center bg-gradient-to-br from-neon/10 to-gold/5">
                      <span className="font-display text-2xl text-cream/15">SIN IMAGEN</span>
                    </div>
                  )}
                  {/* Tags overlay top-left */}
                  {tags.length > 0 && (
                    <span className="absolute left-3 top-3 rounded-full border border-neon/30 bg-bg/80 px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-neon backdrop-blur-sm uppercase">
                      {tags[0]}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-semibold text-cream group-hover:text-neon leading-snug transition-colors">
                    {p.title}
                  </h3>
                  {p.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-cream/50">{p.excerpt}</p>
                  )}
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-xs text-cream/35">{date}</span>
                    <span className="text-[11px] font-bold tracking-widest text-neon/60 group-hover:text-neon transition-colors">
                      LEER →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Load more */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onLoadMore}
          disabled={!nextCursor || isPending}
          className="rounded-full border border-neon/30 bg-neon/10 px-8 py-3 text-sm font-bold tracking-widest text-neon transition hover:bg-neon/20 disabled:opacity-40"
        >
          {isPending ? "CARGANDO..." : nextCursor ? "CARGAR MÁS" : "NO HAY MÁS"}
        </button>
      </div>
    </div>
  );
}
