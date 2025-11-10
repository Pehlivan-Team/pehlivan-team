import { NextResponse } from 'next/server'
import { firestoreAdmin } from '@/lib/firebase-admin'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = body

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token eksik.' }, { status: 400 })
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Geçerli bir şifre gerekli (en az 6 karakter).' }, { status: 400 })
    }

    const tokenRef = firestoreAdmin.collection('passwordResets').doc(token)
    const tokenDoc = await tokenRef.get()
    if (!tokenDoc.exists) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş token.' }, { status: 400 })
    }

    const data = tokenDoc.data() as any
    if (data.used) {
      return NextResponse.json({ error: 'Bu bağlantı zaten kullanılmış.' }, { status: 400 })
    }
    if (Date.now() > data.expiresAt) {
      return NextResponse.json({ error: 'Token süresi dolmuş.' }, { status: 400 })
    }

    const email = data.email
    if (!email) {
      return NextResponse.json({ error: 'Hedef kullanıcı bulunamadı.' }, { status: 400 })
    }

    // Hash new password and save on user doc
    const hashed = await bcrypt.hash(password, 10)
    await firestoreAdmin.collection('users').doc(email).set({ hashedPassword: hashed }, { merge: true })

    // mark token used
    await tokenRef.update({ used: true, usedAt: Date.now() })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('reset confirm error', err)
    return NextResponse.json({ error: 'Beklenmedik bir hata' }, { status: 500 })
  }
}
