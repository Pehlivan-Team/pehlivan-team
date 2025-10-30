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

export default async function PublicProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfile(params.username);
  if (!profile) {
    notFound(); // Kullanıcı bulunamazsa 404 sayfası
  }

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
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <main className="flex flex-col items-center text-center">
          <EditProfileButton profileUsername={profile.username} profilePicture={profile.profilePictureUrl} />

          <h1 className="text-4xl font-bold text-white">{profile.name}</h1>
          <p className="text-xl text-muted-foreground">@{profile.username}</p>

          {profile.team && (
            <Badge className="mt-4 bg-red-600 hover:bg-red-700 text-white">
              {profile.team}
            </Badge>
          )}

          <p className="text-lg text-slate-300 max-w-lg mt-6">{profile.bio}</p>

          {socials.length > 0 && (
            <div className="flex gap-4 mt-8">
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

          <br />
        </main>
      </div>
    </div>
  );
}
