'use client'

import { usePathname } from 'next/navigation'

import FeedMobileBottomBar from './FeedMobileBottomBar'
import { Topbar, BottomBar } from './topbar'

export function NavbarWrapper() {
  const pathname = usePathname()

  // Hide navigation for admin routes
  const isAdminRoute = pathname.startsWith('/admin')
  if (isAdminRoute) return null

  const isMinimalNav =
    pathname.startsWith('/feed') || pathname.startsWith('/profile') || pathname.startsWith('/search') || pathname.startsWith('/posts/')

  // On feed/profile/search pages we don't show the Topbar — render mobile bottom bar only
  if (isMinimalNav) {
    return <FeedMobileBottomBar />
  }

  // Default: show full top + bottom bars
  return (
    <>
      <Topbar />
      <BottomBar />
    </>
  )
}
