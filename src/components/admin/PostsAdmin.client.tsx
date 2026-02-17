"use client";

import { useState } from "react";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverUrl: string | null;
  tags: string | null;
  isPublished: boolean;
};

export default function PostsAdminClient({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [error, setError] = useState<string | null>(null);

  async function createPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);

    const payload = {
      slug: fd.get("slug"),
      title: fd.get("title"),
      excerpt: fd.get("excerpt"),
      content: fd.get("content"),
      tags: fd.get("tags"),
      isPublished: fd.get("isPublished") === "on",
    };

    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setError("No se pudo crear el post");
      return;
    }

    const created = await res.json();
    setPosts([created, ...posts]);
    e.currentTarget.reset();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createPost} className="space-y-3 border p-4 rounded-xl">
        <input name="slug" placeholder="slug-del-post" className="w-full border p-2 rounded" />
        <input name="title" placeholder="Título" className="w-full border p-2 rounded" />
        <input name="excerpt" placeholder="Extracto" className="w-full border p-2 rounded" />
        <input name="tags" placeholder="tattoo, blackwork" className="w-full border p-2 rounded" />
        <textarea name="content" placeholder="Markdown content..." className="w-full border p-2 rounded h-32" />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPublished" />
          Publicado
        </label>

        <button className="bg-black text-white px-4 py-2 rounded">
          Crear Post
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="border p-3 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold">{post.title}</p>
              <p className="text-sm text-gray-500">
                {post.slug} · {post.isPublished ? "Publicado" : "Borrador"}
              </p>
            </div>
            <button
              onClick={() => remove(post.id)}
              className="text-red-500 text-sm"
            >
              Borrar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
