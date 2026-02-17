import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-sand/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-3xl tracking-wide text-green900">
          Miko Jester
        </Link>

        <nav className="flex items-center gap-4 text-sm font-semibold">
          <Link className="hover:opacity-80" href="/designs">Tatuajes</Link>
          <Link className="hover:opacity-80" href="/merch">Tienda</Link>
          <Link className="hover:opacity-80" href="/blog">Blog</Link>
          <Link className="hover:opacity-80" href="/book">Reservas</Link>
          <Link className="rounded-xl bg-green700 px-4 py-2 text-sand shadow-soft hover:bg-green500" href="/book">
            Reservar
          </Link>
        </nav>
      </div>
    </header>
  );
}
