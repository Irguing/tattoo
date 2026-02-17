import type { MetadataRoute } from "next";
import { absUrl, getSiteUrl } from "@/lib/seo/site";

export const revalidate = 3600; // 1h

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
        ],
      },
    ],
    sitemap: absUrl("/sitemap.xml"),
    host: getSiteUrl(),
  };
}
