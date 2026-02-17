export type BlogListItem = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
  coverUrl?: string | null; // ← importante
};
