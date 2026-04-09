"use client";

import * as React from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  productId: string; slug: string; name: string;
  price: number; imageUrl: string | null; stock: number;
};

export function AddToCartButton({ productId, slug, name, price, imageUrl, stock }: Props) {
  const { addItem, items } = useCart();
  const [added, setAdded] = React.useState(false);

  const inCart = items.find((i) => i.productId === productId);
  const outOfStock = stock === 0;

  function handleAdd() {
    addItem({ productId, slug, name, price, imageUrl });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (outOfStock) {
    return (
      <button
        disabled
        className="w-full rounded-full border-2 border-cream/10 px-6 py-3.5 text-sm font-bold tracking-[0.15em] text-cream/30 cursor-not-allowed"
      >
        AGOTADO
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={[
        "w-full rounded-full border-2 px-6 py-3.5 text-sm font-bold tracking-[0.15em] transition-all duration-300",
        added || inCart
          ? "border-neon bg-neon/15 text-neon shadow-neon"
          : "border-neon bg-neon text-bg shadow-neon hover:bg-transparent hover:text-neon",
      ].join(" ")}
    >
      {added
        ? "¡AGREGADO ✓"
        : inCart
          ? `EN EL CARRITO (${inCart.quantity})`
          : "AGREGAR AL CARRITO"}
    </button>
  );
}
