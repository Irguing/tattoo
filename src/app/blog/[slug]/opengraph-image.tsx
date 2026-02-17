import { ImageResponse } from "next/og";
import { getPostBySlugUnified } from "@/lib/posts";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlugUnified(slug);

  const title = post?.title ?? "Miko Jester Blog";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          padding: "64px",
          background: "#0a0a0a",
          color: "white",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 24, opacity: 0.8 }}>Miko Jester · Blog</div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05 }}>
          {title}
        </div>
        <div style={{ fontSize: 20, opacity: 0.7 }}>
          /blog/{slug}
        </div>
      </div>
    ),
    size
  );
}
