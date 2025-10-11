import { PostForm } from "../_components/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Yeni Blog Yazısı Oluştur</h1>
      <PostForm />
    </div>
  );
}