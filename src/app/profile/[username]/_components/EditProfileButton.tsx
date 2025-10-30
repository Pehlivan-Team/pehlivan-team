"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const EditProfileButton = ({
  profileUsername,
  profilePicture,
}: {
  profileUsername: string;
  profilePicture: string;
}) => {
  const { data: session } = useSession();
  if (session?.user.username !== profileUsername) {
    return (
      <Image
        src={profilePicture}
        alt={profileUsername + " profil resmi"}
        width={150}
        height={150}
        className="rounded-full border-4 border-red-500"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    );
  }
  return (
    <Link
      href={`/profile/settings`}
      className="relative group w-[150px] h-[150px] rounded-full cursor-pointer"
    >
      <Image
        src={profilePicture}
        alt={profileUsername + " profil resmi"}
        width={150}
        height={150}
        className="rounded-full border-4 border-red-500 object-cover 
               transition-opacity duration-300 group-hover:opacity-40"
      />
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center 
               opacity-0 group-hover:opacity-100 transition-opacity duration-300
               pointer-events-none" // Yazının tıklamaları engellememesi için
      >
        <span className="text-lg text-white  px-3 py-1 rounded-md">
          Düzenle
        </span>
      </div>
    </Link>
  );
};

export default EditProfileButton;
