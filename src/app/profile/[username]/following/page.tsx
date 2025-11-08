import { firestoreAdmin } from '@/lib/firebase-admin';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

async function getFollowing(username: string) {
  const followsRef = firestoreAdmin.collection('follows');
  const snap = await followsRef.where('follower', '==', username).get();
  const targetUsernames = snap.docs.map(d => d.data().target as string);
  if (targetUsernames.length === 0) return [] as any[];
  const usersRef = firestoreAdmin.collection('users');
  const results: any[] = [];
  for (const u of targetUsernames) {
    const q = await usersRef.where('username','==', u).limit(1).get();
    if (!q.empty) {
      const doc = q.docs[0].data();
      results.push({ username: doc.username, name: doc.name || doc.username, profilePictureUrl: doc.profilePictureUrl || doc.image || '' });
    }
  }
  return results;
}

export default async function FollowingPage({ params }: { params: { username: string } }) {
  const list = await getFollowing(params.username);
  return (
    <main className="container mx-auto max-w-3xl pt-24 p-4">
      <h1 className="text-2xl font-semibold text-white mb-4">@{params.username} • Takip</h1>
      {list.length === 0 ? (
        <p className="text-slate-300">Henüz kimseyi takip etmiyor.</p>
      ) : (
        <ul className="divide-y divide-slate-700 border border-slate-700 rounded-lg bg-slate-900/60">
          {list.map((u) => (
            <li key={u.username} className="flex items-center gap-3 p-3 hover:bg-slate-800/60">
              <Avatar className="h-10 w-10">
                {u.profilePictureUrl ? <AvatarImage src={u.profilePictureUrl} alt={u.username} /> : <AvatarFallback>{u.username?.[0]?.toUpperCase()}</AvatarFallback>}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">{u.name}</div>
                <div className="text-slate-400 text-xs truncate">@{u.username}</div>
              </div>
              <Link href={`/profile/${u.username}`} className="text-emerald-300 hover:underline">Profili Gör</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
