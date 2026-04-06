import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import path from "node:path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo inválido." }, { status: 400 });
  }

  const ext = path.extname(file.name) || ".bin";
  const filename = `${Date.now()}-${crypto.randomUUID()}${ext}`;

  const blob = await put(filename, file, { access: "public" });

  return NextResponse.json({ url: blob.url });
}
