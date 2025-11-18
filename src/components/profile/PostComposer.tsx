"use client"
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { LinkIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { MultiImageUploader } from '@/components/admin/MultiImageUploader'
import Image from 'next/image'

interface PostComposerProps {
  username: string
  onPosted?: () => void
}

const POST_TYPES = [
  { value: 'social', label: 'Sosyal', description: 'Genel paylaşım' },
  { value: 'project_update', label: 'Proje Güncellemesi', description: 'Proje ilerlemesi' },
  { value: 'team_update', label: 'Takım Güncellemesi', description: 'Takım haberleri' },
  { value: 'study_share', label: 'Eğitim Paylaşımı', description: 'Öğrenme içeriği' },
  { value: 'looking_for_group', label: 'Grup Arayışı', description: 'Takım arkadaşı ara' },
  { value: 'linked', label: 'Bağlantılı', description: 'Harici link paylaş' },
  { value: 'sponsored', label: 'Sponsorlu', description: 'Tanıtım içeriği' },
] as const

export default function PostComposer({ username, onPosted }: PostComposerProps) {
  const { data: session } = useSession()
  const me = (session as any)?.user?.username
  const canPost = !!me && me === username
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState<string>('social')
  const [linkUrl, setLinkUrl] = useState('')
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
        if (parsed?.postType) setPostType(parsed.postType)
        if (parsed?.linkUrl) setLinkUrl(parsed.linkUrl)
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
        const payload = { content, postType, linkUrl, imageUrls }
        localStorage.setItem(draftKey, JSON.stringify(payload))
      } catch (e) {
        // ignore
      }
    }, 800)
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [content, postType, linkUrl, imageUrls, draftKey])

  if (!canPost) return null

  async function submit() {
    const trimmed = content.trim()
    
    // Validation for linked posts
    if (postType === 'linked' && !linkUrl.trim()) {
      setError('Bağlantılı gönderiler için URL gereklidir.')
      return
    }
    
    // General content validation
    if (!trimmed && imageUrls.length === 0 && postType !== 'linked') {
      setError('Yazı veya en az bir resim gerekiyor.')
      return
    }
    
    if (trimmed.length > charLimit) {
      setError(`Maksimum ${charLimit} karakter.`)
      return
    }
    
    // URL validation for linked posts
    if (postType === 'linked' && linkUrl.trim()) {
      try {
        new URL(linkUrl.trim())
      } catch {
        setError('Geçerli bir URL girin.')
        return
      }
    }
    
    // Prevent duplicate posts (simple client-side check)
    try {
      const last = localStorage.getItem(lastPostedKey)
      const currentHash = JSON.stringify({ content: trimmed, imageUrls, postType, linkUrl })
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
        content: trimmed || undefined,
        imageUrl: imageUrls[0] || undefined,
        imageUrls: imageUrls.length ? imageUrls.slice(0, 5) : undefined,
        mentions: mentionMatches.length ? Array.from(new Set(mentionMatches)) : undefined,
        hashtags: hashtagMatches.length ? Array.from(new Set(hashtagMatches)) : undefined,
        type: postType,
        linkUrl: postType === 'linked' ? linkUrl.trim() : undefined,
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setContent('')
      setPostType('social')
      setLinkUrl('')
      setImageUrls([])
      onPosted?.()
      try {
        const currentHash = JSON.stringify({ content: trimmed, imageUrls, postType, linkUrl })
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

  const selectedPostType = POST_TYPES.find(pt => pt.value === postType)
  const isLinkedPost = postType === 'linked'

  return (
    <Card className="bg-slate-900/70 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-slate-100">Yeni Gönderi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Post Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="post-type" className="text-sm font-medium text-slate-200">
            Gönderi Türü
          </Label>
          <Select value={postType} onValueChange={setPostType} disabled={submitting}>
            <SelectTrigger className="bg-slate-900/60 border-slate-800 text-slate-100">
              <SelectValue placeholder="Gönderi türü seçin" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              {POST_TYPES.map((type) => (
                <SelectItem 
                  key={type.value} 
                  value={type.value}
                  className="text-slate-100 focus:bg-slate-800 focus:text-slate-100"
                >
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-slate-400">{type.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedPostType && (
            <p className="text-xs text-slate-400">{selectedPostType.description}</p>
          )}
        </div>

        {/* Link URL for linked posts */}
        {isLinkedPost && (
          <div className="space-y-2">
            <Label htmlFor="link-url" className="text-sm font-medium text-slate-200">
              Bağlantı URL'si *
            </Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                id="link-url"
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="pl-10 bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-500"
                disabled={submitting}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm font-medium text-slate-200">
            İçerik {!isLinkedPost && '*'}
          </Label>
          <Textarea
            id="content"
            placeholder={isLinkedPost ? "Bu bağlantı hakkında ne düşünüyorsun? (opsiyonel)" : "Ne düşünüyorsun?"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px] bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-500"
            disabled={submitting}
          />
          <div className="flex items-center justify-between text-sm text-slate-400">
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
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-200">
            Resimler (opsiyonel)
          </Label>
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

        {error && <p className="text-sm text-red-400 bg-red-950/20 border border-red-900/20 rounded-md p-2">{error}</p>}
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button 
          variant="ghost" 
          onClick={() => { 
            setContent('')
            setPostType('social')
            setLinkUrl('')
            setImageUrls([]) 
          }} 
          disabled={submitting || uploading || (!content.trim() && imageUrls.length===0 && !linkUrl.trim())}
        >
          Temizle
        </Button>
        <Button 
          onClick={submit} 
          disabled={submitting || uploading || (!content.trim() && imageUrls.length===0 && (!isLinkedPost || !linkUrl.trim()))}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {uploading ? 'Resimler yükleniyor…' : submitting ? 'Gönderiliyor…' : 'Paylaş'}
        </Button>
      </CardFooter>
    </Card>
  )
}
