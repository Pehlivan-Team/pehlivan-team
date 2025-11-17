'use client'

import { UploadCloud, X, FileImage, ImagePlus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import { Progress } from '@/components/ui/progress'
import { useEdgeStore } from '@/lib/edgestore'

import { Button } from '../ui/button'

interface MultiImageUploaderProps {
  onUploadComplete: (urls: string[]) => void
  initialImageUrls?: string[]
  onUploadStateChange?: (isUploading: boolean) => void
}

interface UploadProgress {
  progress: number
  fileName: string
}

export function MultiImageUploader({
  onUploadComplete,
  initialImageUrls = [],
  onUploadStateChange,
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

    onUploadStateChange?.(true)
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
    onUploadStateChange?.(false)
    toast.success(`${newUrls.length} resim başarıyla yüklendi!`)
  }

  const handleRemoveImage = (urlToRemove: string) => {
    const updatedUrls = imageUrls.filter((url) => url !== urlToRemove)
    setImageUrls(updatedUrls)
    onUploadComplete(updatedUrls)
  }

  return (
    <div className="w-full space-y-6">
      {/* Image Gallery */}
      {imageUrls.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <ImagePlus className="h-4 w-4" />
              Yüklenen Resimler ({imageUrls.length}/5)
            </h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {imageUrls.map((url, index) => (
              <div 
                key={url} 
                className="group relative aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-800/50 hover:border-slate-600 transition-all duration-200"
              >
                <Image
                  src={url}
                  alt={`Yüklenen resim ${index + 1}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200 shadow-lg"
                  aria-label="Resmi sil"
                >
                  <Trash2 size={14} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-white text-xs font-medium truncate">
                    Resim {index + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Upload Area */}
      <div className="relative">
        <div className="w-full border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/30 hover:border-slate-600 hover:bg-slate-900/50 transition-all duration-200 p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center">
              <UploadCloud className="h-8 w-8 text-slate-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-200">
                Resimleri buraya sürükleyin veya seçin
              </h3>
              <p className="text-xs text-slate-400">
                PNG, JPG, GIF destekleniyor • Maksimum 5 resim
              </p>
            </div>
            
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
                disabled={uploadProgress.length > 0}
              />
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-lg text-sm font-medium transition-colors duration-200">
                <ImagePlus className="h-4 w-4" />
                Resim Seç
              </div>
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="bg-slate-800/40 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <FileImage className="h-4 w-4" />
                Seçilen Dosyalar ({files.length})
              </h4>
              <div className="space-y-2">
                {files.map((file) => (
                  <div key={file.name} className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-md">
                    <div className="w-8 h-8 rounded bg-slate-600/50 flex items-center justify-center">
                      <FileImage className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              onClick={handleUpload}
              disabled={uploadProgress.length > 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-400 text-white font-medium py-2.5"
            >
              {uploadProgress.length > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Yükleniyor...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UploadCloud className="h-4 w-4" />
                  {files.length} Resmi Yükle
                </div>
              )}
            </Button>
          </div>
        )}

        {uploadProgress.length > 0 && (
          <div className="mt-6">
            <div className="bg-slate-800/40 rounded-lg p-4 space-y-4">
              <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                Yükleme Durumu
              </h4>
              <div className="space-y-3">
                {uploadProgress.map((p) => (
                  <div key={p.fileName} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-200 truncate flex-1 mr-2">{p.fileName}</p>
                      <span className="text-xs text-slate-400 font-mono">
                        {Math.round(p.progress)}%
                      </span>
                    </div>
                    <Progress 
                      value={p.progress} 
                      className="h-2 bg-slate-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
