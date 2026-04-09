import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-neon/15 bg-panel">
      <div className="halftone absolute inset-0 opacity-30" />
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-neon/40 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="font-display text-5xl tracking-wide text-gold">Miko Jester</p>
            <p className="mt-1 text-xs font-bold tracking-[0.3em] text-neon/60">TATTOO STUDIO · MADRID</p>
            <p className="mt-4 text-sm text-cream/40 leading-relaxed">
              New school, ilustración y diseño custom.<br />
              Centro de Madrid · Cita previa.
            </p>
            {/* Social icons */}
            <div className="mt-5 flex gap-3">
              <SocialLink href="https://www.instagram.com/mikojesterink/" label="Instagram">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href="https://tiktok.com/@mikojester" label="TikTok">
                <TikTokIcon />
              </SocialLink>
              <SocialLink href="mailto:info@mikojester.com" label="Email">
                <EmailIcon />
              </SocialLink>
            </div>
          </div>

          {/* Nav */}
          <div>
            <p className="mb-4 text-[10px] font-bold tracking-[0.4em] text-neon/40">NAVEGACIÓN</p>
            <ul className="space-y-2.5">
              {[
                { href: "/designs", label: "Tatuajes"  },
                { href: "/merch",   label: "Tienda"    },
                { href: "/blog",    label: "Blog"      },
                { href: "/book",    label: "Reservas"  },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-cream/45 transition hover:text-neon"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-[10px] font-bold tracking-[0.4em] text-neon/40">CONTACTO</p>
            <div className="space-y-3">
              <a
                href="https://www.instagram.com/mikojesterink/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-cream/45 transition hover:text-neon"
              >
                <InstagramIcon />
                @mikojesterink
              </a>
              <a
                href="mailto:info@mikojester.com"
                className="flex items-center gap-3 text-sm text-cream/45 transition hover:text-neon"
              >
                <EmailIcon />
                info@mikojester.com
              </a>
            </div>

            {/* CTA */}
            <Link
              href="/book"
              className="mt-6 inline-flex rounded-full border-2 border-neon bg-neon/10 px-5 py-2.5 text-xs font-bold tracking-[0.2em] text-neon transition hover:bg-neon hover:text-bg"
            >
              ¡RESERVAR CITA!
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-neon/10 pt-6 text-xs text-cream/20">
          <p>© {new Date().getFullYear()} Miko Jester. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/legal"   className="transition hover:text-cream/50">Legal</Link>
            <Link href="/privacy" className="transition hover:text-cream/50">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-neon/20 bg-neon/5 text-cream/50 transition hover:border-neon/50 hover:bg-neon/15 hover:text-neon"
    >
      {children}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/>
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}
