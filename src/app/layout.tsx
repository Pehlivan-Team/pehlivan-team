import type { Metadata } from "next";
import "./globals.css";
import { Topbar, BottomBar } from "@/components/ui/navbar/topbar";
import Footer from "@/components/ui/navbar/footer";
import { ThemeProvider } from "@/lib/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextAuthProvider } from "@/lib/session-provider";
import { EdgeStoreProviderClient } from "@/lib/edgestore-provider";
import { NavbarWrapper } from "@/components/ui/navbar/navbar-wrapper";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import Head from "next/head";
export const metadata: Metadata = {
  title: "Pehlivan Team",
  description: "Pehlivan Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
      <Head>
        <meta
          name="google-site-verification"
          content="5exvvxtam9b-z4dmsm9XkrJ68qOO4jLtD6IQIYyl_6I"
        />
      </Head>
      <body>
        <Analytics />
        <GoogleAnalytics />
        <NextAuthProvider>
          <EdgeStoreProviderClient>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark" // Varsayılan tema olarak karanlığı ayarladık
              enableSystem
              disableTransitionOnChange
            >
              <NavbarWrapper />
              <main>{children}</main>
              <Footer />
              <Toaster />
            </ThemeProvider>
          </EdgeStoreProviderClient>
        </NextAuthProvider>
      </body>
    </html>
  );
}
