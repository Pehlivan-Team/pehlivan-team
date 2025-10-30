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
    <div className="container mx-auto max-w-3xl py-12 pt-24 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Profilini Düzenle</CardTitle>
          <CardDescription>
            Herkese açık profilinde görünecek bilgileri buradan
            güncelleyebilirsin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Profil Resmi</Label>
              <ImageUploader onUploadComplete={handleProfilePictureChange} />
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

            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kaydet
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
