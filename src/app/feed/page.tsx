import admin from "firebase-admin";
import { firestoreAdmin } from "@/lib/firebase-admin";
import FloatingPostButton from "@/components/post/FloatingPostButton";
import PostCard from "@/app/profile/[username]/_components/PostCard";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const revalidate = 30;

async function getFeed(limit = 20, cursor?: string) {
  let query = firestoreAdmin
    .collection("posts")
    .orderBy("createdAt", "desc")
    .limit(limit);

  if (cursor) {
    const cursorTs = admin.firestore.Timestamp.fromDate(new Date(cursor));
    query = query.startAfter(cursorTs);
  }

  const snapshot = await query.get();
  const docs = snapshot.docs;
  // Only include profile posts (which have authorUsername). Exclude blog posts.
  return docs
    .map((d) => {
      const data: any = d.data();
      if (!data || typeof data.authorUsername !== 'string') return null;
      return {
        id: d.id,
        authorUsername: data.authorUsername,
        content: data.content || "",
        imageUrl: data.imageUrl || undefined,
        likeCount: data.likeCount || 0,
        commentCount: data.commentCount || 0,
      };
    })
    .filter(Boolean) as any[];
}

async function getUsersForSidebar(limit = 12) {
  // deprecated for this page; keep function if needed later
  return [] as any[];
}

async function getCurrentUserProfile() {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.username) return null;
  const q = await firestoreAdmin
    .collection("users")
    .where("username", "==", session.user.username)
    .limit(1)
    .get();
  if (q.empty) return null;
  const data: any = q.docs[0].data();
  return {
    username: data.username || "",
    name: data.name || "",
    profilePictureUrl: data.profilePictureUrl || data.image || "",
    team: data.team || "",
    bio: data.bio || "",
  };
}

export default async function FeedPage() {
  const [posts, me] = await Promise.all([getFeed(), getCurrentUserProfile()]);
  return (
    <div className="min-h-screen pt-24 bg-gradient-to-r from-slate-800 to-emerald-900">
      <main className="container mx-auto max-w-6xl py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar left */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28">
              <h2 className="text-xl font-semibold text-white mb-4">Your Profile</h2>
              {me ? (
                <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-700">
                      <Image
                        src={me.profilePictureUrl || "/default-avatar.png"}
                        alt={me.name || me.username}
                        fill
                        sizes="48px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="min-w-0">
                      <Link href={`/profile/${me.username}`} className="text-slate-100 hover:underline truncate block">
                        {me.name}
                      </Link>
                      <span className="text-sm text-slate-400 truncate block">@{me.username}</span>
                    </div>
                  </div>
                  {me.team ? (
                    <div className="mt-3 text-xs text-slate-300">Team: {me.team}</div>
                  ) : null}
                  {me.bio ? (
                    <p className="mt-3 text-sm text-slate-300 line-clamp-3">{me.bio}</p>
                  ) : null}
                  <div className="mt-3">
                    <Link href={`/profile/${me.username}`} className="text-emerald-300 text-sm hover:underline">
                      View full profile →
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-slate-300">Sign in to see your profile here.</p>
              )}
            </div>
          </aside>

          {/* Feed content */}
          <section className="lg:col-span-8">
            <h1 className="text-3xl font-bold text-white mb-6">Feed</h1>
            <div className="space-y-4">
              {posts.map((p: any) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <FloatingPostButton />
    </div>
  );
}


