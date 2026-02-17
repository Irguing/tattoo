"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@miko.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error ?? "Invalid credentials");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-zinc-400">Acceso al dashboard</p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Email</label>
          <input
            type="email"
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Password</label>
          <input
            type="password"
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-white text-black font-semibold px-3 py-2 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
