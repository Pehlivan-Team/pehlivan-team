'use client'

import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Lütfen geçerli bir e-posta girin.')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'İşlem başarısız')
      toast.success('E-posta gönderildi. Lütfen gelen kutunuzu kontrol edin.')
      setSubmitted(true)
    } catch (err: any) {
      toast.error(err.message || 'Beklenmedik bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen h-screen bg-gray-950 flex items-stretch">
      <div className="w-full h-full">
        <div className="grid lg:grid-cols-2 w-full h-full">
          <div className="px-6 py-8 md:px-12 md:py-12 bg-slate-900/60 text-white flex flex-col justify-center overflow-auto h-full">
            <div className="max-w-xl mx-auto">
              <h2 className="text-sm font-semibold text-red-400">Şifre Sıfırlama</h2>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-2">Şifreni mi unuttun?</h1>
              <p className="text-gray-400 mt-2">Kayıtlı e-posta adresini gir, sana bir sıfırlama bağlantısı gönderelim.</p>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="email">E-posta</Label>
                    <Input id="email" type="email" placeholder="ornek@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-900 border-slate-700 h-12 rounded-lg" />
                  </div>

                  <div>
                    <Button type="submit" className="w-full h-12 text-lg bg-red-600 hover:bg-red-700 rounded-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />} Gönder
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="mt-6">
                  <p className="text-gray-300">E-posta gönderildi. Bağlantıya tıklayarak şifrenizi sıfırlayabilirsiniz.</p>
                  <div className="mt-4">
                    <Link href="/auth/login" className="text-red-400 hover:underline">Giriş sayfasına dön</Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block relative h-full">
            <img src="/bg.png" alt="Pehlivan background" className="w-full h-full object-cover" />
            <div className="absolute bottom-6 right-6 bg-black/60 text-white px-3 py-1 rounded-full text-sm">Pehlivan</div>
          </div>
        </div>
      </div>
    </div>
  )
}
