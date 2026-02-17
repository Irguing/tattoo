import Link from "next/link";
import type { BlogListItem } from "@/types/blog";

export default function BlogTeaser({ post }: { post?: BlogListItem }) {
  if (!post) return null;

  return (
    <article className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-5">
      <h3 className="text-lg font-semibold">
        <Link className="hover:underline" href={`/blog/${post.slug}`}>
          {post.title}
        </Link>
      </h3>

      {post.excerpt ? (
        <p className="mt-2 text-sm text-neutral-400">{post.excerpt}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs text-neutral-200"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}
