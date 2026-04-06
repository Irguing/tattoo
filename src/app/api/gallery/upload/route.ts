import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import path from "node:path";

export const runtime = "nodejs";

function safeName(original: string) {
  const base = original.replace(/[^a-zA-Z0-9._-]/g, "_");
  const ext = path.extname(base);
  const name = path.basename(base, ext);
  const stamp = Date.now().toString(36);
  return `${name}-${stamp}${ext || ""}`.toLowerCase();
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const filename = safeName(file.name);
    const blob = await put(filename, file, { access: "public" });

    return NextResponse.json({
      url: blob.url,
      filename,
      mime: file.type || "application/octet-stream",
      size: file.size,
    });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
