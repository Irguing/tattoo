"use client";

import * as React from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
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
        className="w-full rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-400 cursor-not-allowed"
      >
        Agotado
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full rounded-2xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-95 disabled:opacity-60"
    >
      {added ? "¡Agregado ✓" : inCart ? `En el carrito (${inCart.quantity})` : "Agregar al carrito"}
    </button>
  );
}
