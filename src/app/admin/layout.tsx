import React from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { DesktopSidebar } from './_components/DesktopSide' // 1. Yeni masaüstü bileşenini import et
import { MobileSidebar } from './_components/MobileSide'
import NoPermError from './_components/NoPermError'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side session check to protect the entire /admin subtree.
  const session = await getServerSession(authOptions)

  // If not logged in, redirect to login
  if (!session) {
    redirect('/auth/login')
  }

  // If logged in but not an admin, show a friendly no-permission UI
  if (!session?.user?.isAdmin) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-950 to-gray-700/80 text-white items-center justify-center p-8">
        <NoPermError />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-950 to-gray-700/80 text-white">
      {/* 2. Eski <aside> kodunu yeni bileşen ile değiştir */}
      <DesktopSidebar />

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        {' '}
        {/* sm:pl-14 -> sm:pl-64 */}
        <MobileSidebar />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  )
}
