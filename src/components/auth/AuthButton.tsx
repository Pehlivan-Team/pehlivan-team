"use client";
/* PC için kimlik doğrulama butonu componenti
 *Kullanıcı oturum durumuna göre farklı butonlar gösterir
  - Giriş yapmış kullanıcılar için profil bilgileri ve çıkış butonu
  - Giriş yapmamış kullanıcılar için Google ile giriş butonu
 */
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function AuthButton() {
  const { data: session } = useSession();
  console.log("Kullanıcı oturumu:", session);
  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-20 rounded-full">
            <Image
              src={session.user.image ?? ""}
              alt={session.user.name ?? "Kullanıcı profili"}
              width={500}
              height={500}
              className="rounded-full"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-slate-900/80"
          align="end"
          forceMount
        >
          <DropdownMenuItem>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium  text-white">
                {session.user.name}
              </p>
              <p className="text-xs  text-white">{session.user.email}</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* YENİ KOD: Eğer kullanıcı admin ise bu butonu göster */}
          {session.user.isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Admin Paneli</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={"/profile/" + session.user.username}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Çıkış Yap</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={() => signIn()} variant="outline">
      <LogIn className="mr-2 h-4 w-4" />
      Giriş Yap
    </Button>
  );
}
