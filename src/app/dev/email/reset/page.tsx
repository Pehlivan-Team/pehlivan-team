import React from 'react'
import EmailPreview from '@/components/dev/EmailPreview'
import { resetPasswordEmail } from '@/lib/email/resetPasswordTemplate'

// runtime removed temporarily to avoid invalid segment export during build

export default function Page() {
  const sampleResetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset/preview-token`
  const { html, text } = resetPasswordEmail({
    resetLink: sampleResetLink,
    siteName: 'Tas-Pro Trakya',
    userName: 'Yener',
    socialLinks: {
      github: 'https://github.com/pehlivan-team',
      twitter: 'https://twitter.com/tasprotrakya',
      instagram: 'https://instagram.com/tasprotrakya',
      youtube: 'https://youtube.com/',
      linkedin: 'https://www.linkedin.com/company/pehlivan-team/posts/?feedView=all',
    },
  })

  return (
    <div style={{ minHeight: '100vh', background: '#eef2f6', padding: 48 }}>
      <div style={{ maxWidth: 820, margin: '0 auto', display: 'grid', gap: 20 }}>
        <h1 style={{ margin: 0 }}>Password reset email preview</h1>
        <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: 8, overflow: 'hidden' }}>
          <EmailPreview html={html} />
        </div>

        <details>
          <summary style={{ cursor: 'pointer', padding: '8px 12px', background: '#fff', borderRadius: 6 }}>Plain-text source</summary>
          <pre style={{ whiteSpace: 'pre-wrap', padding: 12, background: '#fff', borderRadius: 6 }}>{text}</pre>
        </details>
      </div>
    </div>
  )
}
