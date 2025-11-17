import { NextResponse } from 'next/server'
import { firestoreAdmin } from '@/lib/firebase-admin'
import { nanoid } from 'nanoid'
import { resetPasswordEmail } from '@/lib/email/resetPasswordTemplate'

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
      const forceEthereal = process.env.FORCE_ETHEREAL === 'true'

      // If FORCE_ETHEREAL is set, always send via Ethereal (useful for dev or staging)
      if (forceEthereal) {
        // @ts-expect-error - dynamic import may not be present in all environments
        const nodemailer = await import('nodemailer')

        if (process.env.ETHEREAL_USER && process.env.ETHEREAL_PASS) {
          const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: process.env.ETHEREAL_USER,
              pass: process.env.ETHEREAL_PASS,
            },
          })

          const from = process.env.SMTP_FROM || process.env.ETHEREAL_USER
          const emailBody = resetPasswordEmail({ resetLink, siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Pehlivan Team' })
          const info = await transporter.sendMail({
            from,
            to: email,
            subject: 'Şifre sıfırlama isteğiniz (Ethereal preview)',
            html: emailBody.html,
            text: emailBody.text,
          })
          const previewUrl = nodemailer.getTestMessageUrl(info)
          console.log('[forgot] Ethereal preview URL (forced, from env):', previewUrl)
        } else {
          const testAccount = await nodemailer.createTestAccount()
          const transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          })

          const from = process.env.SMTP_FROM || testAccount.user
          const emailBody = resetPasswordEmail({ resetLink, siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Pehlivan Team' })
          const info = await transporter.sendMail({
            from,
            to: email,
            subject: 'Şifre sıfırlama isteğiniz (Ethereal preview)',
            html: emailBody.html,
            text: emailBody.text,
          })
          const previewUrl = nodemailer.getTestMessageUrl(info)
          console.log('[forgot] Ethereal preview URL (forced):', previewUrl)
        }

      // try real SMTP when configured
      } else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        // nodemailer may not be installed in every environment; keep import dynamic and ignore TS compile-time check
        // @ts-expect-error - dynamic import may not be present in all environments
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
        const emailBody = resetPasswordEmail({ resetLink, siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Pehlivan Team' })
        const info = await transporter.sendMail({
          from,
          to: email,
          subject: 'Şifre sıfırlama isteğiniz',
          html: emailBody.html,
          text: emailBody.text,
        })
        console.log('[forgot] reset email sent to', email, 'info=', info?.messageId || '')

      // fallback: in development use Ethereal so devs can preview messages
      } else if (process.env.NODE_ENV !== 'production') {
        // @ts-expect-error - dynamic import may not be present in all environments
        const nodemailer = await import('nodemailer')

        // If explicit Ethereal credentials are provided via env (for deterministic dev previews), use them.
        if (process.env.ETHEREAL_USER && process.env.ETHEREAL_PASS) {
          const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: process.env.ETHEREAL_USER,
              pass: process.env.ETHEREAL_PASS,
            },
          })

          const from = process.env.SMTP_FROM || process.env.ETHEREAL_USER
          const emailBody = resetPasswordEmail({ resetLink, siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Pehlivan Team' })
          const info = await transporter.sendMail({
            from,
            to: email,
            subject: 'Şifre sıfırlama isteğiniz (Ethereal preview)',
            html: emailBody.html,
            text: emailBody.text,
          })
          // nodemailer.getTestMessageUrl works with Ethereal transports too
          const previewUrl = nodemailer.getTestMessageUrl(info)
          console.log('[forgot] Ethereal preview URL (from env):', previewUrl)
        } else {
          // Create a disposable Ethereal test account when explicit creds aren't supplied
          const testAccount = await nodemailer.createTestAccount()
          const transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          })

          const from = process.env.SMTP_FROM || testAccount.user
          const emailBody = resetPasswordEmail({ resetLink, siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Pehlivan Team' })
          const info = await transporter.sendMail({
            from,
            to: email,
            subject: 'Şifre sıfırlama isteğiniz (Ethereal preview)',
            html: emailBody.html,
            text: emailBody.text,
          })
          const previewUrl = nodemailer.getTestMessageUrl(info)
          console.log('[forgot] Ethereal preview URL:', previewUrl)
        }

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
