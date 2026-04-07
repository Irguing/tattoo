"use client";

import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { CartShell } from "./CartShell.client";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-dark/95 backdrop-blur-md border-b border-cream/5 shadow-card"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="Miko Jester Logo"
            width={200}
            height={80}
            className="h-16 w-auto brightness-0 invert transition-all duration-300 hover:scale-105"
            priority
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-7 text-xs font-bold tracking-widest md:flex">
          {[
            { href: "/designs", label: "TATTOOS" },
            { href: "/merch",   label: "TIENDA"  },
            { href: "/blog",    label: "BLOG"    },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-cream/70 transition hover:text-neon hover:drop-shadow-[0_0_8px_rgba(76,194,29,0.8)]"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/book"
            className="rounded-full border-2 border-neon bg-neon/10 px-5 py-2 text-xs font-bold tracking-widest text-neon transition hover:bg-neon hover:text-dark animate-border-glow"
          >
            RESERVAR
          </Link>
          <CartShell />
        </nav>

        {/* MOBILE */}
        <div className="flex items-center gap-3 md:hidden">
          <CartShell />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="rounded-xl p-2 text-cream/70 hover:text-neon transition"
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <nav className="border-t border-cream/5 bg-dark/98 backdrop-blur-md px-6 py-4 flex flex-col gap-1 md:hidden">
          {[
            { href: "/designs", label: "TATTOOS"  },
            { href: "/merch",   label: "TIENDA"   },
            { href: "/blog",    label: "BLOG"     },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-bold tracking-widest text-cream/70 hover:text-neon hover:bg-neon/5 transition"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-full border-2 border-neon bg-neon/10 px-5 py-3 text-center text-sm font-bold tracking-widest text-neon hover:bg-neon hover:text-dark transition"
          >
            RESERVAR
          </Link>
        </nav>
      )}
    </header>
  );
}
