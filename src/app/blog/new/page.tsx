"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewBlogPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  if (!session) {
    return (
      <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-lg">
        <p className="text-slate-300">Bu sayfayı görüntülemek için giriş yapmalısınız.</p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, content, imageUrl }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Hata')
      toast.success('Yazınız gönderildi. Yönetici onayı bekleniyor.')
      const username = session?.user?.username
      if (username) router.push(`/profile/${username}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gönderim hatası')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Yeni Blog Yazısı Oluştur</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Başlık</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="yazinin-basligi" />
        </div>
        <div>
          <Label>Öne Çıkan Resim URL (opsiyonel)</Label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        <div>
          <Label>İçerik (HTML kabul edilir)</Label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full rounded-md bg-slate-800/60 p-2 min-h-[200px]" required />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>{loading ? 'Gönderiliyor...' : 'Gönder ve Onay Bekle'}</Button>
        </div>
      </form>
    </div>
  )
}
