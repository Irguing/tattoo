"use client";

import Link from "next/link";
import Image from "next/image";
import type { BlogListItem } from "@/types/blog";

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

export default function BlogCard({
  post,
  onTagClick,
}: {
  post: BlogListItem;
  onTagClick?: (tag: string) => void;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white/40 transition hover:shadow-md">
      {/* Image */}
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative overflow-hidden bg-neutral-100">
          {post.coverUrl ? (
            <>
              <div className="pt-[60%]" />
              <Image
                src={post.coverUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </>
          ) : (
            <div className="flex h-40 items-center justify-center text-xs text-neutral-400">
              Sin imagen
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold tracking-tight text-neutral-900">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>

        {post.excerpt ? (
          <p className="mt-2 line-clamp-3 text-sm text-neutral-600">
            {post.excerpt}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <span>{formatDate(post.date)}</span>
          {post.tags.length ? <span className="opacity-40">•</span> : null}
          {post.tags.slice(0, 3).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onTagClick?.(t)}
              className="rounded-full border border-neutral-200 bg-white/60 px-2 py-0.5 text-neutral-700 hover:bg-white/80"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
