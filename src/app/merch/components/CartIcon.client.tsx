"use client";

import { useCart } from "@/context/CartContext";

type Props = {
  onOpen: () => void;
};

export function CartIcon({ onOpen }: Props) {
  const { totalItems } = useCart();

  return (
    <button
      onClick={onOpen}
      aria-label={`Carrito (${totalItems} items)`}
      className="relative flex items-center justify-center rounded-full p-2 hover:bg-black/5 transition"
    >
      {/* Bag icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {totalItems > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-green900 text-[10px] font-bold text-sand">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  );
}
