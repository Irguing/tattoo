import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "../../ui/PostForm";
import TogglePublishButton from "../../ui/TogglePublishButton";
import DeletePostButton from "../../ui/DeletePostButton";
import { updatePost, togglePublish, deletePost } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverUrl: true,
      tags: true,
      isPublished: true,
      updatedAt: true,
    },
  });

  if (!post) return notFound();

  const boundUpdate = updatePost.bind(null, post.id);
  const boundToggle = togglePublish.bind(null, post.id);
  const boundDelete = deletePost.bind(null, post.id);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Editar post</h1>
          <p className="text-sm text-neutral-500">
            Última actualización: {new Date(post.updatedAt).toLocaleString("es-ES")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <TogglePublishButton label={post.isPublished ? "Unpublish" : "Publish"} action={boundToggle} />
          <DeletePostButton action={boundDelete} />
        </div>
      </div>

      <PostForm
        mode="edit"
        action={boundUpdate}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          coverUrl: post.coverUrl ?? "",
          tags: post.tags ?? "",
          isPublished: post.isPublished,
        }}
      />
    </div>
  );
}
