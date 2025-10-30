"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

function ProfileClientComponent() {
  const { data: session } = useSession();
  console.log("Session Data:", session);
  console.log("User Data:", session?.user.image);
  if (!session) {
    return (
      <div className="text-xl m-8">
        Profilinizi görüntülemek için lütfen giriş yapın.
      </div>
    );
  }

  return redirect(`/profile/${session.user.username}`);
}

export default ProfileClientComponent;
