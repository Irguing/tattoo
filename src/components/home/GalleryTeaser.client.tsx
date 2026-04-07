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

  function openLightbox(img: TeaserImage) {
    setActive(img);
    setOpen(true);
  }

  function closeLightbox() {
    setOpen(false);
    setActive(null);
  }

  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
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
              className="group relative overflow-hidden rounded-2xl border border-cream/8 bg-surface shadow-card cursor-pointer"
              onClick={() => img && openLightbox(img)}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-surface2">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.url}
                    alt={img.alt ?? img.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-purple/20 via-dark to-neon/15" />
                )}
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-display text-xl tracking-wide text-cream">
                  {img?.title ?? `Flash #${i + 1}`}
                </p>
                <p className="mt-0.5 text-xs text-cream/60">
                  {img?.tags ?? "Próximamente"}
                </p>
              </div>

              {/* Corner badge */}
              <div className="absolute right-3 top-3 rounded-full bg-dark/70 px-2 py-1 text-[10px] font-bold tracking-widest text-neon opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-sm">
                VER →
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {open && active && (
        <div
          className="fixed inset-0 z-[80] bg-dark/90 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="mx-auto flex h-full max-w-5xl items-center justify-center">
            <div className="w-full overflow-hidden rounded-2xl border border-cream/10 bg-surface shadow-2xl">
              <div className="flex items-center justify-between gap-3 border-b border-cream/10 px-5 py-3">
                <div className="min-w-0">
                  <p className="font-display text-xl tracking-wide text-cream truncate">{active.title}</p>
                  <p className="text-xs text-cream/40 truncate">{active.tags ?? ""}</p>
                </div>
                <button
                  onClick={closeLightbox}
                  className="rounded-xl border border-cream/15 px-3 py-2 text-xs font-bold tracking-widest text-cream/60 hover:border-cream/30 hover:text-cream transition"
                >
                  ESC ✕
                </button>
              </div>
              <div className="bg-dark">
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
