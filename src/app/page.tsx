import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { CTA } from "@/components/home/CTA";
import { Footer } from "@/components/layout/Footer";
import BlogTeaser from "@/components/BlogTeaser";
import { logError } from "@/lib/logger";
import { getRequestIdFromHeaders } from "@/lib/observability";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const requestId = await getRequestIdFromHeaders();
  return (
    <>
      <Hero />
      <About />

      <SafeBlogTeaser requestId={requestId} />

      <section className="bg-sand py-14">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-4xl tracking-wide text-green900">¿Qué quieres hacer?</h2>
          <p className="mt-2 max-w-2xl text-ink/70">
            Ilustración, tatuajes o talleres creativos. Elige tu camino.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Card
              title="Ilustración"
              desc="Encargos y piezas originales con estilo gráfico."
              tag="Comisiones"
              href="/book"
            />
            <Card
              title="Tatuajes"
              desc="Flash y diseños custom. Mira estilos y estilos."
              tag="Galería"
              href="/designs"
            />
            <Card
              title="Talleres"
              desc="Workshops y sesiones presenciales."
              tag="Eventos"
              href="/book"
            />
          </div>
        </div>
      </section>

      <SafeGalleryTeaser requestId={requestId} />
      <CTA />
      <Footer />
    </>
  );
}

async function SafeBlogTeaser({ requestId }: { requestId?: string }) {
  try {
    return BlogTeaser();
  } catch (error) {
    logError({
      scope: "home.safe-blog-teaser",
      msg: "Failed to render BlogTeaser",
      requestId,
      error,
    });
    return null;
  }
}

async function SafeGalleryTeaser({ requestId }: { requestId?: string }) {
  try {
    return await GalleryTeaser();
  } catch (error) {
    logError({
      scope: "home.safe-gallery-teaser",
      msg: "Failed to render GalleryTeaser",
      requestId,
      error,
    });

    return (
      <section className="py-16 bg-green900 text-sand">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-5xl tracking-wide">Galería</h2>
          <p className="mt-2 text-sand/80 max-w-2xl">
            Ahora mismo no podemos cargar la galería. Inténtalo de nuevo en unos minutos.
          </p>
          <Link
            href="/designs"
            className="mt-6 inline-flex rounded-xl bg-neon px-5 py-3 font-semibold text-ink hover:opacity-90"
          >
            Ver todos →
          </Link>
        </div>
      </section>
    );
  }
}

function Card({
  title,
  desc,
  tag,
  href,
}: {
  title: string;
  desc: string;
  tag: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[28px] border border-ink/10 bg-white p-6 shadow-soft transition hover:-translate-y-1"
    >
      <div className="inline-flex rounded-full bg-green900 px-3 py-1 text-xs font-semibold text-sand">
        {tag}
      </div>
      <h3 className="mt-4 font-display text-3xl tracking-wide text-green900">{title}</h3>
      <p className="mt-2 text-ink/70">{desc}</p>
      <p className="mt-6 text-sm font-semibold text-green700 group-hover:text-green500">Ver más →</p>
    </Link>
  );
}
