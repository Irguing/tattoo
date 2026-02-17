import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export default function BlogTeaser() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <section className="bg-sand py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-4xl text-green900">From the Studio</h2>
          <Link href="/blog" className="text-sm font-semibold text-green700 hover:text-green500">
            View all →
          </Link>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group rounded-2xl border border-ink/10 bg-white/50 p-6 hover:bg-white/70 transition"
            >
              <p className="text-xs font-semibold text-ink/50">{p.frontmatter.date}</p>
              <h3 className="mt-3 text-xl font-semibold text-green900 group-hover:text-green700 transition-colors">
                {p.frontmatter.title}
              </h3>
              {p.frontmatter.excerpt ? (
                <p className="mt-3 text-sm text-ink/70 leading-relaxed">{p.frontmatter.excerpt}</p>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
