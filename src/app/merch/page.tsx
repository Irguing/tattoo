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
      id: true, slug: true, name: true, price: true,
      imageUrl: true, category: true, stock: true,
    },
  });

  return (
    <main className="relative overflow-hidden bg-bg min-h-screen pt-28 pb-20">
      {/* Halftone + glow */}
      <div className="halftone absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-neon/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gold/6 blur-[80px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/25 bg-neon/8 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
            <span className="text-xs font-bold tracking-[0.25em] text-neon">TIENDA OFICIAL</span>
          </span>
          <h1 className="mt-4 font-display text-6xl tracking-wide text-gold md:text-7xl">TIENDA</h1>
          <p className="mt-2 max-w-xl text-sm text-cream/50">
            Stickers, prints y más. Envío a toda España.
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/merch"
            className={[
              "rounded-full border px-4 py-1.5 text-xs font-bold tracking-[0.15em] transition",
              !activeCategory
                ? "border-neon bg-neon/15 text-neon shadow-neon"
                : "border-cream/15 text-cream/50 hover:border-neon/40 hover:text-neon",
            ].join(" ")}
          >
            TODO
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/merch?category=${cat}`}
              className={[
                "rounded-full border px-4 py-1.5 text-xs font-bold tracking-[0.15em] uppercase transition",
                activeCategory === cat
                  ? "border-neon bg-neon/15 text-neon shadow-neon"
                  : "border-cream/15 text-cream/50 hover:border-neon/40 hover:text-neon",
              ].join(" ")}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="panel-card rounded-2xl p-12 text-center">
            <p className="text-cream/40">No hay productos en esta categoría todavía.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
