import { firestoreAdmin } from "@/lib/firebase-admin";
import { BlogClientPage } from "./_components/BlogClientPage";
import { Post } from "@/types/blog";
async function getPosts(): Promise<Post[]> {
  const postsSnapshot = await firestoreAdmin
    .collection("posts")
    .orderBy("createdAt", "desc")
    .get();

  if (postsSnapshot.empty) {
    return [];
  }

  return postsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      slug: data.slug,
      isPublished: data.isPublished,
      createdAt: data.createdAt.toDate().toISOString(),
    } as Post;
  });
}

export default async function AdminBlogPage() {
  const posts = await getPosts();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Blog Yönetimi</h1>
      <BlogClientPage initialPosts={posts} />
    </div>
  );
}
