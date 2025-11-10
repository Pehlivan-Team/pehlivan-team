"use client"
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface CommentComposerProps {
  postId: string
  onAdded?: () => void
}

export default function CommentComposer({ postId, onAdded }: CommentComposerProps) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (!value.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: value }),
      })
      if (!res.ok) throw new Error('Yorum eklenemedi')
      setValue('')
      onAdded?.()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-md border border-slate-700 bg-slate-800/60 p-3 space-y-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Yorum yaz..."
        disabled={loading}
        className="min-h-[70px] bg-slate-900/60 border-slate-700 text-sm"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" disabled={loading || !value.trim()} onClick={() => setValue('')}>
          Temizle
        </Button>
        <Button size="sm" disabled={loading || !value.trim()} onClick={submit}>
          {loading ? 'Gönderiliyor…' : 'Gönder'}
        </Button>
      </div>
    </div>
  )
}
