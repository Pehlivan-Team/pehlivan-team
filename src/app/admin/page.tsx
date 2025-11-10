'use client' // Adminin adını session'dan almak için

import { Newspaper, Briefcase, Milestone, ListChecks, PlusCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Hızlı Erişim Kartları için veri
const quickLinks = [
  {
    title: 'Blog',
    description: 'Yeni bir blog yazısı oluşturun veya mevcutları düzenleyin.',
    href: '/admin/blog',
    newHref: '/admin/blog/new',
    Icon: Newspaper,
  },
  {
    title: 'Projeler',
    description: 'Yeni bir proje ekleyin veya mevcutları yönetin.',
    href: '/admin/projects',
    newHref: '/admin/projects/new', // (Bu sayfayı oluşturmanız gerekecek)
    Icon: Briefcase,
  },
  {
    title: 'Tarihçe',
    description: 'Takım tarihçesine yeni bir olay ekleyin.',
    href: '/admin/timeline',
    newHref: '/admin/timeline', // (Timeline genelde tek sayfadır)
    Icon: Milestone,
  },
  {
    title: 'İhtiyaç Listesi',
    description: 'Departman ihtiyaç listelerini güncelleyin.',
    href: '/admin/needs',
    newHref: '/admin/needs',
    Icon: ListChecks,
  },
]

export default function AdminDashboardPage() {
  const { data: session } = useSession()
  const adminName = session?.user?.name?.split(' ')[0] || 'Admin'

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      {/* 1. Hoş Geldiniz Başlığı */}
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Hoş geldin, {adminName}!</h1>
        <p className="text-muted-foreground">Kontrol panelinden hızlıca içeriklerini yönet.</p>
      </div>

      {/* 2. Hızlı Eylem Kartları */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Card
            key={link.title}
            className="flex flex-col justify-between shadow-lg hover:shadow-primary/20 transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">{link.title}</CardTitle>
              <link.Icon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </CardContent>
            <div className="flex items-center p-4 pt-0 justify-between">
              <Button asChild variant="outline">
                <Link href={link.href}>
                  Tümünü Yönet <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="default">
                <Link href={link.newHref}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Yeni Ekle
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* 3. Diğer Bileşenler (Opsiyonel) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Son Gelişmeler</CardTitle>
            <CardDescription>
              (Buraya son eklenen 5 blog yazısı veya proje listelenebilir)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* ... Buraya veri çekilerek bir liste eklenebilir ... */}
            <p className="text-sm text-muted-foreground">Bu özellik yakında eklenecek.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hızlı Linkler</CardTitle>
            <CardDescription>Sık kullanılan diğer admin bölümleri.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link href="/admin/links">Link Kısaltıcı</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin/members">Üye Başvuruları</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin/admins">Admin Yönetimi</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
