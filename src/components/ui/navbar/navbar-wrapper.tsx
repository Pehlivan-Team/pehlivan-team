'use client'

import { usePathname } from 'next/navigation'

import FeedMobileBottomBar from './FeedMobileBottomBar'
import { Topbar, BottomBar } from './topbar'

export function NavbarWrapper() {
  const pathname = usePathname()

  // Hide navigation for admin routes
  const isAdminRoute = pathname.startsWith('/admin')
  if (isAdminRoute) return null

  const socialRoutes = ['/feed', '/profile', '/search', '/posts/', '/messages', "/settings/profile"]

  const isMinimalNav = socialRoutes.some((route) => pathname.startsWith(route))

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
