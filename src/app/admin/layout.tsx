import React from "react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import {
  LayoutDashboard,
  Link as LinkIcon,
  ListTodo,
  Milestone,
} from "lucide-react";
import { MobileSidebar } from "./_components/MobileSideBar";

const navLinks = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/links", label: "Kısa Linkler", Icon: LinkIcon },
  { href: "/admin/needs", label: "İhtiyaç Listesi", Icon: ListTodo },
  { href: "/admin/timeline", label: "Tarihçe Yönetimi", Icon: Milestone },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Erişim yetkiniz yok.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-900 text-white">
      {/* MASAÜSTÜ SOL MENÜ */}
      <aside className="hidden border-r bg-gray-950/95 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="">Pehlivan Team</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navLinks.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* MOBİL VE ANA İÇERİK ALANI */}
      <div className="flex flex-col">
        <MobileSidebar /> {/* Mobil üst barı buraya ekledik */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}