'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useEdgeStore } from '@/lib/edgestore';

export default function PostComposer({ username }: { username: string }) {
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!content.trim() && !imageFile) return;
    setSubmitting(true);
    try {
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        const res = await edgestore.publicFiles.upload({ file: imageFile });
        imageUrl = res.url;
      }
      const resp = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, imageUrl }),
      });
      if (!resp.ok) throw new Error('Failed to post');
      setContent('');
      setImageFile(null);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
      <Textarea
        placeholder={`Share something with your team...`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-slate-900 border-slate-700 text-slate-100"
      />
      <div className="mt-3 flex items-center gap-3">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="cursor-pointer"
        />
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </div>
  );
}



