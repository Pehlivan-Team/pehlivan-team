"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Github, Linkedin, Twitter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { teamsData } from "@/constants/teams"; //
import { ImageUploader } from "@/components/admin/ImageUploader"; //
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";

export default function ProfileEditPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Profil verilerini API'den çek
  useEffect(() => {
    if (status === "authenticated") {
      setIsLoading(true);
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
        })
        .catch((err) =>
          toast.error("Profil verileri yüklenemedi: " + err.message)
        )
        .finally(() => setIsLoading(false));
    }
  }, [status]);

  // 2. Formdaki değişiklikleri state'e işle
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      socialLinks: {
        ...profile.socialLinks,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleTeamChange = (value: string) => {
    setProfile({ ...profile, team: value });
  };

  const handleProfilePictureChange = (url: string) => {
    setProfile({ ...profile, profilePictureUrl: url });
  };

  // 3. Formu API'ye gönder
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Bir hata oluştu");
      }
      toast.success("Profil başarıyla güncellendi!");
    } catch (error: any) {
      toast.error(`Hata: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <h1 className="text-2xl mb-4">Lütfen Giriş Yapın</h1>
        <p className="text-muted-foreground mb-4">
          Profilini düzenlemek için giriş yapman gerekiyor.
        </p>
        <Button asChild>
          <Link href="/api/auth/signin">Giriş Yap</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-12 pt-24 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: public profile-like preview */}
        <aside className="lg:col-span-4">
          <Card className="bg-slate-900/70 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Profil Önizleme</CardTitle>
              <CardDescription>Herkese nasıl göründüğünü burada görebilirsin.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 ring-2 ring-emerald-600">
                  {profile.profilePictureUrl ? (
                    <AvatarImage src={profile.profilePictureUrl} alt={profile.name || "avatar"} />
                  ) : (
                    <AvatarFallback>
                      <UserIcon className="h-8 w-8 opacity-70" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="min-w-0">
                  <div className="text-xl font-semibold text-white truncate">{profile.name || session?.user?.name || "Profil"}</div>
                  <div className="text-sm text-slate-300 truncate">@{profile.username || session?.user?.email?.split("@")[0]}</div>
                </div>
              </div>

              {profile.team && (
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-full border border-emerald-600/50 bg-emerald-700/20 px-3 py-1 text-xs text-emerald-200">
                    {profile.team}
                  </span>
                </div>
              )}

              {profile.bio && (
                <p className="mt-4 text-slate-200 whitespace-pre-wrap">{profile.bio}</p>
              )}

              {/* Socials */}
              <div className="mt-5 flex items-center gap-4">
                {profile.socialLinks?.github && (
                  <Link href={`https://github.com/${profile.socialLinks.github}`} target="_blank" className="text-slate-300 hover:text-white" aria-label="GitHub">
                    <Github className="h-5 w-5" />
                  </Link>
                )}
                {profile.socialLinks?.linkedin && (
                  <Link href={`https://www.linkedin.com/in/${profile.socialLinks.linkedin}`} target="_blank" className="text-slate-300 hover:text-white" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                )}
                {profile.socialLinks?.twitter && (
                  <Link href={`https://twitter.com/${profile.socialLinks.twitter}`} target="_blank" className="text-slate-300 hover:text-white" aria-label="Twitter">
                    <Twitter className="h-5 w-5" />
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="mt-6"><a className="sr-only">Stats</a></div>
              <div className="mt-2">
                <SettingsFollowStats username={profile.username || (session?.user?.username as string) || ''} />
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Right: editable form */}
        <section className="lg:col-span-8">
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="text-3xl">Profilini Düzenle</CardTitle>
                <CardDescription>
                  Herkese açık profilinde görünecek bilgileri buradan güncelleyebilirsin.
                </CardDescription>
              </div>
              <Button type="submit" form="profile-edit-form" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Kaydet
              </Button>
            </CardHeader>
            <CardContent>
              <form id="profile-edit-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Profil Resmi</Label>
                  <ImageUploader onUploadComplete={handleProfilePictureChange} initialImageUrl={profile.profilePictureUrl || (session?.user?.image as string) || ""} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Kullanıcı Adı (@)</Label>
                    <Input
                      id="username"
                      name="username"
                      value={profile.username || ""}
                      onChange={handleChange}
                      placeholder="pehlivan_team_uyesi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Görünür İsim</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name || ""}
                      disabled
                      className="disabled:opacity-70"
                    />
                    <p className="text-xs text-muted-foreground">
                      (Google hesabınızdan alınır, değiştirilemez.)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profile.bio || ""}
                    onChange={handleChange}
                    placeholder="Kendinden kısaca bahset..."
                    maxLength={500}
                  />
                  <div className="text-xs text-muted-foreground text-right">{(profile.bio?.length || 0)}/500</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team">Takım / Grup</Label>
                  <Select value={profile.team} onValueChange={handleTeamChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Takımını seç..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900">
                      {teamsData.map((team) => (
                        <SelectItem key={team.name} value={team.name}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sosyal Medya Linkleri */}
                <div className="space-y-4">
                  <Label>Sosyal Medya Linkleri</Label>
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5 text-muted-foreground" />
                    <Input
                      name="github"
                      placeholder="github_kullanici_adiniz"
                      value={profile.socialLinks?.github || ""}
                      onChange={handleSocialChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-5 w-5 text-muted-foreground" />
                    <Input
                      name="linkedin"
                      placeholder="linkedin_kullanici_adiniz"
                      value={profile.socialLinks?.linkedin || ""}
                      onChange={handleSocialChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-muted-foreground" />
                    <Input
                      name="twitter"
                      placeholder="twitter_kullanici_adiniz"
                      value={profile.socialLinks?.twitter || ""}
                      onChange={handleSocialChange}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Kaydet
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href={profile.username ? `/profile/${profile.username}` : "/profile"}>Profili Gör</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function SettingsFollowStats({ username }: { username: string }) {
  const [counts, setCounts] = useState<{ posts?: number; followers?: number; following?: number }>({});
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        // posts count (lightweight): query author's posts count
        const postsRes = await fetch(`/api/search?type=posts&query=${encodeURIComponent('@' + username)}`);
        // Fallback: just ignore if endpoint differs; leave undefined
      } catch {}
      try {
        const res = await fetch(`/api/follow/${username}`);
        const json = await res.json();
        if (active) setCounts((c) => ({ ...c, followers: json.followersCount, following: json.followingCount }));
      } catch {}
    }
    if (username) load();
    return () => { active = false; };
  }, [username]);

  return (
    <div className="mt-6 grid grid-cols-3 gap-3 text-center">
      <div className="rounded-lg border border-white/10 bg-black/20 p-3">
        <div className="text-lg font-semibold text-white">{typeof counts.posts === 'number' ? counts.posts : '—'}</div>
        <div className="text-xs text-slate-300">Gönderi</div>
      </div>
      <a href={`/profile/${username}/followers`} className="rounded-lg border border-white/10 bg-black/20 p-3 hover:bg-black/30">
        <div className="text-lg font-semibold text-white">{typeof counts.followers === 'number' ? counts.followers : '—'}</div>
        <div className="text-xs text-slate-300">Takipçi</div>
      </a>
      <a href={`/profile/${username}/following`} className="rounded-lg border border-white/10 bg-black/20 p-3 hover:bg-black/30">
        <div className="text-lg font-semibold text-white">{typeof counts.following === 'number' ? counts.following : '—'}</div>
        <div className="text-xs text-slate-300">Takip</div>
      </a>
    </div>
  );
}
