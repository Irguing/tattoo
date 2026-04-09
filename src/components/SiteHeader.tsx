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
          ? "bg-bg/95 backdrop-blur-md border-b border-neon/10 shadow-card"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="Miko Jester Logo"
            width={180}
            height={72}
            className="h-14 w-auto brightness-0 invert transition-all duration-300 hover:scale-105 drop-shadow-[0_0_8px_rgba(76,194,29,0.6)]"
            priority
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-8 text-xs font-bold tracking-[0.2em] md:flex">
          {[
            { href: "/designs", label: "TATTOOS" },
            { href: "/merch",   label: "TIENDA"  },
            { href: "/blog",    label: "BLOG"    },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative text-cream/60 transition-colors duration-200 hover:text-neon after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-neon after:transition-all after:duration-300 hover:after:w-full"
            >
              {label}
            </Link>
          ))}

          <Link
            href="/book"
            className="animate-border-pulse rounded-full border-2 border-neon bg-neon/10 px-6 py-2 text-xs font-bold tracking-[0.2em] text-neon transition-all duration-300 hover:bg-neon hover:text-bg hover:shadow-neon"
          >
            ¡RESERVAR!
          </Link>
          <CartShell />
        </nav>

        {/* MOBILE */}
        <div className="flex items-center gap-3 md:hidden">
          <CartShell />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="rounded-xl p-2 text-cream/60 hover:text-neon transition"
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
        <nav className="border-t border-neon/10 bg-bg/98 backdrop-blur-md px-6 py-4 flex flex-col gap-1 md:hidden">
          {[
            { href: "/designs", label: "TATTOOS" },
            { href: "/merch",   label: "TIENDA"  },
            { href: "/blog",    label: "BLOG"    },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-bold tracking-[0.2em] text-cream/60 hover:text-neon hover:bg-neon/5 transition"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-full border-2 border-neon bg-neon/10 px-5 py-3 text-center text-sm font-bold tracking-[0.2em] text-neon hover:bg-neon hover:text-bg transition"
          >
            ¡RESERVAR CITA!
          </Link>
        </nav>
      )}
    </header>
  );
}
