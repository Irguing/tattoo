import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  id: string;
  slug: string;
  name: string;
  price: number;
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
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-ink/5">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink/30 text-sm">
            Sin imagen
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
            <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink">
              Agotado
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-green900/80 px-2.5 py-1 text-xs font-medium text-sand capitalize">
          {category}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-ink group-hover:text-green700 leading-snug">
          {name}
        </h3>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-green900">{formatPrice(price)}</span>
          <span className="text-xs font-medium text-green700 group-hover:underline">
            Ver más →
          </span>
        </div>
      </div>
    </Link>
  );
}
