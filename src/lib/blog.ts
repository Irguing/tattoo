// src/lib/blog.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogFrontmatter = {
  title: string;
  date: string;
  excerpt?: string;
  cover?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
};

export type BlogPost = {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string; // markdown crudo
};

export type BlogPostWithHtml = BlogPost & {
  contentHtml: string;
};

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data, content } = matter(raw);

    return {
      slug,
      frontmatter: {
        title: (data.title ?? slug) as string,
        date: (data.date ?? "1970-01-01") as string,
        excerpt: data.excerpt as string | undefined,
        cover: data.cover as string | undefined,
        tags: (data.tags ?? []) as string[],
        featured: data.featured === true,
        published: data.published !== false,
      },
      content,
    };
  });

  return posts
    .filter((p) => p.frontmatter.published !== false)
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPostWithHtml | null> {
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    frontmatter: {
      title: (data.title ?? slug) as string,
      date: (data.date ?? "1970-01-01") as string,
      excerpt: data.excerpt as string | undefined,
      cover: data.cover as string | undefined,
      tags: (data.tags ?? []) as string[],
      featured: data.featured === true,
      published: data.published !== false,
    },
    content,
    contentHtml,
  };
}
