"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy,
  Link as LinkIcon,
  Download,
  Share2,
  QrCode,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import logo from "@/assets/logo_png.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ShortenPage() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [logoDataUrl, setLogoDataUrl] = useState<string>("");

  // --- NEW: This effect loads the logo and converts it to a Data URL ---
  useEffect(() => {
    const img = new window.Image();
    img.src = logo.src;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setLogoDataUrl(canvas.toDataURL("image/png"));
      }
    };
  }, []);

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

  const getSvgElement = (): SVGSVGElement | null => {
    return document.querySelector("#qr-code-container svg");
  };

  const convertSvgToImage = (format: "png" | "jpeg"): Promise<string> => {
    return new Promise((resolve, reject) => {
      const svg = getSvgElement();
      if (!svg) return reject(new Error("QR Code SVG not found."));

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      canvas.width = svg.width.baseVal.value;
      canvas.height = svg.height.baseVal.value;

      img.onload = () => {
        if (ctx) {
          if (format === "jpeg") {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          const url = canvas.toDataURL(`image/${format}`);
          resolve(url);
        } else {
          reject(new Error("Canvas context could not be created."));
        }
      };
      img.onerror = reject;
      img.src =
        "data:image/svg+xml;base64," +
        btoa(unescape(encodeURIComponent(svgData)));
    });
  };

  const handleDownload = async (format: "png" | "jpeg" | "svg") => {
    let url: string;
    try {
      if (format === "svg") {
        const svg = getSvgElement();
        if (!svg) throw new Error("QR Code not found.");
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        url = URL.createObjectURL(blob);
      } else {
        url = await convertSvgToImage(format);
      }

      const link = document.createElement("a");
      link.href = url;
      link.download = `pehlivan-team-qrcode.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (format === "svg") URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert(`Hata: QR kodu ${format} olarak indirilemedi.`);
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      alert("Tarayıcınız bu özelliği desteklemiyor.");
      return;
    }

    try {
      const dataUrl = await convertSvgToImage("jpeg");
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "pehlivan-team-qrcode.jpg", {
        type: "image/jpeg",
      });

      const shareData = {
        title: "Pehlivan Team Kısaltılmış Link",
        text: `Oluşturulan kısa link: ${shortUrl}`,
        files: [file],
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        alert("Tarayıcınız bu dosyayı paylaşmayı desteklemiyor.");
      }
    } catch (error) {
      console.error("Share error:", error);
      alert("Hata: QR kodu paylaşılamadı.");
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
            placeholder="https://..."
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
                  id="qr-code-container"
                  className="bg-white p-4 rounded-lg inline-block shadow-lg"
                >
                  {/* Only render the QR code when the logo data is ready */}
                  {logoDataUrl && (
                    <QRCodeSVG
                      value={shortUrl}
                      size={256}
                      level={"H"}
                      includeMargin={true}
                      imageSettings={{
                        src: logoDataUrl, // Use the embedded Data URL
                        height: 48,
                        width: 48,
                        excavate: true,
                      }}
                    />
                  )}
                </div>
                <div className="mt-6 flex justify-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <Download className="mr-2 h-4 w-4" />
                        <span>İndir</span>
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-700 text-white border-slate-600">
                      <DropdownMenuItem onClick={() => handleDownload("png")}>
                        PNG olarak indir
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload("jpeg")}>
                        JPG olarak indir
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload("svg")}>
                        SVG olarak indir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {typeof navigator !== "undefined" && (
                    <Button variant="outline" onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" /> Paylaş
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
