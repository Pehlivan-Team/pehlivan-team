"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, LayoutDashboard } from "lucide-react"; // LayoutDashboard ikonunu import et
import Image from "next/image";
import Link from "next/link"; // Link bileşenini import et
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator, // Ayırıcı için import et
} from "@/components/ui/dropdown-menu";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Image
              src={session.user.image ?? ""}
              alt={session.user.name ?? "Kullanıcı profili"}
              fill
              className="rounded-full"
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

          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Çıkış Yap</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={() => signIn("google")} variant="outline">
      <LogIn className="mr-2 h-4 w-4" />
      Giriş Yap
    </Button>
  );
}
