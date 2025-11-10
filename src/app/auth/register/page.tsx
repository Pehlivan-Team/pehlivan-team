'use client'

import { Loader2, Eye, EyeOff } from 'lucide-react'
import { Github, LinkedinIcon, ChromeIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function KayitPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isProviderLoading, setIsProviderLoading] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string; confirm?: string; username?: string; name?: string }>({})
  const [showPassword, setShowPassword] = useState(false)

  const passwordStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    const labels = ['Aşırı Zayıf', 'Eh İşte', 'Fena Değil', 'Sağlam', 'Kâfi']
    const colors = ['bg-red-600', 'bg-orange-500', 'bg-yellow-400', 'bg-emerald-400', 'bg-green-500']
    return { score, label: labels[score], color: colors[score] }
  }

  const handleOAuthLogin = (provider: string) => {
    setIsProviderLoading(provider)
    signIn(provider, { callbackUrl: '/' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // client-side validation
    const errors: { email?: string; password?: string; confirm?: string; username?: string; name?: string } = {}
    if (!name || name.trim().length === 0) errors.name = 'İsim gerekli.'
    if (!username || username.trim().length === 0) errors.username = 'Kullanıcı adı gerekli.'
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Geçerli bir e-posta girin.'
    if (!password || password.length < 6) errors.password = 'Şifre en az 6 karakter olmalı.'
    if (password !== confirmPassword) errors.confirm = 'Şifreler eşleşmiyor.'
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsLoading(true)
    try {
      // register
      const regResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, name }),
      })

      const data = await regResponse.json()

      if (!regResponse.ok) {
        throw new Error(data.error || 'Kayıt sırasında bir hata oluştu.')
      }

      toast.success('Hesap oluşturuldu! Giriş yapılıyor...')
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        toast.error(`Giriş hatası: ${signInResult.error}`)
        router.push('/auth/login')
      } else {
        toast.success('Giriş başarılı!')
        router.push('/')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen h-screen bg-gray-950 flex items-stretch">
      <div className="w-full h-full">
        <div className="grid lg:grid-cols-2 w-full h-full">
          {/* Left: form area */}
          <div className="px-6 py-8 md:px-12 md:py-12 bg-slate-900/60 text-white flex flex-col justify-center overflow-auto h-full">
            <div className="max-w-xl mx-auto">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-red-400">Katıl</h2>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-2">Hesap Oluştur</h1>
                <p className="text-gray-400 mt-2">E-posta ile veya sosyal sağlayıcılarla hızlıca kayıt olun.</p>
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Görünür İsim</Label>
                    <Input id="name" placeholder="İsim Soyisim" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-900 border-slate-700 h-12 rounded-lg" />
                    {formErrors.name && <p className="text-sm text-red-400 mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="username">Kullanıcı Adı (@)</Label>
                    <Input id="username" placeholder="kullaniciadi" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-gray-900 border-slate-700 h-12 rounded-lg" />
                    {formErrors.username && <p className="text-sm text-red-400 mt-1">{formErrors.username}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input id="email" type="email" placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-900 border-slate-700 h-12 rounded-lg" />
                  {formErrors.email && <p className="text-sm text-red-400 mt-1">{formErrors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Şifre</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-900 border-slate-700 h-12 rounded-lg pr-10"
                      />
                      <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password visibility">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {formErrors.password && <p className="text-sm text-red-400 mt-1">{formErrors.password}</p>}

                    {/* strength meter */}
                    <div className="mt-2">
                      <div className="h-2 w-full bg-slate-800 rounded overflow-hidden">
                        <div className={`${passwordStrength(password).color} h-2 rounded`} style={{ width: `${(passwordStrength(password).score / 4) * 100}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{password ? passwordStrength(password).label : 'Başlamak için şifre girin'}</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirm">Şifre (Tekrar)</Label>
                    <Input id="confirm" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-gray-900 border-slate-700 h-12 rounded-lg" />
                    {formErrors.confirm && <p className="text-sm text-red-400 mt-1">{formErrors.confirm}</p>}
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-lg bg-red-600 hover:bg-red-700 rounded-full mt-2" disabled={isLoading || !!isProviderLoading}>
                  {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />} Kayıt Ol
                </Button>
              </form>

              <p className="text-sm text-gray-400 mt-6">Zaten bir hesabın var mı?{' '}
                <Link href="/auth/login" className="font-medium text-red-400 hover:underline">Giriş Yap</Link>
              </p>
            </div>
          </div>

          {/* Right: hero image / artwork */}
          <div className="hidden lg:block relative h-full">
            <img src="/bg.png" alt="Pehlivan background" className="w-full h-full object-cover" />
            <div className="absolute bottom-6 right-6 bg-black/60 text-white px-3 py-1 rounded-full text-sm">Pehlivan</div>
          </div>
        </div>
      </div>
    </div>
  )
}
