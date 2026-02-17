"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ImageItem = {
  id: string;
  title: string;
  alt: string | null;
  url: string;
  tags: string | null;
};

function setParam(params: URLSearchParams, key: string, value: string) {
  const p = new URLSearchParams(params.toString());
  if (!value) p.delete(key);
  else p.set(key, value);
  return p;
}

export default function DesignsGalleryClient({
  images,
  tags,
  activeTag,
  initialQ,
}: {
  images: ImageItem[];
  tags: string[];
  activeTag: string;
  initialQ: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<ImageItem | null>(null);

  function openLightbox(img: ImageItem) {
    setActive(img);
    setOpen(true);
  }
  function closeLightbox() {
    setOpen(false);
    setActive(null);
  }

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const next = setParam(searchParams, "tag", "");
              router.push(`${pathname}?${next.toString()}`);
            }}
            className={[
              "rounded-full border px-3 py-1 text-sm font-semibold",
              !activeTag ? "bg-green900 text-sand border-green900" : "border-ink/15 bg-white text-green900 hover:bg-sand",
            ].join(" ")}
          >
            All
          </button>

          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                const next = setParam(searchParams, "tag", t);
                router.push(`${pathname}?${next.toString()}`);
              }}
              className={[
                "rounded-full border px-3 py-1 text-sm font-semibold transition",
                activeTag === t
                  ? "bg-green900 text-sand border-green900"
                  : "border-ink/15 bg-white text-green900 hover:bg-sand",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            defaultValue={initialQ}
            placeholder="Buscar..."
            className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 md:w-[260px]"
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              const value = (e.currentTarget.value ?? "").trim();
              const next = setParam(searchParams, "q", value);
              router.push(`${pathname}?${next.toString()}`);
            }}
          />
          <button
            type="button"
            className="rounded-xl bg-neon px-4 py-2 text-sm font-semibold text-ink hover:opacity-90"
            onClick={() => {
              const next = setParam(searchParams, "q", "");
              router.push(`${pathname}?${next.toString()}`);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Grid */}
      {images.length === 0 ? (
        <div className="rounded-2xl border border-ink/10 bg-white p-6 text-ink/70">
          No hay imágenes para estos filtros.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="group overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-soft"
            >
              <button
                type="button"
                onClick={() => openLightbox(img)}
                className="block w-full text-left"
                aria-label={`Ver ${img.title}`}
              >
                <div className="aspect-[4/3] bg-sand/30">
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
                <p className="font-display text-2xl tracking-wide text-green900">{img.title}</p>
                <p className="mt-1 text-sm text-ink/70">
                  {img.tags ? img.tags : " "}
                </p>

                <button
                  type="button"
                  onClick={() => openLightbox(img)}
                  className="mt-4 text-sm font-semibold text-green700 hover:text-green500"
                >
                  Ver detalle →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {open && active ? (
        <div
          className="fixed inset-0 z-[80] bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="mx-auto flex h-full max-w-5xl items-center justify-center">
            <div className="w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{active.title}</div>
                  <div className="truncate text-xs text-white/70">{active.tags ?? " "}</div>
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
    </div>
  );
}
