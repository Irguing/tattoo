export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "../components/AddToCartButton.client";

type PageProps = { params: Promise<{ slug: string }> };

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  });
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
    openGraph: product.imageUrl
      ? { images: [{ url: product.imageUrl }] }
      : undefined,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, isPublished: true },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      price: true,
      imageUrl: true,
      category: true,
      stock: true,
    },
  });

  if (!product) return notFound();

  return (
    <main className="bg-sand py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-3xl border bg-white">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <span className="rounded-full bg-green900/10 px-3 py-1 text-xs font-semibold text-green900 capitalize">
                {product.category}
              </span>
              <h1 className="mt-3 font-display text-4xl tracking-wide text-green900">
                {product.name}
              </h1>
              {product.description && (
                <p className="mt-3 text-ink/70 leading-relaxed">{product.description}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-sm text-amber-700 font-medium">
                  ¡Solo quedan {product.stock}!
                </span>
              )}
            </div>

            <AddToCartButton
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              stock={product.stock}
            />

            <p className="text-xs text-ink/50">
              Envío a toda España · Pago seguro con Stripe
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
