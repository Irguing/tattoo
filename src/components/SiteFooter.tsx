export default function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-sand">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-ink/60">
            © {new Date().getFullYear()} Miko Jester — Tattoo Artist
          </p>

          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            <a className="text-green700 hover:text-green500" href="https://instagram.com/" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a className="text-green700 hover:text-green500" href="https://tiktok.com/" target="_blank" rel="noreferrer">
              TikTok
            </a>
            <a className="text-green700 hover:text-green500" href="mailto:hello@mikojester.com">
              Email
            </a>
          </div>
        </div>

        <p className="mt-6 text-xs text-ink/50">
          Booking sujeto a disponibilidad. Aftercare disponible en el blog.
        </p>
      </div>
    </footer>
  );
}
