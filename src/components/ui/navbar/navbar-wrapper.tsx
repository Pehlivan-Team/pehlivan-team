"use client";

import { usePathname } from "next/navigation";
import { Topbar, BottomBar } from "./topbar";
import FeedMobileBottomBar from "./FeedMobileBottomBar";

export function NavbarWrapper() {
  const pathname = usePathname();

  // Hide navigation for admin routes
  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) return null;

  const isFeedOrProfile = pathname.startsWith("/feed") || pathname.startsWith("/profile");

  // On feed/profile pages we don't show the Topbar — render a feed/profile-specific mobile bottom bar
  if (isFeedOrProfile) {
    return <FeedMobileBottomBar />;
  }

  // Default: show full top + bottom bars
  return (
    <>
      <Topbar />
      <BottomBar />
    </>
  );
}