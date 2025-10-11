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
