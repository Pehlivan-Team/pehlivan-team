"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Link as LinkIcon, Download, Share2, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import logo from "@/assets/logo_png.png"; // Import your logo

export default function ShortenPage() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShortUrl("");

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Bir hata oluştu.");
      setShortUrl(data.shortUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    alert("Kısa link kopyalandı!");
  };

  const handleDownload = () => {
    const canvas = qrCodeRef.current?.querySelector("canvas");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "pehlivan-team-link-qrcode.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleShare = async () => {
    const canvas = qrCodeRef.current?.querySelector("canvas");
    if (canvas && navigator.share) {
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], "pehlivan-team-qrcode.png", {
            type: "image/png",
          });
          try {
            await navigator.share({
              title: "Pehlivan Team Kısaltılmış Link",
              text: `Oluşturulan kısa link: ${shortUrl}`,
              files: [file],
            });
          } catch (error) {
            console.error("Paylaşım hatası:", error);
          }
        }
      }, "image/png");
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white flex items-center justify-center py-12">
      <div className="container max-w-lg text-center px-4">
        <QrCode className="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-4xl font-bold mb-4">Link Kısaltıcı & QR Kod</h1>
        <p className="text-gray-400 mb-8">
          Uzun linklerinizi Pehlivan Team markalı kısa linklere ve logolu QR
          kodlara dönüştürün.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="url"
            placeholder="https://uzun-linkinizi-buraya-yapistirin.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="bg-gray-800 border-gray-700 text-white"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Oluşturuluyor..." : "Oluştur"}
          </Button>
        </form>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        <AnimatePresence>
          {shortUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8"
            >
              <div className="p-4 bg-slate-800 rounded-lg flex items-center justify-between">
                <LinkIcon className="h-5 w-5 text-gray-400 mr-4" />
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 font-mono break-all hover:underline"
                >
                  {shortUrl}
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="ml-4"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-4 p-6 bg-slate-800 rounded-lg">
                <div
                  className="bg-white p-4 rounded-lg inline-block shadow-lg"
                  ref={qrCodeRef}
                >
                  <QRCodeSVG
                    value={shortUrl}
                    size={256}
                    level={"H"} // High error correction for logo
                    includeMargin={true}
                    imageSettings={{
                      src: logo.src,
                      height: 48,
                      width: 48,
                      excavate: true,
                    }}
                  />
                </div>
                <div className="mt-6 flex justify-center gap-4">
                  <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    İndir (.png)
                  </Button>
                  {typeof navigator !== "undefined" && (
                    <Button variant="outline" onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Paylaş
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
