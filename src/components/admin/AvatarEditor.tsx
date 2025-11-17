"use client"

import React, { useCallback, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useEdgeStore } from '@/lib/edgestore'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

type Props = {
  initialImageUrl?: string
  onUploadComplete: (url: string) => void
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = url
  })
}

function getCroppedImg(imageSrc: string, pixelCrop: any, outputSize = 800): Promise<Blob | null> {
  return new Promise(async (resolve) => {
    try {
      const image = await createImage(imageSrc)
      const canvas = document.createElement('canvas')
      canvas.width = outputSize
      canvas.height = Math.round((outputSize * pixelCrop.height) / pixelCrop.width)
      const ctx = canvas.getContext('2d')!

      // draw the cropped area into the canvas
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
      )

      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9)
    } catch (e) {
      console.error('getCroppedImg error', e)
      resolve(null)
    }
  })
}

export default function AvatarEditor({ initialImageUrl, onUploadComplete }: Props) {
  const { edgestore } = useEdgeStore()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [open, setOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(initialImageUrl || null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const { data: session } = useSession()

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    setImageSrc(url)
    setOpen(true)
  }

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      toast.error('Lütfen önce bir resim seçin ve kırpın.')
      return
    }
    if (!edgestore || !edgestore?.profileImages) {
      // Provide actionable guidance: if user isn't signed in, EdgeStore init may fail
      if (!session) {
        toast.error('EdgeStore hazır değil — lütfen önce giriş yapın.')
      } else if (!edgestore) {
        toast.error('EdgeStore başlatılamadı. Lütfen birkaç saniye bekleyip tekrar deneyin.')
      } else {
        toast.error('EdgeStore hazırlaşıyor veya profil bucket tanımlı değil. Birkaç saniye sonra tekrar deneyin.')
      }
      return
    }
    setLoading(true)
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, 800)
      if (!blob) throw new Error('Kırpma başarısız')
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
      if (edgestore?.profileImages?.upload) {
        try {
          const res = await edgestore.profileImages.upload({ file })
          // Ensure the upload returned a hosted URL before calling the callback
          if (!res || !res.url) {
            throw new Error('EdgeStore yükleme sonucu beklenmeyen formatta')
          }
          onUploadComplete(res.url)
          toast.success('Profil resmi yüklendi')
          setOpen(false)
        } catch (err) {
          console.error('EdgeStore upload error', err)
          toast.error('Profil resmi yüklenirken hata oluştu (EdgeStore)')
        }
      } else {
        // Fallback: local preview blob url
        const url = URL.createObjectURL(blob)
        onUploadComplete(url)
        toast.success('Profil resmi hazır (local preview)')
        setOpen(false)
      }
    } catch (err) {
      console.error(err)
      toast.error('Resim yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* avatar button - triggers native file picker */}
      <button
        type="button"
        onClick={() => {
          // always open the native file picker first — user wants to add a photo, then edit it
          inputRef.current?.click()
        }}
        className="cursor-pointer relative w-40 h-40 rounded-full overflow-hidden border-2 flex items-center justify-center bg-gray-50"
        aria-label="Profil resmini düzenle"
      >
        {initialImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={initialImageUrl} alt="profile" className="w-full h-full object-cover" />
        ) : (
          <div className="text-sm text-muted-foreground">Profil resmi</div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/30 text-white transition">Düzenle</div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profil Resmini Düzenle</DialogTitle>
            <DialogDescription>Resmi kırp ve yükle. Sürükle / yakınlaştır ile pozisyonu ayarlayabilirsin.</DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="relative w-full h-80 bg-black/5">
              {imageSrc ? (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="text-sm text-muted-foreground">Henüz bir resim seçilmedi.</div>
                  <Button variant="outline" onClick={() => inputRef.current?.click()}>Bir resim seç</Button>
                </div>
              )}
            </div>

            {imageSrc && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-sm">Yakınlaştır</label>
                  <Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={(v) => setZoom(Number(v[0]))} />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setAspect(1)}>1:1</Button>
                  <Button variant="outline" onClick={() => setAspect(16 / 9)}>16:9</Button>
                  <Button variant="outline" onClick={() => setAspect(4 / 3)}>4:3</Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>İptal</Button>
              <Button onClick={handleUpload} disabled={loading}>{loading ? 'Yükleniyor...' : 'Uygula ve Yükle'}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* hidden fallback input for selecting a file */}
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" aria-hidden onChange={onFileChange} />
    </div>
  )
}
