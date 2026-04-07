export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "./components/ProductCard";

const CATEGORIES = ["general", "stickers", "prints", "ropa", "accesorios"];

export default async function MerchPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params?.category?.trim() || "";

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      ...(activeCategory ? { category: activeCategory } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      imageUrl: true,
      category: true,
      stock: true,
    },
  });

  return (
    <main className="bg-sand py-14">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-5xl tracking-wide text-green900">Tienda</h1>
          <p className="mt-2 max-w-2xl text-ink/70">
            Stickers, prints y más. Envío a toda España.
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/merch"
            className={[
              "rounded-full border px-4 py-1.5 text-sm font-medium transition",
              !activeCategory
                ? "border-green900 bg-green900 text-sand"
                : "border-ink/20 hover:border-green900 hover:text-green900",
            ].join(" ")}
          >
            Todo
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/merch?category=${cat}`}
              className={[
                "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition",
                activeCategory === cat
                  ? "border-green900 bg-green900 text-sand"
                  : "border-ink/20 hover:border-green900 hover:text-green900",
              ].join(" ")}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center">
            <p className="text-ink/60">No hay productos en esta categoría todavía.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
