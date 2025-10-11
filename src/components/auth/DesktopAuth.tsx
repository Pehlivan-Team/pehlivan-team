"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DesktopAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Skeleton className="h-24 w-full" />;
  }

  if (session?.user) {
    return (
      <Card className="mt-auto bg-gray-900 border-slate-800">
        <CardHeader className="p-2 pt-0 md:p-4">
          <div className="flex items-center gap-3">
            <Image
              src={session.user.image ?? ""}
              alt={session.user.name ?? "Kullanıcı"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <CardTitle className="text-sm font-medium leading-none">
                {session.user.name}
              </CardTitle>
              <CardDescription className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
          <Button size="sm" className="w-full" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Çıkış Yap
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null; // Kullanıcı giriş yapmamışsa hiçbir şey gösterme
}
