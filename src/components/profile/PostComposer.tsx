"use client"
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { MultiImageUploader } from '@/components/admin/MultiImageUploader'
import Image from 'next/image'

interface PostComposerProps {
  username: string
  onPosted?: () => void
}

export default function PostComposer({ username, onPosted }: PostComposerProps) {
  const { data: session } = useSession()
  const me = (session as any)?.user?.username
  const canPost = !!me && me === username
  const [content, setContent] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const charLimit = 280
  const draftKey = `post_draft_${username}`
  const lastPostedKey = `post_last_success_${(session as any)?.user?.id || 'anon'}`
  const saveTimer = useRef<number | null>(null)

  useEffect(() => {
    // Load draft if present
    try {
      const raw = localStorage.getItem(draftKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.content) setContent(parsed.content)
        if (Array.isArray(parsed?.imageUrls)) setImageUrls(parsed.imageUrls)
      }
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Autosave to localStorage (debounced)
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      try {
        const payload = { content, imageUrls }
        localStorage.setItem(draftKey, JSON.stringify(payload))
      } catch (e) {
        // ignore
      }
    }, 800)
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [content, imageUrls, draftKey])

  if (!canPost) return null

  async function submit() {
    const trimmed = content.trim()
    if (!trimmed && imageUrls.length === 0) {
      setError('Yazı veya en az bir resim gerekiyor.')
      return
    }
    if (trimmed.length > charLimit) {
      setError(`Maksimum ${charLimit} karakter.`)
      return
    }
    // Prevent duplicate posts (simple client-side check)
    try {
      const last = localStorage.getItem(lastPostedKey)
      const currentHash = JSON.stringify({ content: trimmed, imageUrls })
      if (last === currentHash) {
        setError('Aynı içeriği tekrar gönderemezsiniz.')
        return
      }
    } catch (e) {
      // ignore
    }
    setSubmitting(true)
    setError(null)
    try {
      // Extract mentions and hashtags
      const mentionMatches = (trimmed.match(/@([a-zA-Z0-9_\-\.]+)/g) || []).map((m) => m.replace('@', ''))
      const hashtagMatches = (trimmed.match(/#([a-zA-Z0-9_\-\.]+)/g) || []).map((m) => m.replace('#', ''))

      const body = {
        content: trimmed,
        imageUrl: imageUrls[0] || undefined,
        imageUrls: imageUrls.length ? imageUrls.slice(0, 5) : undefined,
        mentions: mentionMatches.length ? Array.from(new Set(mentionMatches)) : undefined,
        hashtags: hashtagMatches.length ? Array.from(new Set(hashtagMatches)) : undefined,
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setContent('')
      setImageUrls([])
      onPosted?.()
      try {
        const currentHash = JSON.stringify({ content: trimmed, imageUrls })
        localStorage.setItem(lastPostedKey, currentHash)
        localStorage.removeItem(draftKey)
      } catch (e) {}
      toast.success('Gönderi paylaşıldı.')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="bg-slate-900/70 border-slate-800">
      <CardContent className="pt-4">
        <Textarea
          placeholder="Ne düşünüyorsun?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[80px] bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-500"
          disabled={submitting}
        />

        <div className="mt-2 flex items-center justify-between text-sm text-slate-400">
          <div>
            {imageUrls.length > 0 && (
              <div className="flex gap-2 items-center">
                {imageUrls.slice(0, 5).map((u) => (
                  <div key={u} className="relative h-10 w-10 rounded-md overflow-hidden">
                    <Image src={u} alt="preview" width={40} height={40} style={{ objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={`${content.length > charLimit ? 'text-red-400' : ''}`}>
            {content.length}/{charLimit}
          </div>
        </div>

        <div className="mt-4">
          <MultiImageUploader
            initialImageUrls={imageUrls}
            onUploadComplete={(urls) => {
              if (urls.length > 5) {
                toast.warning('Maksimum 5 resim desteklenir. Fazlalıklar atıldı.')
              }
              setImageUrls(urls.slice(0, 5))
            }}
            onUploadStateChange={setUploading}
          />
        </div>

        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" onClick={() => { setContent(''); setImageUrls([]) }} disabled={submitting || uploading || (!content.trim() && imageUrls.length===0)}>
          Temizle
        </Button>
        <Button onClick={submit} disabled={submitting || uploading || (!content.trim() && imageUrls.length===0)}>
          {uploading ? 'Resimler yükleniyor…' : submitting ? 'Gönderiliyor…' : 'Paylaş'}
        </Button>
      </CardFooter>
    </Card>
  )
}
