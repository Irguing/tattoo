"use client";

import * as React from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number; // centavos
  imageUrl: string | null;
  quantity: number;
};

type CartAction =
  | { type: "ADD"; item: Omit<CartItem, "quantity"> }
  | { type: "REMOVE"; productId: string }
  | { type: "UPDATE_QTY"; productId: string; quantity: number }
  | { type: "CLEAR" };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((i) => i.productId === action.item.productId);
      if (existing) {
        return state.map((i) =>
          i.productId === action.item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...state, { ...action.item, quantity: 1 }];
    }
    case "REMOVE":
      return state.filter((i) => i.productId !== action.productId);
    case "UPDATE_QTY":
      if (action.quantity <= 0) return state.filter((i) => i.productId !== action.productId);
      return state.map((i) =>
        i.productId === action.productId ? { ...i, quantity: action.quantity } : i
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalCents: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

const STORAGE_KEY = "miko_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = React.useReducer(cartReducer, []);
  const [hydrated, setHydrated] = React.useState(false);

  // Hydrate from localStorage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          parsed.forEach((item) => dispatch({ type: "ADD", item }));
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalCents = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value: CartContextValue = {
    items,
    totalItems,
    totalCents,
    addItem: (item) => dispatch({ type: "ADD", item }),
    removeItem: (productId) => dispatch({ type: "REMOVE", productId }),
    updateQty: (productId, quantity) => dispatch({ type: "UPDATE_QTY", productId, quantity }),
    clear: () => dispatch({ type: "CLEAR" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
