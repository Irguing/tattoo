import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    // 1) Buscar en DB para saber filename/url
    const existing = await prisma.galleryImage.findUnique({
      where: { id },
      select: { id: true, filename: true, url: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 2) Borrar registro DB
    await prisma.galleryImage.delete({ where: { id } });

    // 3) Borrar archivo físico si existe
    // Preferimos filename, si no, lo derivamos desde url.
    const filename =
      existing.filename || (existing.url ? path.basename(existing.url) : "");

    if (filename) {
      const filepath = path.join(process.cwd(), "public", "uploads", filename);
      try {
        await fs.unlink(filepath);
      } catch (e) {
        // Si el archivo no existe, no rompemos (idempotencia)
        // @ts-expect-error narrowing
        if (e?.code !== "ENOENT") throw e;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Gallery DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
