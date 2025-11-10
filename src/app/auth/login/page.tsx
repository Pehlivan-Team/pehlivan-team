'use client'

import { Loader2, Eye, EyeOff } from 'lucide-react'
import { Github, LinkedinIcon, ChromeIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// GitHub ve LinkedIn ikonlarını eklemek için (opsiyonel, `lucide-react`'ten import edin)

export default function GirisPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isProviderLoading, setIsProviderLoading] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // client-side validation
    const errors: { email?: string; password?: string } = {}
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Lütfen geçerli bir e-posta girin.'
    if (!password || password.length < 6) errors.password = 'Şifre en az 6 karakter olmalı.'
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Giriş başarılı!')
        router.push(callbackUrl)
      }
    } catch (error) {
      toast.error('Beklenmedik bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = (provider: string) => {
    setIsProviderLoading(provider)
    signIn(provider, { callbackUrl: callbackUrl })
    // Yönlendirme başlayacağı için setIsLoading(false) demeye gerek yok
  }

  return (
    <div className="min-h-screen h-screen bg-gray-950 flex items-stretch">
      <div className="w-full h-full">
        <div className="grid lg:grid-cols-2 w-full h-full">
          {/* Left: form area */}
          <div className="px-6 py-8 md:px-12 md:py-12 bg-slate-900/60 text-white flex flex-col justify-center overflow-auto h-full">
            <div className="max-w-xl mx-auto">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-red-400">Tekrar Hoşgeldiniz</h2>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-2">Giriş Yap</h1>
                <p className="text-gray-400 mt-2">Hesabınıza erişmek için bir yöntem seçin veya e-posta ile giriş yapın.</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                <Button
                  variant="outline"
                  className="sm:col-span-3 md:col-span-1 h-12 text-sm bg-slate-700 hover:bg-slate-600 border-slate-600"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={!!isProviderLoading}
                >
                  {isProviderLoading === 'google' ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <ChromeIcon className="mr-2 h-5 w-5" />
                  )}
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="h-12 text-sm bg-slate-700 hover:bg-slate-600 border-slate-600"
                  onClick={() => handleOAuthLogin('github')}
                  disabled={!!isProviderLoading}
                >
                  {isProviderLoading === 'github' ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Github className="mr-2 h-5 w-5" />
                  )}
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  className="h-12 text-sm bg-slate-700 hover:bg-slate-600 border-slate-600"
                  onClick={() => handleOAuthLogin('linkedin')}
                  disabled={!!isProviderLoading}
                >
                  {isProviderLoading === 'linkedin' ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <LinkedinIcon className="mr-2 h-5 w-5" />
                  )}
                  LinkedIn
                </Button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 border-t border-slate-700" />
                <span className="text-xs text-gray-400 uppercase">veya</span>
                <div className="flex-1 border-t border-slate-700" />
              </div>

              <form onSubmit={handleCredentialsLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!formErrors.email}
                    aria-describedby={formErrors.email ? 'email-error' : undefined}
                    className="bg-gray-900 border-slate-700 h-12 rounded-lg"
                  />
                  {formErrors.email && <p id="email-error" className="text-sm text-red-400 mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Şifre</Label>
                    <Link href="/auth/forgot" className="text-sm text-gray-400 hover:underline">Şifremi Unuttum?</Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={!!formErrors.password}
                      aria-describedby={formErrors.password ? 'password-error' : undefined}
                      className="bg-gray-900 border-slate-700 h-12 rounded-lg pr-10"
                    />
                    <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password visibility">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formErrors.password && <p id="password-error" className="text-sm text-red-400 mt-1">{formErrors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-red-500" />
                    <span>Beni hatırla</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-lg bg-red-600 hover:bg-red-700 rounded-full mt-2"
                  disabled={isLoading || !!isProviderLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Giriş Yap
                </Button>
              </form>

              <p className="text-sm text-gray-400 mt-6">
                Hesabın yok mu?{' '}
                <Link href="/auth/register" className="font-medium text-red-400 hover:underline">
                  Kayıt Ol
                </Link>
              </p>
            </div>
          </div>

          {/* Right: hero image / artwork */}
          <div className="hidden lg:block relative h-full">
            <img
              src="/bg.png"
              alt="Pehlivan background"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 right-6 bg-black/60 text-white px-3 py-1 rounded-full text-sm">Pehlivan</div>
          </div>
        </div>
      </div>
    </div>
  )
}
