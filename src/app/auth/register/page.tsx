"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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

export default function KayitPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Önce kayıt API'sine istek at
      const regResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username, name }),
      });

      const data = await regResponse.json();

      if (!regResponse.ok) {
        throw new Error(data.error || "Kayıt sırasında bir hata oluştu.");
      }

      // Kayıt başarılıysa, kullanıcıyı hemen giriş yap
      toast.success("Hesap oluşturuldu! Şimdi giriş yapılıyor...");
      const signInResult = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error(`Giriş hatası: ${signInResult.error}`);
        // Giriş başarısız olsa bile kayıt başarılı, giriş sayfasına yönlendir
        router.push("/giris");
      } else {
        toast.success("Giriş başarılı!");
        router.push("/"); // Ana sayfaya yönlendir
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 px-4 py-12 pt-24">
      <Card className="w-full max-w-md bg-slate-800/60 border-slate-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Hesap Oluştur</CardTitle>
          <CardDescription className="text-gray-300">
            E-posta ve şifre ile topluluğa katıl.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Görünür İsim</Label>
                <Input
                  id="name"
                  placeholder="İsim Soyisim"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-900 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı (@)</Label>
                <Input
                  id="username"
                  placeholder="kullaniciadi"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-gray-900 border-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-900 border-slate-700"
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
                className="bg-gray-900 border-slate-700"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-lg bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Kayıt Ol
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center block">
          <p className="text-sm text-gray-400">
            Zaten bir hesabın var mı?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-red-400 hover:underline"
            >
              Giriş Yap
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
