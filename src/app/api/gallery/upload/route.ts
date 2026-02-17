import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const filename = safeName(file.name);
    const filepath = path.join(uploadsDir, filename);

    await fs.writeFile(filepath, buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
      mime: file.type || "application/octet-stream",
      size: buffer.length,
    });
  } catch  {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
