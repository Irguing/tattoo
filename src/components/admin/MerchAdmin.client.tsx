"use client";

import * as React from "react";
import type { ProductDTO } from "@/app/admin/(protected)/merch/page";

const CATEGORIES = ["general", "stickers", "prints", "ropa", "accesorios"];

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2);
}

function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

type EditingState = {
  id: string;
  price: string;
  stock: string;
};

export default function MerchAdminClient({
  initialProducts,
}: {
  initialProducts: ProductDTO[];
}) {
  const [products, setProducts] = React.useState<ProductDTO[]>(initialProducts);
  const [editing, setEditing] = React.useState<EditingState | null>(null);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  // Form state
  const [file, setFile] = React.useState<File | null>(null);
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [category, setCategory] = React.useState("general");
  const [stock, setStock] = React.useState("0");
  const [isPublished, setIsPublished] = React.useState(false);
  const [busyCreate, setBusyCreate] = React.useState(false);

  function handleNameChange(val: string) {
    setName(val);
    setSlug(slugify(val));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return alert("El nombre es obligatorio.");
    if (!slug.trim()) return alert("El slug es obligatorio.");
    const priceCents = Math.round(parseFloat(price || "0") * 100);
    if (isNaN(priceCents) || priceCents < 0) return alert("Precio inválido.");

    setBusyCreate(true);
    try {
      let imageUrl: string | null = null;
      let imageFilename: string | null = null;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const up = await fetch("/api/merch/upload", { method: "POST", body: fd });
        if (!up.ok) throw new Error(`Upload failed (${up.status})`);
        const upData = (await up.json()) as { url: string; filename: string };
        imageUrl = upData.url;
        imageFilename = upData.filename;
      }

      const res = await fetch("/api/merch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim(),
          name: name.trim(),
          description: description.trim() || null,
          price: priceCents,
          imageUrl,
          imageFilename,
          category,
          stock: parseInt(stock || "0", 10),
          isPublished,
        }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? `Error ${res.status}`);
      }

      const created = (await res.json()) as ProductDTO;
      setProducts((prev) => [
        { ...created, createdAt: created.createdAt, updatedAt: created.updatedAt },
        ...prev,
      ]);

      // Reset form
      setFile(null);
      setName("");
      setSlug("");
      setDescription("");
      setPrice("");
      setCategory("general");
      setStock("0");
      setIsPublished(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al crear producto");
    } finally {
      setBusyCreate(false);
    }
  }

  async function togglePublish(product: ProductDTO) {
    setBusyId(product.id);
    const next = !product.isPublished;
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isPublished: next } : p))
    );
    try {
      const res = await fetch(`/api/merch/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: next }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
    } catch {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isPublished: product.isPublished } : p))
      );
    } finally {
      setBusyId(null);
    }
  }

  async function saveEdit() {
    if (!editing) return;
    const priceCents = Math.round(parseFloat(editing.price || "0") * 100);
    const stockVal = parseInt(editing.stock || "0", 10);
    if (isNaN(priceCents) || priceCents < 0) return alert("Precio inválido.");

    setBusyId(editing.id);
    try {
      const res = await fetch(`/api/merch/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: priceCents, stock: stockVal }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editing.id ? { ...p, price: priceCents, stock: stockVal } : p
        )
      );
      setEditing(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    setBusyId(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      const res = await fetch(`/api/merch/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Error ${res.status}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar");
      // reload page to recover state
      window.location.reload();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Create form */}
      <form onSubmit={handleCreate} className="rounded-2xl border bg-white p-5 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Nuevo producto</h3>
          <button
            type="submit"
            disabled={busyCreate}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {busyCreate ? "Creando..." : "Crear producto"}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Nombre *</label>
            <input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ej: Sticker Flash Dragon"
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Slug *</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="sticker-flash-dragon"
              className="w-full rounded-xl border px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Precio (en tu moneda)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="9.99"
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Stock</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full rounded-xl border bg-white px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-gray-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-medium text-gray-700">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Descripción del producto (opcional)"
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="create-published"
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="create-published" className="text-sm text-gray-700">
              Publicar al crear
            </label>
          </div>
        </div>
      </form>

      {/* Product list */}
      {products.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-gray-600 shadow-sm">
          No hay productos. Crea el primero arriba.
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => {
            const isEditing = editing?.id === product.id;
            const isBusy = busyId === product.id;

            return (
              <div
                key={product.id}
                className="rounded-2xl border bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {/* Imagen */}
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-16 w-16 rounded-xl object-cover border flex-shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-xl border bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                      Sin img
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-gray-900 truncate">{product.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{product.slug}</div>
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
                            {product.category}
                          </span>
                          <span
                            className={cx(
                              "rounded-full border px-2 py-0.5 text-xs font-medium",
                              product.isPublished
                                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700"
                                : "border-amber-500/25 bg-amber-500/10 text-amber-800"
                            )}
                          >
                            {product.isPublished ? "publicado" : "borrador"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => togglePublish(product)}
                          disabled={isBusy}
                          className="rounded-xl border px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-60"
                        >
                          {product.isPublished ? "Despublicar" : "Publicar"}
                        </button>

                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={saveEdit}
                              disabled={isBusy}
                              className="rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                            >
                              {isBusy ? "..." : "Guardar"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditing(null)}
                              className="rounded-xl border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setEditing({
                                id: product.id,
                                price: formatPrice(product.price),
                                stock: String(product.stock),
                              })
                            }
                            className="rounded-xl border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                          >
                            Editar
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteProduct(product.id, product.name)}
                          disabled={isBusy}
                          className="rounded-xl border px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                    {/* Price / Stock display or edit */}
                    {isEditing ? (
                      <div className="mt-3 flex items-center gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700">Precio</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editing.price}
                            onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                            className="w-28 rounded-xl border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700">Stock</label>
                          <input
                            type="number"
                            min="0"
                            value={editing.stock}
                            onChange={(e) => setEditing({ ...editing, stock: e.target.value })}
                            className="w-20 rounded-xl border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="font-semibold text-gray-900">
                          ${formatPrice(product.price)}
                        </span>
                        <span className="text-gray-500">
                          Stock: <span className={cx("font-medium", product.stock === 0 ? "text-rose-600" : "text-gray-900")}>{product.stock}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
