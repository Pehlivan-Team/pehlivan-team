"use client"
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

interface PostComposerProps {
  username: string
  onPosted?: () => void
}

export default function PostComposer({ username, onPosted }: PostComposerProps) {
  const { data: session } = useSession()
  const me = (session as any)?.user?.username
  const canPost = !!me && me === username
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!canPost) return null

  async function submit() {
    if (!content.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setContent('')
      onPosted?.()
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
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" onClick={() => setContent('')} disabled={submitting || !content.trim()}>
          Temizle
        </Button>
        <Button onClick={submit} disabled={submitting || !content.trim()}>
          {submitting ? 'Gönderiliyor…' : 'Paylaş'}
        </Button>
      </CardFooter>
    </Card>
  )
}
