"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { assertPostInput, normalizeSlug } from "@/lib/validation/posts";

function isPrismaUniqueError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  return "code" in e && (e as { code?: unknown }).code === "P2002";
}

async function mustBeAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

function getString(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function createPost(formData: FormData) {
  await mustBeAdmin();

  const raw = {
    title: getString(formData, "title"),
    slug: normalizeSlug(getString(formData, "slug")),
    excerpt: getString(formData, "excerpt"),
    content: getString(formData, "content"),
    coverImage: getString(formData, "coverUrl"), // mapeo al validador
    tags: getString(formData, "tags"),
    isPublished: formData.get("isPublished") === "on",
  };

  const data = assertPostInput(raw);

  try {
    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverUrl: data.coverImage,
        tags: data.tags,
        isPublished: data.isPublished,
      },
      select: { id: true },
    });

    revalidatePath("/admin/posts");
    redirect(`/admin/posts/${post.id}/edit`);
  } catch (e: unknown) {
    if (isPrismaUniqueError(e)) throw new Error("El slug ya existe. Usa otro.");
    throw e;
  }
}

export async function updatePost(postId: string, formData: FormData) {
  await mustBeAdmin();

  const raw = {
    title: getString(formData, "title"),
    slug: normalizeSlug(getString(formData, "slug")),
    excerpt: getString(formData, "excerpt"),
    content: getString(formData, "content"),
    coverImage: getString(formData, "coverUrl"),
    tags: getString(formData, "tags"),
    isPublished: formData.get("isPublished") === "on",
  };

  const data = assertPostInput(raw);

  try {
    await prisma.post.update({
      where: { id: postId },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverUrl: data.coverImage,
        tags: data.tags,
        isPublished: data.isPublished,
      },
    });

    revalidatePath("/admin/posts");
    revalidatePath(`/admin/posts/${postId}/edit`);
  } catch (e: unknown) {
    if (isPrismaUniqueError(e)) throw new Error("El slug ya existe. Usa otro.");
    throw e;
  }
}

export async function deletePost(postId: string) {
  await mustBeAdmin();

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function togglePublish(postId: string) {
  await mustBeAdmin();

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { isPublished: true },
  });

  if (!post) throw new Error("Post no encontrado.");

  await prisma.post.update({
    where: { id: postId },
    data: { isPublished: !post.isPublished },
  });

  revalidatePath("/admin/posts");
}
