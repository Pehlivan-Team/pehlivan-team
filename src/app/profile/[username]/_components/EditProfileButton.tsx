"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const EditProfileButton = ({
  profileUsername,
  profilePicture,
}: {
  profileUsername: string;
  profilePicture: string;
}) => {
  const { data: session } = useSession();
  // If viewer is not the owner, show a static avatar
  if (session?.user.username !== profileUsername) {
    return (
      <Avatar className="w-[150px] h-[150px] border-4 border-red-500">
        {profilePicture ? (
          <AvatarImage src={profilePicture} alt={profileUsername + " profil resmi"} />
        ) : (
          <AvatarFallback>{profileUsername?.[0]?.toUpperCase() || "U"}</AvatarFallback>
        )}
      </Avatar>
    );
  }

  // Owner: clickable avatar that links to settings with hover overlay
  return (
    <Link href={`/profile/settings`} className="relative group w-[150px] h-[150px] rounded-full cursor-pointer inline-block">
      <Avatar className="w-[150px] h-[150px] border-4 border-red-500">
        {profilePicture ? (
          <AvatarImage src={profilePicture} alt={profileUsername + " profil resmi"} />
        ) : (
          <AvatarFallback>{profileUsername?.[0]?.toUpperCase() || "U"}</AvatarFallback>
        )}
      </Avatar>
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center \
               opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      >
        <span className="text-lg text-white px-3 py-1 rounded-md">Düzenle</span>
      </div>
    </Link>
  );
};

export default EditProfileButton;
