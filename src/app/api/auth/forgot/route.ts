import { NextResponse } from 'next/server'
import { firestoreAdmin } from '@/lib/firebase-admin'
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = body
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta gereklidir.' }, { status: 400 })
    }

    // Find user (do not reveal existence to client)
    const userRef = firestoreAdmin.collection('users').doc(email)
    const userDoc = await userRef.get()

    // Always respond success client-side to avoid account enumeration
    // But only create token if user exists
    if (!userDoc.exists) {
      console.log('[forgot] requested for non-existing user', email)
      return NextResponse.json({ success: true })
    }

    const token = nanoid(48)
    const expiresAt = Date.now() + 1000 * 60 * 60 // 1 hour

    await firestoreAdmin.collection('passwordResets').doc(token).set({
      email,
      token,
      createdAt: Date.now(),
      expiresAt,
      used: false,
    })

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || ''
    const resetLink = `${baseUrl}/auth/reset/${token}`

    // Try to send email if SMTP configured, otherwise log the link
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        // nodemailer may not be installed in every environment; keep import dynamic and ignore TS compile-time check
        // @ts-ignore
        const nodemailer = await import('nodemailer')
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })

        const from = process.env.SMTP_FROM || process.env.SMTP_USER
        await transporter.sendMail({
          from,
          to: email,
          subject: 'Şifre sıfırlama isteğiniz',
          html: `<p>Şifre sıfırlama talebi aldık. Şifrenizi sıfırlamak için <a href="${resetLink}">buraya tıklayın</a>. Bu bağlantı 1 saat geçerlidir.</p>`,
        })
        console.log('[forgot] reset email sent to', email)
      } else {
        console.log('[forgot] reset link (no SMTP configured):', resetLink)
      }
    } catch (mailErr) {
      console.error('Failed to send reset email:', mailErr)
      console.log('[forgot] reset link fallback:', resetLink)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('forgot route error', err)
    return NextResponse.json({ error: 'Beklenmedik bir hata' }, { status: 500 })
  }
}
