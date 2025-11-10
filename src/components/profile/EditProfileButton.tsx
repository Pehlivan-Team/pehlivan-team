"use client"
import { Pencil } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface EditProfileButtonProps {
  profileUsername: string
  profilePicture: string
  className?: string
}

export default function EditProfileButton({ profileUsername, profilePicture, className }: EditProfileButtonProps) {
  const { data: session } = useSession()
  const isOwner = session?.user?.username === profileUsername

  return (
    <div className={cn('relative group inline-block', className)}>
      {isOwner ? (
        <Link href="/settings/profile" className="block">
          <div className="relative">
            <Avatar className="w-[110px] h-[110px] md:w-[150px] md:h-[150px] ring-2 ring-emerald-600 shadow-lg shadow-emerald-900/30 transition-transform group-hover:scale-[1.02]">
              {profilePicture ? (
                <AvatarImage src={profilePicture} alt={`${profileUsername} profil resmi`} />
              ) : (
                <AvatarFallback className="text-xl bg-gradient-to-br from-slate-700 to-slate-800">
                  {profileUsername?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute inset-0 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="flex items-center gap-1 text-sm font-medium text-white bg-emerald-600/80 px-3 py-1 rounded-full border border-emerald-500 shadow">
                <Pencil className="w-4 h-4" /> Düzenle
              </span>
            </div>
          </div>
        </Link>
      ) : (
        <Avatar className="w-[110px] h-[110px] md:w-[150px] md:h-[150px] ring-2 ring-slate-600 shadow-md">
          {profilePicture ? (
            <AvatarImage src={profilePicture} alt={`${profileUsername} profil resmi`} />
          ) : (
            <AvatarFallback className="text-xl bg-gradient-to-br from-slate-700 to-slate-800">
              {profileUsername?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          )}
        </Avatar>
      )}
    </div>
  )
}
