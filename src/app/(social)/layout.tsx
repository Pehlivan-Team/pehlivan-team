import React from 'react'

import FeedProfileSidebar from '@/components/ui/navbar/FeedProfileSidebar'

export default function SocialLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
      <main className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="hidden lg:block lg:col-span-3">
            <FeedProfileSidebar />
          </aside>
          <section className="lg:col-span-9">{children}</section>
        </div>
      </main>
    </div>
  )
}
