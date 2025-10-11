"use client";

import React from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Home,
  Settings,
  LayoutDashboard,
  Link as LinkIcon,
  ListTodo,
  Milestone,
  Users2,
  LineChart,
  UserCheck,
  FileText,
} from "lucide-react";
import DesktopAuth from "@/components/auth/DesktopAuth";

// Link verileri artık burada tanımlı ve export ediliyor
export const navLinks = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/links", label: "Kısa Linkler", Icon: LinkIcon },
  { href: "/admin/blog", label: "Blog Yönetimi", Icon: FileText },
  { href: "/admin/needs", label: "İhtiyaç Listesi", Icon: ListTodo },
  { href: "/admin/timeline", label: "Tarihçe Yönetimi", Icon: Milestone },
  { href: "/admin/members", label: "Katılımcılar", Icon: Users2 },
  { href: "/admin/analytics", label: "Analitik", Icon: LineChart },
  { href: "/admin/admins", label: "Yöneticiler", Icon: UserCheck },
];

export const settingsLink = {
  href: "/admin/settings",
  label: "Ayarlar",
  Icon: Settings,
};

// Bileşen artık prop almıyor
export function MobileSidebar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menüyü Aç</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs bg-background">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Home className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Ana Sayfa</span>
            </Link>
            {navLinks.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
            <Link
              href={settingsLink.href}
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <settingsLink.Icon className="h-5 w-5" />
              {settingsLink.label}
            </Link>
          </nav>
          <div className="mt-auto">
            <DesktopAuth />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
