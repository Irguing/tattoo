import PostForm from "../ui/PostForm";
import { createPost } from "../actions";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Nuevo post</h1>
        <p className="text-sm text-neutral-500">Crea un draft o publícalo directamente.</p>
      </div>

      <PostForm
        mode="create"
        action={createPost}
        initial={{
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          coverUrl: "",
          tags: "",
          isPublished: false,
        }}
      />
    </div>
  );
}
