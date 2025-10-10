"use client";

import React from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  LayoutDashboard,
  Link as LinkIcon,
  ListTodo,
  Milestone,
} from "lucide-react";

// Admin menüsündeki linkleri merkezi bir yerde tanımlayalım
const navLinks = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/links", label: "Kısa Linkler", Icon: LinkIcon },
  { href: "/admin/needs", label: "İhtiyaç Listesi", Icon: ListTodo },
  { href: "/admin/timeline", label: "Tarihçe Yönetimi", Icon: Milestone },
];

export function MobileSidebar() {
  return (
    <header className="md:hidden sticky top-0 flex h-14 items-center gap-4 border-b bg-gray-950 px-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menüyü Aç</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs bg-gray-950 border-slate-800">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/admin"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              {/* Logo veya baş harf buraya eklenebilir */}
              <span className="text-white">PT</span>
              <span className="sr-only">Pehlivan Team Admin</span>
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
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}