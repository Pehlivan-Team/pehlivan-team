import admin from "firebase-admin";
import { firestoreAdmin } from "@/lib/firebase-admin";
import Link from "next/link";
import PostCard from "../_components/PostCard";

export default async function UserPostsPage({
  params,
  searchParams,
}: {
  params: { username: string };
  searchParams: { cursor?: string };
}) {
  const username = params.username;
  const limit = 10;

  let query = firestoreAdmin
    .collection("posts")
    .where("authorUsername", "==", username)
    .orderBy("createdAt", "desc")
    .limit(limit + 1);

  if (searchParams?.cursor) {
    const cursorTs = admin.firestore.Timestamp.fromDate(
      new Date(searchParams.cursor)
    );
    query = query.startAfter(cursorTs);
  }

  const snapshot = await query.get();
  const docs = snapshot.docs;
  const hasNext = docs.length > limit;
  const pageDocs = hasNext ? docs.slice(0, limit) : docs;
  const posts = pageDocs.map((d) => {
    const data: any = d.data();
    return {
      id: d.id,
      authorUsername: data.authorUsername,
      content: data.content || "",
      imageUrl: data.imageUrl || undefined,
      likeCount: data.likeCount || 0,
      commentCount: data.commentCount || 0,
    };
  });
  const nextCursor = hasNext
    ? pageDocs[pageDocs.length - 1].get("createdAt")?.toDate()?.toISOString()
    : undefined;

  return (
    <div className="min-h-screen pt-10 bg-gradient-to-r from-slate-800 to-emerald-900">
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <h1 className="text-3xl font-bold text-white">Posts by @{username}</h1>
        <div className="mt-6 space-y-4">
          {posts.map((p: any) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>

        {nextCursor ? (
          <div className="mt-8 flex justify-center">
            <Link
              href={`/profile/${username}/posts?cursor=${encodeURIComponent(
                nextCursor
              )}`}
              className="text-emerald-300 hover:underline"
            >
              Load more
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}


