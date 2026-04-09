"use client";

import * as React from "react";

type TeaserImage = {
  id: string;
  title: string;
  alt: string | null;
  url: string;
  tags: string | null;
};

export default function GalleryTeaserClient({ images }: { images: TeaserImage[] }) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<TeaserImage | null>(null);

  function openLightbox(img: TeaserImage) { setActive(img); setOpen(true); }
  function closeLightbox() { setOpen(false); setActive(null); }

  React.useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") closeLightbox(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [open]);

  const items = images.length > 0 ? images : Array.from({ length: 6 });

  return (
    <>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const img = images.length > 0 ? (item as TeaserImage) : null;
          return (
            <div
              key={img?.id ?? i}
              onClick={() => img && openLightbox(img)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl comic-border transition-all duration-300 hover:-translate-y-1 hover:shadow-neon"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-panel2">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.url}
                    alt={img.alt ?? img.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="halftone h-full w-full bg-gradient-to-br from-neon/15 via-panel2 to-gold/10" />
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 translate-y-3 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-display text-xl tracking-wide text-gold">
                  {img?.title ?? `Flash #${i + 1}`}
                </p>
                <p className="mt-0.5 text-xs text-cream/60">{img?.tags ?? "Próximamente"}</p>
              </div>

              {/* Corner badge */}
              <div className="absolute right-3 top-3 rounded-full border border-neon/30 bg-bg/80 px-2.5 py-1 text-[10px] font-bold tracking-widest text-neon opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                VER →
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {open && active && (
        <div
          className="fixed inset-0 z-[80] bg-bg/92 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
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
                  className="rounded-xl border border-cream/15 px-3 py-2 text-xs font-bold tracking-widest text-cream/60 transition hover:border-neon/40 hover:text-neon"
                >
                  ESC ✕
                </button>
              </div>
              <div className="bg-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.url}
                  alt={active.alt ?? active.title}
                  className="mx-auto max-h-[78vh] w-auto max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
