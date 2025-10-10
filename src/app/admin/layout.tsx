import React from "react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { LayoutDashboard, Link as LinkIcon, ListTodo, Milestone } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    // Bu normalde middleware tarafından yakalanır, ama bir ek güvenlik katmanı olarak kalabilir.
    return (
      <div className="min-h-screen flex items-center justify-center">
        Erişim yetkiniz yok.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex pt-16">
      <aside className="w-64 bg-gray-950 p-4 border-r border-slate-800 hidden md:block">
        <nav className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold mb-2">Admin Paneli</h2>
          <Link href="/admin" className="flex items-center gap-2 p-2 rounded hover:bg-slate-800">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/links" className="flex items-center gap-2 p-2 rounded hover:bg-slate-800">
            <LinkIcon size={20} />
            <span>Kısa Linkler</span>
          </Link>
          <Link href="/admin/needs" className="flex items-center gap-2 p-2 rounded hover:bg-slate-800">
            <ListTodo size={20} />
            <span>İhtiyaç Listesi</span>
          </Link>
           <Link href="/admin/timeline" className="flex items-center gap-2 p-2 rounded hover:bg-slate-800">
            <Milestone size={20} />
            <span>Tarihçe Yönetimi</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}