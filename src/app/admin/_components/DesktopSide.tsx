'use client'

import { Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import DesktopAuth from '@/components/auth/DesktopAuth'
import { cn } from '@/lib/utils'

import { navLinks, settingsLink } from './MobileSide'

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden border-r bg-background md:flex md:flex-col w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Home className="h-6 w-6" />
            <span>Tas-Pro Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-lg font-medium lg:px-4">
            {navLinks.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all bg-white/10 hover:bg-white/20 hover:text-foreground',
                  pathname === href && 'bg-white/20 text-primary' // Aktif link stili
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <DesktopAuth />
        </div>
      </div>
    </aside>
  )
}
