import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-green900 text-sand">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-3xl tracking-wide">Miko Jester</p>
            <p className="mt-2 text-sand/75">
              Tattoo artist · Ilustración · Merch
            </p>
            <p className="mt-4 text-sm text-sand/75">
              Centro de Madrid · Cita previa
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-sand/90">Secciones</p>
            <ul className="mt-3 space-y-2 text-sm text-sand/75">
              <li><Link className="hover:text-sand" href="/designs">Tatuajes</Link></li>
              <li><Link className="hover:text-sand" href="/merch">Tienda</Link></li>
              <li><Link className="hover:text-sand" href="/book">Reservas</Link></li>
              <li><Link className="hover:text-sand" href="/blog">Blog</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-sand/90">Contacto</p>
            <ul className="mt-3 space-y-2 text-sm text-sand/75">
              <li>info@mikojester.com</li>
              <li>+34 600 000 000</li>
              <li className="flex gap-3 pt-2">
                <a className="hover:text-neon" href="#" aria-label="Instagram">Instagram</a>
                <a className="hover:text-neon" href="#" aria-label="TikTok">TikTok</a>
                <a className="hover:text-neon" href="#" aria-label="YouTube">YouTube</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-sand/15 pt-6 text-xs text-sand/60 flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Miko Jester. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link className="hover:text-sand" href="/legal">Legal</Link>
            <Link className="hover:text-sand" href="/privacy">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
