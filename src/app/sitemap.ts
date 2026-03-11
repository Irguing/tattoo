import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { absUrl } from "@/lib/seo/site";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absUrl("/blog"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: absUrl("/gallery"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: absUrl("/bookings"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const markdownPostRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: absUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.frontmatter.date ?? Date.now()),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...markdownPostRoutes];
}
