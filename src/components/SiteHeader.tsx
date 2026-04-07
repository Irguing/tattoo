import Link from "next/link";
import Image from "next/image";
import { CartShell } from "./CartShell.client";

export default function SiteHeader() {
  return (
    <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      {/* LOGO IZQUIERDA */}
      <Link href="/" className="flex items-center">
        <Image
          src="/images/logo.png"
          alt="Miko Jester Logo"
          width={280}
          height={120}
          className="
            h-24 w-auto scale-[2] origin-left
            transition-all duration-500 ease-out
            hover:scale-[2.5]
            hover:rotate-1
            py-4
          "
          priority
        />
      </Link>

      {/* MENU DERECHA */}
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
    </header>
  );
}
