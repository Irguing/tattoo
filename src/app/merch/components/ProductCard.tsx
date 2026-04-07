import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  id: string;
  slug: string;
  name: string;
  price: number; // centavos
  imageUrl: string | null;
  category: string;
  stock: number;
};

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  });
}

export function ProductCard({ slug, name, price, imageUrl, category, stock }: ProductCardProps) {
  const outOfStock = stock === 0;

  return (
    <Link
      href={`/merch/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 text-sm">
            Sin imagen
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-900">
              Agotado
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white capitalize">
          {category}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-green700 leading-snug">
          {name}
        </h3>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
          <span className="text-xs font-medium text-green700 group-hover:underline">
            Ver más →
          </span>
        </div>
      </div>
    </Link>
  );
}
