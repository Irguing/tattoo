import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TogglePublishButton from "./ui/TogglePublishButton";
import { togglePublish } from "./actions";

export const dynamic = "force-dynamic";

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return "";
}

function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;

  const q = first(sp.q).trim();
  const status = first(sp.status).trim(); // "", "published", "draft"

  const where: {
    OR?: Array<
      | { title: { contains: string } }
      | { slug: { contains: string } }
      | { excerpt: { contains: string } }
      | { content: { contains: string } }
      | { tags: { contains: string } }
    >;
    isPublished?: boolean;
  } = {};

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { slug: { contains: q } },
      { excerpt: { contains: q } },
      { content: { contains: q } },
      { tags: { contains: q } },
    ];
  }

  if (status === "published") where.isPublished = true;
  if (status === "draft") where.isPublished = false;

  const posts = await prisma.post.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      isPublished: true,
      updatedAt: true,
      tags: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Posts</h1>
          <p className="text-sm text-neutral-500">Admin del blog editorial.</p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Nuevo post
        </Link>
      </div>

      {/* Filtros */}
      <form className="grid gap-3 rounded-lg border p-4 md:grid-cols-3">
        <label className="sr-only" htmlFor="q">
          Buscar
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Buscar (title/slug/tags...)"
          className="rounded-md border px-3 py-2 text-sm"
        />

        <label className="sr-only" htmlFor="status">
          Estado
        </label>
        <select
          id="status"
          name="status"
          defaultValue={status}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <button type="submit" className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50">
          Aplicar
        </button>

        {(q || status) && (
          <Link href="/admin/posts" className="text-sm text-neutral-600 hover:underline md:col-span-3">
            Limpiar filtros
          </Link>
        )}
      </form>

      {/* Tabla */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50">
            <tr className="text-neutral-600">
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Actualizado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-neutral-500" colSpan={5}>
                  No hay posts todavía.
                </td>
              </tr>
            ) : (
              posts.map((p) => {
                const boundToggle = togglePublish.bind(null, p.id);

                return (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.title}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {parseTags(p.tags).slice(0, 4).map((t) => (
                          <span key={t} className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono text-xs text-neutral-700">{p.slug}</td>

                    <td className="px-4 py-3">
                      {p.isPublished ? (
                        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">Published</span>
                      ) : (
                        <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">Draft</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-neutral-600">
                      {new Date(p.updatedAt).toLocaleString("es-ES")}
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      <TogglePublishButton label={p.isPublished ? "Unpublish" : "Publish"} action={boundToggle} />

                      <Link
                        href={`/admin/posts/${p.id}/edit`}
                        className="rounded-md border px-3 py-1.5 text-xs hover:bg-neutral-50"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
