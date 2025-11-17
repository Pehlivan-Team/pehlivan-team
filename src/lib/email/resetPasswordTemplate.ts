export function resetPasswordEmail(opts: {
  resetLink: string
  siteName?: string
  supportEmail?: string
  userName?: string
  logoPath?: string
  socialLinks?: {
    github?: string
    twitter?: string
    instagram?: string
    youtube?: string
    linkedin?: string
  }
}) {
  const {
    resetLink,
    siteName = 'Tas-Pro Trakya',
    supportEmail = 'pehli1team@gmail.com',
    userName,
    logoPath = '/tasprologo.jpg',
    socialLinks = {},
  } = opts

  const preheader = 'Şifrenizi sıfırlamak için güvenli bir bağlantı gönderildi.'

  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Şifre Sıfırlama</title>
    </head>
  <body style="margin:0;padding:0;background:#f2f4f6;font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial;color:#445566;">
      <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;">${preheader}</span>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding:28px 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.06);">
              <!-- Header / Brand -->
              <tr>
                <td style="background:#2e2e2e;padding:26px 24px;text-align:center;">
                  ${logoPath ? `<img src="${logoPath}" alt="${siteName}" width="140" style="display:block;margin:0 auto 8px; border-radius:8px;" />` : `<div style="font-size:20px;color:#fff;font-weight:700;">${siteName}</div>`}
                  <div style="color:rgba(255,255,255,0.9);font-size:13px;margin-top:6px;">${siteName} — Topluluğunuz için hızlı ve güvenli</div>
                </td>
              </tr>

              <!-- Hero / CTA -->
              <tr>
                <td style="padding:34px 32px 24px;text-align:center;">
                  <h2 style="margin:0 0 12px;font-size:20px;color:#2e2e2e;">Şifre Sıfırlama Talebi</h2>
                  <p style="margin:0 0 22px;color:#556675;font-size:15px;line-height:1.5;">${userName ? `Merhaba ${userName},` : 'Merhaba,'} şifre sıfırlama isteğinde bulunduk. Güvenli bağlantı ile şifrenizi sıfırlayabilirsiniz. Bağlantı 1 saat sonra geçersiz olacaktır.</p>

                  <a href="${resetLink}" style="display:inline-block;background:#ff9933;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;box-shadow:0 6px 18px rgba(255,153,51,0.14);">Şifreyi Sıfırla</a>
                </td>
              </tr>

              <!-- Secondary gray block with contact CTA -->
              <tr>
                <td style="background:#f5f7f9;padding:20px 28px;text-align:center;">
                  <p style="margin:0 0 12px;color:#77838d;font-size:14px;">Eğer bu isteği siz başlatmadıysanız, bu e-postayı yok sayabilirsiniz. Yardım için bizimle iletişime geçin.</p>
                  <a href="mailto:${supportEmail}" style="display:inline-block;padding:10px 16px;border:2px solid #ff9933;color:#ff9933;border-radius:8px;text-decoration:none;font-weight:600;">Yardım ve Destek</a>
                </td>
              </tr>

              <!-- Socials & footer -->
              <tr>
                <td style="padding:18px 28px 28px;text-align:center;">
                  <div style="margin-bottom:10px;color:#9aa6b2;font-size:13px;">@${siteName.toLowerCase().replace(/\s+/g, '')}</div>
                  <div style="display:flex;justify-content:center;gap:12px;margin-bottom:14px;">
                    ${socialLinks.github ? `<a href="${socialLinks.github}" style="display:inline-block;text-decoration:none;" aria-label="GitHub"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#ffffff" stroke="#e6e9ec"/><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.35-1.3-1.71-1.3-1.71-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.72 1.27 3.38.97.11-.76.41-1.27.75-1.56-2.56-.29-5.25-1.28-5.25-5.71 0-1.26.45-2.29 1.2-3.09-.12-.3-.52-1.51.11-3.15 0 0 .98-.31 3.2 1.18a11.1 11.1 0 012.92-.39c.99 0 1.98.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.64.23 2.85.11 3.15.75.8 1.2 1.83 1.2 3.09 0 4.44-2.7 5.41-5.27 5.7.42.36.8 1.08.8 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.68.8.56A11.52 11.52 0 0023.5 12c0-6.27-5.23-11.5-11.5-11.5z" fill="#2e2e2e"/></svg></a>` : ''}
                    ${socialLinks.twitter ? `<a href="${socialLinks.twitter}" style="display:inline-block;text-decoration:none;" aria-label="Twitter"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#ffffff" stroke="#e6e9ec"/><path d="M20 6.3c-.6.3-1.3.4-2 .5.7-.4 1.2-1 1.5-1.7-.7.4-1.4.7-2.2.9C16.9 5 16 4.5 15 4.5c-1.9 0-3.3 1.8-2.8 3.6C10 8 8.2 7.2 6.9 5.8c-.9 1.6-.3 3.6 1.1 4.5-.5 0-1-.1-1.4-.4v.1c0 1.7 1.2 3.1 2.8 3.4-.4.1-.8.1-1.2.1-.3 0-.6 0-.9-.1.6 1.8 2.3 3.1 4.3 3.2-1.6 1.2-3.6 1.9-5.7 1.9-.4 0-.7 0-1.1-.1C6.1 19 8.4 20 11 20c6 0 9.3-5 9.3-9.3v-.4c.7-.5 1.3-1.1 1.8-1.8-.6.3-1.2.5-1.9.6z" fill="#2e2e2e"/></svg></a>` : ''}
                    ${socialLinks.instagram ? `<a href="${socialLinks.instagram}" style="display:inline-block;text-decoration:none;" aria-label="Instagram"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#ffffff" stroke="#e6e9ec"/><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.2A4.8 4.8 0 1016.8 13 4.8 4.8 0 0012 8.2zm6-1.6a1.2 1.2 0 11-1.2-1.2 1.2 1.2 0 011.2 1.2z" fill="#2e2e2e"/></svg></a>` : ''}
                    ${socialLinks.youtube ? `<a href="${socialLinks.youtube}" style="display:inline-block;text-decoration:none;" aria-label="YouTube"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#ffffff" stroke="#e6e9ec"/><path d="M10 15l5.2-3L10 9v6zM21 8s-.2-1.4-.8-2c-.8-.9-1.7-.9-2.1-1C14.8 4.5 12 4.5 12 4.5h0s-2.8 0-6.1.5c-.5.1-1.4.1-2.1 1-.6.6-.8 2-.8 2S2 9.6 2 11.1v1.8C2 14.4 2.2 16 2.2 16s.2 1.4.8 2c.8.9 1.8.9 2.3 1 1.7.2 7 .5 7 .5s2.8 0 6.1-.5c.5-.1 1.4-.1 2.1-1 .6-.6.8-2 .8-2s.2-1.6.2-3.1V11.1C21 9.6 21 8 21 8z" fill="#2e2e2e"/></svg></a>` : ''}
                    ${socialLinks.linkedin ? `<a href="${socialLinks.linkedin}" style="display:inline-block;text-decoration:none;" aria-label="LinkedIn"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#ffffff" stroke="#e6e9ec"/><path d="M6.94 8.5H4.5V20h2.44V8.5zM5.72 6.9a1.4 1.4 0 110-2.8 1.4 1.4 0 010 2.8zM9.5 8.5H12v1.6c.4-.7 1.3-1.4 2.7-1.4 2.9 0 3.5 1.9 3.5 4.4V20h-2.4v-4.8c0-1.1 0-2.4-1.5-2.4-1.5 0-1.7 1.1-1.7 2.3V20H9.5V8.5z" fill="#2e2e2e"/></svg></a>` : ''}
                  </div>
                  <div style="font-size:12px;color:#9aa6b2;">© 2025 Tas-Pro Trakya. Tüm hakları saklıdır. Designed and developed by anshinx with ♥. </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `

  const text = `${userName ? `Merhaba ${userName},\n\n` : 'Merhaba,\n\n'}Şifrenizi sıfırlamak için şu bağlantıya gidin (1 saat geçerli):\n\n${resetLink}\n\nEğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelin. Yardım: ${supportEmail}`

  return { html, text }
}
