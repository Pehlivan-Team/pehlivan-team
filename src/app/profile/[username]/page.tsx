import { firestoreAdmin } from "@/lib/firebase-admin"; //
import { UserProfile } from "@/types/profile";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Twitter, ExternalLink, Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EditProfileButton from "./_components/EditProfileButton";
import admin from "firebase-admin";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import FloatingPostButton from "@/components/post/FloatingPostButton";
import FeedProfileSidebar from "@/components/ui/navbar/FeedProfileSidebar";
import { Card } from "@/components/ui/card";

// Sunucu tarafında veriyi çek
async function getProfile(username: string): Promise<UserProfile | null> {
  try {
    const usersRef = firestoreAdmin.collection("users");
    const q = usersRef.where("username", "==", username).limit(1);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // E-posta gibi özel verileri ayıkla
    const publicProfile: UserProfile = {
      username: userData.username,
      name: userData.name,
      bio: userData.bio,
      team: userData.team,
      profilePictureUrl: userData.profilePictureUrl,
      socialLinks: userData.socialLinks,
      email: "", // Public sayfaya e-posta gönderme
      image: "", // Public sayfaya orijinal google resmini gönderme
    };

    return publicProfile;
  } catch (error) {
    console.error("Profil getirme hatası:", error);
    return null;
  }
}

async function getLatestPosts(username: string) {
  try {
    const q = firestoreAdmin
      .collection("posts")
      .where("authorUsername", "==", username)
      .orderBy("createdAt", "desc")
      .limit(3);
    const snap = await q.get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("Son postlar getirilemedi", e);
    return [] as any[];
  }
}

async function getLatestBlogsByAuthor(authorName: string) {
  try {
    const q = firestoreAdmin
      .collection("posts")
      .where("author", "==", authorName)
      .where("isPublished", "==", true)
      .orderBy("createdAt", "desc")
      .limit(3);
    const snap = await q.get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("Son bloglar getirilemedi", e);
    return [] as any[];
  }
}

export default async function PublicProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfile(params.username);
  if (!profile) {
    notFound(); // Kullanıcı bulunamazsa 404 sayfası
  }

  const latestPosts = await getLatestPosts(profile.username);
  const latestBlogs = await getLatestBlogsByAuthor(profile.name);

  const socials = [
    {
      name: "GitHub",
      url: `https://github.com/${profile.socialLinks?.github}`,
      username: profile.socialLinks?.github,
      Icon: Github,
    },
    {
      name: "LinkedIn",
      url: `https://linkedin.com/in/${profile.socialLinks?.linkedin}`,
      username: profile.socialLinks?.linkedin,
      Icon: Linkedin,
    },
    {
      name: "Twitter",
      url: `https://twitter.com/${profile.socialLinks?.twitter}`,
      username: profile.socialLinks?.twitter,
      Icon: Twitter,
    },
  ].filter((social) => social.username); // Sadece dolu olanları filtrele

  return (
    <div className="min-h-screen pt-10 bg-gradient-to-r from-slate-800 to-emerald-900">
      <main className="container mx-auto max-w-6xl py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <FeedProfileSidebar />
          </aside>

          <section className="lg:col-span-9">
            {/* Header: left = avatar/name/team/username, right = bio & socials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start text-left">
              {/* Left column */}
              <Card className="flex flex-col items-start space-y-4 p-4">
                <div className="flex flex-col items-center text-center gap-4">
                  <div>
                    <EditProfileButton
                      profileUsername={profile.username}
                      profilePicture={profile.profilePictureUrl || "/default-avatar.png"}
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                    <p className="text-sm text-slate-400 mt-1">@{profile.username}</p>
                    {profile.team ? (
                      <Badge className="mt-2 bg-red-600 hover:bg-red-700 text-white">{profile.team}</Badge>
                    ) : null}
                  </div>
                </div>
              </Card>

              {/* Right column (span 2) */}
              <div className="md:col-span-2">
                <div className="prose max-w-none prose-invert">
                  <p className="text-lg text-slate-300">{profile.bio}</p>
                </div>

                {socials.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-6">
                    {socials.map((social) => (
                      <Button
                        key={social.name}
                        variant="outline"
                        className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                        asChild
                      >
                        <Link href={social.url} target="_blank">
                          <social.Icon className="mr-2 h-4 w-4" />
                          {social.name}
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Posts Section */}
              <section className="w-full mt-12 text-left">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-white">Posts</h2>
                  <Link
                    className="text-sm text-emerald-300 hover:underline"
                    href={`/profile/${profile.username}/posts`}
                  >
                    See all
                  </Link>
                </div>

                {latestPosts.length === 0 ? (
                  <p className="text-slate-300 mt-4">No posts yet.</p>
                ) : (
                  <ul className="mt-4 space-y-4">
                    {latestPosts.map((p: any) => (
                      <li key={p.id} className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                        <p className="text-slate-100 whitespace-pre-wrap">{p.content}</p>
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.imageUrl}
                            alt="post image"
                            className="mt-3 max-h-72 w-full object-cover rounded"
                          />
                        ) : null}
                        <div className="text-sm text-slate-400 mt-2">
                          <span>{p.likeCount || 0} likes</span>
                          <span className="mx-2">•</span>
                          <span>{p.commentCount || 0} comments</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Blog Posts Section */}
              <section className="w-full mt-12 text-left">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-white">Blog Posts</h2>
                  <Link
                    className="text-sm text-emerald-300 hover:underline"
                    href={`/blog`}
                  >
                    See all
                  </Link>
                </div>

                {latestBlogs.length === 0 ? (
                  <p className="text-slate-300 mt-4">No blog posts yet.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {latestBlogs.map((b: any) => (
                      <li key={b.slug} className="flex items-start justify-between">
                        <div>
                          <Link href={`/blog/${b.slug}`} className="text-slate-100 hover:underline">
                            {b.title}
                          </Link>
                          <div className="text-xs text-slate-400">
                            {(() => {
                              const v = b.createdAt;
                              const d = v?.toDate ? v.toDate() : (v ? new Date(v) : null);
                              return d && !isNaN(d as any) ? format(d as Date, "dd MMM yyyy", { locale: tr }) : "";
                            })()}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <br />
            </div>
          </section>
        </div>
      </main>
      <FloatingPostButton />
    </div>
  );
}
