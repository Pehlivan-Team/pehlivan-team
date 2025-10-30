"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
// GitHub ve LinkedIn ikonlarını eklemek için (opsiyonel, `lucide-react`'ten import edin)
import { Github, LinkedinIcon, ChromeIcon } from "lucide-react"; // Google için ChromeIcon kullanabiliriz

export default function GirisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProviderLoading, setIsProviderLoading] = useState<string | null>(
    null
  );

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false, // Hata olursa sayfada kal
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Giriş başarılı!");
        router.push(callbackUrl);
      }
    } catch (error) {
      toast.error("Beklenmedik bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    setIsProviderLoading(provider);
    signIn(provider, { callbackUrl: callbackUrl });
    // Yönlendirme başlayacağı için setIsLoading(false) demeye gerek yok
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 px-4 py-12 pt-24">
      <Card className="w-full max-w-md bg-slate-800/60 border-slate-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Giriş Yap</CardTitle>
          <CardDescription className="text-gray-300">
            Hesabınıza erişmek için bir yöntem seçin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sosyal Medya Butonları */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-12 text-lg bg-slate-700 hover:bg-slate-600 border-slate-600"
              onClick={() => handleOAuthLogin("google")}
              disabled={!!isProviderLoading}
            >
              {isProviderLoading === "google" ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <ChromeIcon className="mr-2 h-5 w-5" /> // Google ikonu
              )}
              Google ile Devam Et
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 text-lg bg-slate-700 hover:bg-slate-600 border-slate-600"
              onClick={() => handleOAuthLogin("github")}
              disabled={!!isProviderLoading}
            >
              {isProviderLoading === "github" ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Github className="mr-2 h-5 w-5" />
              )}
              GitHub ile Devam Et
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 text-lg bg-slate-700 hover:bg-slate-600 border-slate-600"
              onClick={() => handleOAuthLogin("linkedin")}
              disabled={!!isProviderLoading}
            >
              {isProviderLoading === "linkedin" ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LinkedinIcon className="mr-2 h-5 w-5" />
              )}
              LinkedIn ile Devam Et
            </Button>
          </div>

          {/* Ayırıcı */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 border-t border-slate-600"></div>
            <span className="text-xs text-gray-400 uppercase">veya</span>
            <div className="flex-1 border-t border-slate-600"></div>
          </div>

          {/* E-posta/Şifre Formu */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-900 border-slate-700 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-900 border-slate-700 h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-lg bg-red-600 hover:bg-red-700"
              disabled={isLoading || !!isProviderLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Giriş Yap
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center block">
          <p className="text-sm text-gray-400">
            Hesabın yok mu?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-red-400 hover:underline"
            >
              Kayıt Ol
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}