import { firestoreAdmin } from "@/lib/firebase-admin";
import { notFound } from "next/navigation";
import { PostForm } from "../../_components/PostForm";
import { Post } from "@/types/blog";

async function getPost(id: string): Promise<Post | null> {
  const docRef = firestoreAdmin.collection("posts").doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return null;
  }

  const data = docSnap.data()!;
  return {
    id: docSnap.id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    imageUrl: data.imageUrl || "",
    isPublished: data.isPublished,
    author: data.author,
    authorImage: data.authorImage || "",
    createdAt: data.createdAt.toDate().toISOString(),
    updatedAt: data.updatedAt.toDate().toISOString(),
  };
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    return notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Yazıyı Düzenle</h1>
      <PostForm initialData={post} />
    </div>
  );
}