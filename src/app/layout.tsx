import type { Metadata } from 'next'

import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import Head from 'next/head'
import Script from 'next/script'

import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import GoogleOneTap from '@/components/auth/GoogleOneTap'
import Footer from '@/components/ui/navbar/footer'
import { NavbarWrapper } from '@/components/ui/navbar/navbar-wrapper'
import { Topbar, BottomBar } from '@/components/ui/navbar/topbar'
import { Toaster } from '@/components/ui/sonner'
import { EdgeStoreProviderClient } from '@/lib/edgestore-provider'
import { NextAuthProvider } from '@/lib/session-provider'
import { ThemeProvider } from '@/lib/theme-provider'

export const metadata: Metadata = {
  title: 'Tasarım Proje Topluluğu',
  description: 'Tasarım Proje Topluluğu',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
      <Head>
        <meta
          name="google-site-verification"
          content="5exvvxtam9b-z4dmsm9XkrJ68qOO4jLtD6IQIYyl_6I"
        />
        <meta name="apple-mobile-web-app-title" content="TAS-PRO" />
      </Head>
      <body>
        {/* 3. Google'ın script'ini body'nin başına ekle */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
          async
          defer
        />

        <Analytics />
        <GoogleAnalytics />
        <NextAuthProvider>
          <EdgeStoreProviderClient>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <GoogleOneTap />
              <NavbarWrapper />
              {/* Add left padding when a fixed sidebar is present (handled inside individual pages with lg:pl-72) */}
              <main className="min-h-screen">{children}</main>
              <Footer />
              <Toaster />
            </ThemeProvider>
          </EdgeStoreProviderClient>
        </NextAuthProvider>
      </body>
    </html>
  )
}
