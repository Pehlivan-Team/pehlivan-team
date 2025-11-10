'use client'

import { UploadCloud, X, FileImage } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import { Progress } from '@/components/ui/progress'
import { useEdgeStore } from '@/lib/edgestore'

import { Button } from '../ui/button'

interface MultiImageUploaderProps {
  onUploadComplete: (urls: string[]) => void
  initialImageUrls?: string[]
}

interface UploadProgress {
  progress: number
  fileName: string
}

export function MultiImageUploader({
  onUploadComplete,
  initialImageUrls = [],
}: MultiImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls)
  const { edgestore } = useEdgeStore()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    const newUrls: string[] = []
    await Promise.all(
      files.map(async (file) => {
        try {
          const res = await edgestore.postImages.upload({
            file,
            onProgressChange: (progress) => {
              setUploadProgress((prev) => {
                const existing = prev.find((p) => p.fileName === file.name)
                if (existing) {
                  return prev.map((p) => (p.fileName === file.name ? { ...p, progress } : p))
                }
                return [...prev, { fileName: file.name, progress }]
              })
            },
          })
          newUrls.push(res.url)
        } catch (error) {
          toast.error(`'${file.name}' yüklenirken bir hata oluştu.`)
        }
      })
    )

    const updatedUrls = [...imageUrls, ...newUrls]
    setImageUrls(updatedUrls)
    onUploadComplete(updatedUrls)
    setFiles([])
    setUploadProgress([])
    toast.success(`${newUrls.length} resim başarıyla yüklendi!`)
  }

  const handleRemoveImage = (urlToRemove: string) => {
    const updatedUrls = imageUrls.filter((url) => url !== urlToRemove)
    setImageUrls(updatedUrls)
    onUploadComplete(updatedUrls)
  }

  return (
    <div className="col-span-3 space-y-4">
      {/* Mevcut resimleri gösteren galeri */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {imageUrls.map((url) => (
            <div key={url} className="relative h-24 w-full rounded-md overflow-hidden">
              <Image
                src={url}
                alt="Yüklenen resim"
                width={100}
                height={100}
                style={{
                  objectFit: 'cover',
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(url)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Yükleme alanı */}
      <div className="w-full h-auto border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 text-center">
        <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
        <input
          type="file"
          multiple
          className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-red-700 hover:file:bg-violet-100"
          onChange={handleFileChange}
          accept="image/*"
        />

        {files.length > 0 && (
          <div className="w-full mt-4 space-y-2">
            {files.map((file) => (
              <div key={file.name} className="flex items-center gap-2 text-sm">
                <FileImage className="h-4 w-4" />
                <span className="flex-1 truncate">{file.name}</span>
              </div>
            ))}
            <Button
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm w-full"
              onClick={handleUpload}
              disabled={uploadProgress.length > 0}
            >
              {uploadProgress.length > 0 ? 'Yükleniyor...' : `${files.length} Resim Yükle`}
            </Button>
          </div>
        )}

        {uploadProgress.length > 0 && (
          <div className="w-full mt-2 space-y-1">
            {uploadProgress.map((p) => (
              <div key={p.fileName}>
                <p className="text-xs text-left truncate">{p.fileName}</p>
                <Progress value={p.progress} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
