"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Copy, Link as LinkIcon } from "lucide-react";

export default function ShortenPage() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

      if (!data.success) {
        throw new Error(data.error || "Bir hata oluştu.");
      }

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
    navigator.clipboard.writeText(shortUrl);
    alert("Kısa link kopyalandı!");
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white flex items-center justify-center">
      <div className="container max-w-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Link Kısaltıcı</h1>
        <p className="text-gray-400 mb-8">
          Uzun linklerinizi Pehlivan Team markalı kısa linklere dönüştürün.
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
            {isLoading ? "Kısaltılıyor..." : "Kısalt"}
          </Button>
        </form>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {shortUrl && (
          <div className="mt-8 p-4 bg-slate-800 rounded-lg flex items-center justify-between">
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
        )}
      </div>
    </div>
  );
}
