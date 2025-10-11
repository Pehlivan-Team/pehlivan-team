"use client";

import { usePathname } from "next/navigation";
import { Topbar, BottomBar } from "./topbar";

export function NavbarWrapper() {
  const pathname = usePathname();

  // Mevcut URL'nin "/admin" ile başlayıp başlamadığını kontrol et
  const isAdminRoute = pathname.startsWith("/admin");

  // Eğer bir admin sayfasındaysak, navigasyon barlarını gösterme (null döndür)
  if (isAdminRoute) {
    return null;
  }

  // Diğer tüm sayfalarda, normal navigasyon barlarını göster
  return (
    <>
      <Topbar />
      <BottomBar />
    </>
  );
}