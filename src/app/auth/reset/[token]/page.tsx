"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  params: { token: string }
}

export default function ResetPage({ params }: Props) {
  const router = useRouter()
  const token = params?.token
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!password || password.length < 6) {
      setError('Şifre en az 6 karakter olmalı')
      return
    }
    if (password !== confirm) {
      setError('Şifreler eşleşmiyor')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Beklenmedik bir hata')
        setLoading(false)
        return
      }
      setSuccess(true)
      setLoading(false)
      setTimeout(() => router.push('/auth/login'), 1200)
    } catch (err) {
      console.error(err)
      setError('Sunucu hatası')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Şifreni sıfırla</h2>
        {!success ? (
          <form onSubmit={handleSubmit}>
            <label className="block text-sm text-slate-600">Yeni şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1 mb-3"
            />
            <label className="block text-sm text-slate-600">Şifreyi doğrula</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1 mb-4"
            />
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Kaydediliyor...' : 'Şifreyi sıfırla'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-green-600">Şifren başarıyla değiştirildi. Giriş sayfasına yönlendiriliyorsun...</p>
          </div>
        )}
      </div>
    </div>
  )
}
