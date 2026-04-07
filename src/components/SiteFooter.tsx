import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-cream/5 bg-dark">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-neon/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="font-display text-4xl tracking-wide text-cream">Miko Jester</p>
            <p className="mt-1 text-sm text-cream/40 tracking-widest">TATTOO STUDIO · MADRID</p>
            <p className="mt-4 text-sm text-cream/40 leading-relaxed">
              New school, ilustración y diseño custom.<br />Centro de Madrid · Cita previa.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="mb-4 text-xs font-bold tracking-[0.3em] text-cream/25">NAVEGACIÓN</p>
            <ul className="space-y-2">
              {[
                { href: "/designs", label: "Tatuajes" },
                { href: "/merch",   label: "Tienda"   },
                { href: "/blog",    label: "Blog"     },
                { href: "/book",    label: "Reservas" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-cream/50 transition hover:text-neon"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="mb-4 text-xs font-bold tracking-[0.3em] text-cream/25">REDES</p>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.instagram.com/mikojesterink/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 text-sm text-cream/50 transition hover:text-neon"
              >
                <InstagramIcon />
                <span>@mikojesterink</span>
              </a>
              <a
                href="https://tiktok.com/@mikojester"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 text-sm text-cream/50 transition hover:text-neon"
              >
                <TikTokIcon />
                <span>@mikojester</span>
              </a>
              <a
                href="mailto:info@mikojester.com"
                className="group flex items-center gap-3 text-sm text-cream/50 transition hover:text-neon"
              >
                <EmailIcon />
                <span>info@mikojester.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-cream/5 pt-6 text-xs text-cream/25">
          <p>© {new Date().getFullYear()} Miko Jester. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/legal" className="hover:text-cream/50 transition">Legal</Link>
            <Link href="/privacy" className="hover:text-cream/50 transition">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/>
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}
