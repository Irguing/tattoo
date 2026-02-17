import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo inválido." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name) || ".bin";
  const safeName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
  const filePath = path.join(uploadsDir, safeName);

  await writeFile(filePath, buffer);

  return NextResponse.json({ url: `/uploads/${safeName}` });
}
