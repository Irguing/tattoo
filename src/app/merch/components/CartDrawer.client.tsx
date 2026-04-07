"use client";

import * as React from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

type Props = {
  open: boolean;
  onClose: () => void;
};

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  });
}

export function CartDrawer({ open, onClose }: Props) {
  const { items, totalItems, totalCents, removeItem, updateQty, clear } = useCart();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  async function handleCheckout() {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
        ),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? `Error ${res.status}`);
      }

      const { url } = (await res.json()) as { url: string };
      window.location.href = url;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al iniciar el pago");
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <div
        className={[
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-sand shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <div>
            <h2 className="font-display text-2xl tracking-wide text-green900">Tu carrito</h2>
            <p className="text-xs text-ink/50">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="rounded-xl p-2 hover:bg-ink/5 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/20">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="text-sm text-ink/50">Tu carrito está vacío.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                {/* Image */}
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-ink/5">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink/30 text-xs">img</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-ink truncate">{item.name}</p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-ink/30 hover:text-ink flex-shrink-0 transition"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Qty */}
                    <div className="flex items-center gap-1 rounded-xl border border-ink/15 px-2 py-1">
                      <button
                        onClick={() => updateQty(item.productId, item.quantity - 1)}
                        className="text-ink/50 hover:text-ink w-5 text-center transition"
                      >−</button>
                      <span className="min-w-[1.5rem] text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.quantity + 1)}
                        className="text-ink/50 hover:text-ink w-5 text-center transition"
                      >+</button>
                    </div>
                    <span className="text-sm font-bold text-ink">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-ink/10 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Total</span>
              <span className="text-xl font-bold text-green900">{formatPrice(totalCents)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full rounded-2xl bg-green900 px-6 py-3 text-sm font-semibold text-sand transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Redirigiendo..." : "Ir al pago →"}
            </button>
            <button
              onClick={clear}
              className="w-full text-center text-xs text-ink/40 hover:text-ink transition"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
