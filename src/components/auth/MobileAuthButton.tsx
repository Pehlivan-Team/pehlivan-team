"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function MobileAuth() {
  const { data: session, status } = useSession();

  // Oturum durumu yükleniyorsa bir iskelet (skeleton) göster
  if (status === "loading") {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-3">
          <Image
            src={session.user.image ?? ""}
            alt={session.user.name ?? "Kullanıcı"}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-medium text-white">
              {session.user.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </div>

        {session.user.isAdmin && (
          <Button asChild variant="secondary" className="w-full justify-start">
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Admin Paneli
            </Link>
          </Button>
        )}
        <Button
          onClick={() => signOut()}
          variant="outline"
          className="w-full justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Çıkış Yap
        </Button>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa...
  return (
    <Button
      onClick={() => signIn("google")}
      className="w-full justify-start bg-red-600 hover:bg-red-700"
    >
      <LogIn className="mr-2 h-4 w-4" />
      Giriş Yap
    </Button>
  );
}
