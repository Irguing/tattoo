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

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-[24px] border border-sand/15 bg-sand/5 shadow-soft"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-sand/10 to-neon/10" />
              <div className="p-4">
                <p className="font-display text-2xl tracking-wide">Flash #{i + 1}</p>
                <p className="mt-1 text-sm text-sand/75">Próximamente</p>
                <button
                  type="button"
                  className="mt-4 text-sm font-semibold text-neon"
                  onClick={() => {}}
                >
                  Ver detalle →
                </button>
              </div>
            </div>
          ))
        ) : (
          images.map((img) => (
            <div
              key={img.id}
              className="group overflow-hidden rounded-[24px] border border-sand/15 bg-sand/5 shadow-soft"
            >
              <button
                type="button"
                onClick={() => openLightbox(img)}
                className="block w-full text-left"
                aria-label={`Ver ${img.title}`}
              >
                <div className="aspect-[4/3] bg-sand/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt ?? img.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              </button>

              <div className="p-4">
                <p className="font-display text-2xl tracking-wide">{img.title}</p>
                <p className="mt-1 text-sm text-sand/75">
                  {img.tags ? img.tags : "Ilustrado · Color / línea fina"}
                </p>

                <button
                  type="button"
                  onClick={() => openLightbox(img)}
                  className="mt-4 text-sm font-semibold text-neon"
                >
                  Ver detalle →
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lightbox */}
      {open && active ? (
        <div
          className="fixed inset-0 z-[80] bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Lightbox"
          onMouseDown={(e) => {
            // cerrar si clicas fuera del contenido
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="mx-auto flex h-full max-w-5xl items-center justify-center">
            <div className="w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{active.title}</div>
                  <div className="truncate text-xs text-white/70">
                    {active.tags ? active.tags : " "}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeLightbox}
                  className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                >
                  Cerrar (Esc)
                </button>
              </div>

              <div className="bg-black">
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
      ) : null}
    </>
  );
}
