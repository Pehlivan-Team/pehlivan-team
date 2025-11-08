'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import CustomImageUploadButton from '@/components/post/CustomImageUploadButton';
import { useToast } from '@/hooks/use-toast';
import { useEdgeStore } from '@/lib/edgestore';

export default function PostComposer({ username }: { username: string }) {
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [debug, setDebug] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!content.trim() && !imageFile) return;
    setSubmitting(true);
    try {
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        // Client-side guard: max 5MB, must be an image
        if (!imageFile.type.startsWith('image/')) {
          toast({ title: 'Geçersiz Dosya', description: 'Yalnızca resim dosyaları yüklenebilir.', variant: 'destructive' });
          setSubmitting(false);
          return; // stop if invalid type
        } else if (imageFile.size > 5_000_000) {
          toast({ title: 'Dosya Çok Büyük', description: 'Lütfen 5MB altı bir görsel seçin.', variant: 'destructive' });
          setSubmitting(false);
          return; // stop if too large so we don’t create a text-only post
        } else {
          try {
            const res = await edgestore.postImages.upload({ file: imageFile });
            imageUrl = res.url;
          } catch (uploadErr: any) {
            toast({ title: 'Yükleme Hatası', description: uploadErr?.message || 'Resim yüklenemedi.', variant: 'destructive' });
            setSubmitting(false);
            return; // stop on failed upload
          }
        }
      }
      const resp = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, imageUrl }),
      });
      if (!resp.ok) throw new Error('Gönderi oluşturulamadı');
      setContent('');
      setImageFile(null);
      router.refresh();
    } catch (e) {
      toast({ title: 'Hata', description: (e as any)?.message || 'Bir hata oluştu', variant: 'destructive' });
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
        <CustomImageUploadButton onSelect={(file) => {
          setImageFile(file);
          setDebug(prev => `Selected: ${file ? file.name+ ' ('+file.type+', '+file.size+'b)' : 'none'}`);
        }} />
        {imageFile && (
          <span className="text-xs text-slate-400 max-w-[120px] truncate" title={imageFile.name}>{imageFile.name}</span>
        )}
        {!imageFile && debug && (
          <span className="text-xs text-amber-400" title={debug}>{debug}</span>
        )}
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Posting...' : 'Post'}
        </Button>
      </div>
      {debug && (
        <div className="mt-2 text-[10px] text-slate-500 break-all">{debug}</div>
      )}
    </div>
  );
}



