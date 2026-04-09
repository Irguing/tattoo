export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "../components/AddToCartButton.client";

type PageProps = { params: Promise<{ slug: string }> };

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, isPublished: true },
    select: { name: true, description: true, imageUrl: true },
  });
  if (!product) return { title: "Producto | Tienda" };
  return {
    title: `${product.name} | Tienda Miko Jester`,
    description: product.description ?? undefined,
    openGraph: product.imageUrl ? { images: [{ url: product.imageUrl }] } : undefined,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, isPublished: true },
    select: { id: true, slug: true, name: true, description: true, price: true, imageUrl: true, category: true, stock: true },
  });

  if (!product) return notFound();

  return (
    <main className="relative overflow-hidden bg-bg min-h-screen pt-28 pb-20">
      <div className="halftone absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-neon/8 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          {/* Image panel */}
          <div className="relative aspect-square overflow-hidden rounded-3xl comic-border">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl} alt={product.name} fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover" priority
              />
            ) : (
              <div className="halftone flex h-full items-center justify-center bg-gradient-to-br from-neon/10 to-gold/5">
                <span className="font-display text-3xl text-cream/15">SIN IMAGEN</span>
              </div>
            )}
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[0_0_60px_rgba(76,194,29,0.1)]" />
          </div>

          {/* Info */}
          <div className="flex flex-col space-y-5">
            <div>
              <span className="rounded-full border border-neon/25 bg-neon/8 px-3 py-1 text-[10px] font-bold tracking-[0.25em] text-neon uppercase">
                {product.category}
              </span>
              <h1 className="mt-4 font-display text-5xl tracking-wide text-gold">
                {product.name}
              </h1>
              {product.description && (
                <p className="mt-3 text-sm text-cream/60 leading-relaxed">{product.description}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="font-display text-4xl text-gold">{formatPrice(product.price)}</span>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="rounded-full border border-rust/40 bg-rust/10 px-3 py-1 text-xs font-bold text-rust">
                  ¡Solo quedan {product.stock}!
                </span>
              )}
            </div>

            <AddToCartButton
              productId={product.id} slug={product.slug} name={product.name}
              price={product.price} imageUrl={product.imageUrl} stock={product.stock}
            />

            <p className="text-xs text-cream/30 border-t border-cream/10 pt-4">
              Envío a toda España · Pago seguro con Stripe
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
