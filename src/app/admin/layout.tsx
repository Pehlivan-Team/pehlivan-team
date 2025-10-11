import React from "react";
import { MobileSidebar } from "./_components/MobileSide";
import { DesktopSidebar } from "./_components/DesktopSide"; // 1. Yeni masaüstü bileşenini import et

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* 2. Eski <aside> kodunu yeni bileşen ile değiştir */}
      <DesktopSidebar />

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        {" "}
        {/* sm:pl-14 -> sm:pl-64 */}
        <MobileSidebar />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
