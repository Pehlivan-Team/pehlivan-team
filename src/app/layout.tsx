import type { Metadata } from "next";
import "./globals.css";
import { Topbar, BottomBar } from "@/components/ui/navbar/topbar";

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
        {children}
      </body>
    </html>
  );
}
