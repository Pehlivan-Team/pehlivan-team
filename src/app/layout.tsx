import type { Metadata } from "next";
import "./globals.css";
import { Topbar, BottomBar } from "@/components/ui/navbar/topbar";
import Footer from "@/components/ui/navbar/footer";

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
    <html lang="en" className="overflow-x-hidden">
      <body>
        <Topbar />
        <BottomBar />
        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
