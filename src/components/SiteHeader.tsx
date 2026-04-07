"use client";

import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { CartShell } from "./CartShell.client";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      {/* LOGO */}
      <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
        <Image
          src="/images/logo.png"
          alt="Miko Jester Logo"
          width={280}
          height={120}
          className="h-24 w-auto scale-[2] origin-left transition-all duration-500 ease-out hover:scale-[2.5] hover:rotate-1 py-4"
          priority
        />
      </Link>

      {/* DESKTOP NAV */}
      <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
        <Link className="hover:opacity-80" href="/designs">Tatuajes</Link>
        <Link className="hover:opacity-80" href="/merch">Tienda</Link>
        <Link className="hover:opacity-80" href="/blog">Blog</Link>
        <Link
          href="/book"
          className="rounded-full bg-neon px-5 py-2 font-semibold text-ink shadow-soft hover:opacity-90"
        >
          Reservar
        </Link>
        <CartShell />
      </nav>

      {/* MOBILE: carrito + hamburger */}
      <div className="flex items-center gap-3 md:hidden">
        <CartShell />
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          className="rounded-xl p-2 hover:bg-ink/5 transition"
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <nav className="absolute left-0 right-0 top-full z-50 flex flex-col gap-1 border-t border-ink/10 bg-sand px-6 py-4 shadow-soft md:hidden">
          <Link
            href="/designs"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-ink/5 transition"
          >
            Tatuajes
          </Link>
          <Link
            href="/merch"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-ink/5 transition"
          >
            Tienda
          </Link>
          <Link
            href="/blog"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-ink/5 transition"
          >
            Blog
          </Link>
          <Link
            href="/book"
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-full bg-neon px-5 py-3 text-center text-sm font-semibold text-ink shadow-soft hover:opacity-90 transition"
          >
            Reservar
          </Link>
        </nav>
      )}
    </header>
  );
}
