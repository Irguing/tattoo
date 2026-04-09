import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  id: string; slug: string; name: string; price: number;
  imageUrl: string | null; category: string; stock: number;
};

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

export function ProductCard({ slug, name, price, imageUrl, category, stock }: ProductCardProps) {
  const outOfStock = stock === 0;

  return (
    <Link
      href={`/merch/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl comic-border bg-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-neon"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-panel2">
        {imageUrl ? (
          <Image
            src={imageUrl} alt={name} fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="halftone flex h-full items-center justify-center bg-gradient-to-br from-neon/10 to-gold/5">
            <span className="font-display text-2xl text-cream/15">SIN IMAGEN</span>
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/70 backdrop-blur-sm">
            <span className="rounded-full border border-cream/20 bg-bg/80 px-4 py-1.5 text-xs font-bold tracking-widest text-cream/60">
              AGOTADO
            </span>
          </div>
        )}
        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-full border border-neon/30 bg-bg/80 px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-neon backdrop-blur-sm uppercase">
          {category}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-cream group-hover:text-neon leading-snug transition-colors">
          {name}
        </h3>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="font-display text-xl text-gold">{formatPrice(price)}</span>
          <span className="text-[11px] font-bold tracking-widest text-neon/60 group-hover:text-neon transition-colors">
            VER →
          </span>
        </div>
      </div>
    </Link>
  );
}
