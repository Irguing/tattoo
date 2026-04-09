"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ImageItem = { id: string; title: string; alt: string | null; url: string; tags: string | null };

function setParam(params: URLSearchParams, key: string, value: string) {
  const p = new URLSearchParams(params.toString());
  if (!value) p.delete(key); else p.set(key, value);
  return p;
}

export default function DesignsGalleryClient({
  images, tags, activeTag, initialQ,
}: { images: ImageItem[]; tags: string[]; activeTag: string; initialQ: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<ImageItem | null>(null);

  function openLightbox(img: ImageItem) { setActive(img); setOpen(true); }
  function closeLightbox() { setOpen(false); setActive(null); }

  React.useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") closeLightbox(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [open]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Tag pills */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => router.push(`${pathname}?${setParam(searchParams, "tag", "").toString()}`)}
            className={[
              "rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-[0.15em] transition",
              !activeTag
                ? "border-neon bg-neon/15 text-neon"
                : "border-cream/15 text-cream/45 hover:border-neon/40 hover:text-neon",
            ].join(" ")}
          >
            TODOS
          </button>
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => router.push(`${pathname}?${setParam(searchParams, "tag", t).toString()}`)}
              className={[
                "rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-[0.15em] uppercase transition",
                activeTag === t
                  ? "border-neon bg-neon/15 text-neon"
                  : "border-cream/15 text-cream/45 hover:border-neon/40 hover:text-neon",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <input
            defaultValue={initialQ}
            placeholder="Buscar..."
            className="w-full rounded-xl border border-cream/10 bg-panel px-3 py-2 text-sm text-cream placeholder-cream/30 outline-none focus:border-neon/40 md:w-[240px]"
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              const val = (e.currentTarget.value ?? "").trim();
              router.push(`${pathname}?${setParam(searchParams, "q", val).toString()}`);
            }}
          />
          <button
            type="button"
            className="rounded-xl border border-cream/10 bg-panel px-4 py-2 text-xs font-bold tracking-widest text-cream/45 transition hover:border-neon/30 hover:text-neon"
            onClick={() => router.push(`${pathname}?${setParam(searchParams, "q", "").toString()}`)}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Grid */}
      {images.length === 0 ? (
        <div className="panel-card rounded-2xl p-8 text-center text-cream/40">
          No hay imágenes para estos filtros.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.id}
              onClick={() => openLightbox(img)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl comic-border transition-all duration-300 hover:-translate-y-1 hover:shadow-neon"
            >
              <div className="aspect-[4/3] overflow-hidden bg-panel2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url} alt={img.alt ?? img.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-display text-xl tracking-wide text-gold">{img.title}</p>
                <p className="mt-0.5 text-xs text-cream/55">{img.tags ?? ""}</p>
              </div>
              <div className="absolute right-3 top-3 rounded-full border border-neon/30 bg-bg/80 px-2.5 py-1 text-[10px] font-bold tracking-widest text-neon opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                VER →
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {open && active && (
        <div
          className="fixed inset-0 z-[80] bg-bg/92 p-4 backdrop-blur-md"
          role="dialog" aria-modal="true"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
        >
          <div className="mx-auto flex h-full max-w-5xl items-center justify-center">
            <div className="w-full overflow-hidden rounded-2xl comic-border bg-panel shadow-neon">
              <div className="flex items-center justify-between gap-3 border-b border-neon/15 px-5 py-3">
                <div className="min-w-0">
                  <p className="font-display text-xl tracking-wide text-gold truncate">{active.title}</p>
                  <p className="text-xs text-cream/40 truncate">{active.tags ?? ""}</p>
                </div>
                <button
                  onClick={closeLightbox}
                  className="rounded-xl border border-cream/15 px-3 py-2 text-xs font-bold tracking-widest text-cream/50 transition hover:border-neon/40 hover:text-neon"
                >
                  ESC ✕
                </button>
              </div>
              <div className="bg-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.url} alt={active.alt ?? active.title}
                  className="mx-auto max-h-[78vh] w-auto max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
