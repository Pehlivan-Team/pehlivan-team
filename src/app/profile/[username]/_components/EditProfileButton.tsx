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
  const isOwner = session?.user?.username === profileUsername;

  // Owner: clickable avatar that links to settings with hover overlay
  return (
    <div className="relative group w-[150px] h-[150px] inline-block">
      {isOwner ? (
        <Link href={`/profile/settings`} className="block w-[150px] h-[150px]">
          <Avatar className="w-[150px] h-[150px] ring-2 ring-emerald-600 shadow-lg shadow-emerald-900/30 transition-transform group-hover:scale-[1.02]">
            {profilePicture ? (
              <AvatarImage src={profilePicture} alt={profileUsername + " profil resmi"} />
            ) : (
              <AvatarFallback className="text-xl bg-gradient-to-br from-slate-700 to-slate-800">
                {profileUsername?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm font-medium text-white bg-emerald-600/80 px-3 py-1 rounded-full border border-emerald-500 shadow">
              Düzenle
            </span>
          </div>
        </Link>
      ) : (
        <Avatar className="w-[150px] h-[150px] ring-2 ring-slate-600 shadow-md">
          {profilePicture ? (
            <AvatarImage src={profilePicture} alt={profileUsername + " profil resmi"} />
          ) : (
            <AvatarFallback className="text-xl bg-gradient-to-br from-slate-700 to-slate-800">
              {profileUsername?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          )}
        </Avatar>
      )}
    </div>
  );
};

export default EditProfileButton;
