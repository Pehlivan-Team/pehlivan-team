'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy,
  Link as LinkIcon,
  Download,
  Share2,
  QrCode,
  ChevronDown,
  Loader2, // Yükleme ikonu için
} from 'lucide-react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import React, { useState, useEffect } from 'react'

// 'tasprologo.jpg' dosyasını import etmeniz gerekiyor.
// Bu dosyanın 'src/app/public' altında olduğunu varsayıyorum.
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import logo from '@public/logo_png.png' //
import communityLogo from '@public/tasprologo.jpg' // Bu yolu kendi dosya yapınıza göre düzeltin

export default function ShortenPage() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false) // Link oluşturma yüklemesi
  const [error, setError] = useState('')
  const [logoDataUrl, setLogoDataUrl] = useState<string>('')
  const [selectedLogo, setSelectedLogo] = useState<string>(logo.src)

  const [isLogoLoading, setIsLogoLoading] = useState(false)

  useEffect(() => {
    const convertLogoToDataUrl = (src: string) => {
      if (src === '') {
        setLogoDataUrl('')
        setIsLogoLoading(false)
        return
      }

      const img = new window.Image()
      img.src = src
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          setLogoDataUrl(canvas.toDataURL('image/png'))
        }
        setIsLogoLoading(false) // Yükleme bitti
      }
      img.onerror = () => {
        console.error('Logo yüklenemedi:', src)
        setIsLogoLoading(false)
      }
    }

    setIsLogoLoading(true)
    convertLogoToDataUrl(selectedLogo)
  }, [selectedLogo])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setShortUrl('')

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!data.success) throw new Error(data.error || 'Bir hata oluştu.')

      setShortUrl(data.shortUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!shortUrl) return
    navigator.clipboard.writeText(shortUrl)
    alert('Kısa link kopyalandı!')
  }

  const getSvgElement = (): SVGSVGElement | null => {
    return document.querySelector('#qr-code-container svg')
  }

  const convertSvgToImage = (format: 'png' | 'jpeg'): Promise<string> => {
    return new Promise((resolve, reject) => {
      const svg = getSvgElement()
      if (!svg) return reject(new Error('QR Code SVG not found.'))

      // Düzeltme: SVG'nin anlık olarak DOM'dan doğru alındığından emin ol
      // Bazen React'in render gecikmesi sorun yaratabilir.
      // Bu fonksiyon çağrıldığında DOM'un güncel olduğunu varsayıyoruz.
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      // SVG'nin boyutlarını al
      const svgRect = svg.getBoundingClientRect()
      canvas.width = svgRect.width
      canvas.height = svgRect.height

      img.onload = () => {
        if (ctx) {
          if (format === 'jpeg') {
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          const url = canvas.toDataURL(`image/${format}`)
          resolve(url)
        } else {
          reject(new Error('Canvas context could not be created.'))
        }
      }
      img.onerror = reject
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    })
  }

  const handleDownload = async (format: 'png' | 'jpeg' | 'svg') => {
    if (isLogoLoading) {
      alert('Logo yükleniyor, lütfen bekleyin.')
      return
    }

    let url: string
    try {
      if (format === 'svg') {
        const svg = getSvgElement()
        if (!svg) throw new Error('QR Code not found.')
        const svgData = new XMLSerializer().serializeToString(svg)
        const blob = new Blob([svgData], {
          type: 'image/svg+xml;charset=utf-8',
        })
        url = URL.createObjectURL(blob)
      } else {
        url = await convertSvgToImage(format)
      }

      const link = document.createElement('a')
      link.href = url
      link.download = `pehlivan-team-qrcode.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      if (format === 'svg') URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      alert(`Hata: QR kodu ${format} olarak indirilemedi.`)
    }
  }

  const handleShare = async () => {
    if (!navigator.share) {
      alert('Tarayıcınız bu özelliği desteklemiyor.')
      return
    }
    if (isLogoLoading) {
      alert('Logo yükleniyor, lütfen bekleyin.')
      return
    }

    try {
      const dataUrl = await convertSvgToImage('jpeg')
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], 'pehlivan-team-qrcode.jpg', {
        type: 'image/jpeg',
      })

      const shareData = {
        title: 'Pehlivan Team Kısaltılmış Link',
        text: `Oluşturulan kısa link: ${shortUrl}`,
        files: [file],
      }

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        alert('Tarayıcınız bu dosyayı paylaşmayı desteklemiyor.')
      }
    } catch (error) {
      console.error('Share error:', error)
      alert('Hata: QR kodu paylaşılamadı.')
    }
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white flex items-center justify-center py-12">
      <div className="container max-w-lg text-center px-4">
        <QrCode className="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-4xl font-bold mb-4">Link Kısaltıcı & QR Kod</h1>
        <p className="text-gray-400 mb-8">
          Uzun linklerinizi Pehlivan Team markalı kısa linklere ve logolu QR kodlara dönüştürün.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="bg-gray-800 border-gray-700 text-white"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 w-[140px]" // Butonun yeniden boyutlanmasını engelle
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Oluştur'}
          </Button>
        </form>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        <AnimatePresence>
          {shortUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8"
            >
              <div className="p-4 bg-slate-800 rounded-lg flex items-center justify-between">
                <LinkIcon className="h-5 w-5 text-gray-400 mr-4" />
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 font-mono break-all hover:underline"
                >
                  {shortUrl}
                </a>
                <Button variant="ghost" size="icon" onClick={copyToClipboard} className="ml-4">
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-4 p-6 bg-slate-800 rounded-lg">
                <div
                  id="qr-code-container"
                  className="bg-white p-4 rounded-lg inline-block shadow-lg"
                  style={{ minHeight: 288, minWidth: 288 }} // Yüklenirken alanın kaymasını engelle
                >
                  {/* YENİ YÜKLENME MANTIĞI */}
                  {isLogoLoading ? (
                    <div className="w-64 h-64 flex items-center justify-center text-black">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <QRCodeSVG
                      value={shortUrl}
                      size={256}
                      level={'H'}
                      includeMargin={true}
                      // DÜZELTİLMİŞ MANTIK: logoDataUrl boşsa 'undefined' gönder
                      imageSettings={
                        logoDataUrl
                          ? {
                              src: logoDataUrl,
                              height: 48,
                              width: 48,
                              excavate: true,
                            }
                          : undefined
                      }
                    />
                  )}
                </div>
                <div className="mt-6 flex justify-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {/* DÜZELTME: Logo yüklenirken butonu devre dışı bırak */}
                      <Button disabled={isLogoLoading}>
                        <Download className="mr-2 h-4 w-4" />
                        <span>İndir</span>
                        {isLogoLoading ? (
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-700 text-white border-slate-600">
                      <DropdownMenuItem onClick={() => handleDownload('png')}>
                        PNG olarak indir
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload('jpeg')}>
                        JPG olarak indir
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload('svg')}>
                        SVG olarak indir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {/* DÜZELTME: Logo yüklenirken butonu devre dışı bırak */}
                      <Button disabled={isLogoLoading}>
                        {/* Logo Seç yerine aktif logoyu göster */}
                        <span>Logo Seç</span>
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-700 text-white border-slate-600">
                      <DropdownMenuItem onClick={() => setSelectedLogo(logo.src)}>
                        Pehlivan Team Logolu
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedLogo(communityLogo.src)}>
                        Tasarım Proje Topluluğu Logosu
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        // DÜZELTME: Logosuz için boş string gönder
                        onClick={() => setSelectedLogo('')}
                      >
                        Logosuz
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {typeof navigator !== 'undefined' && (
                    <Button variant="outline" onClick={handleShare} disabled={isLogoLoading}>
                      <Share2 className="mr-2 h-4 w-4" /> Paylaş
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
