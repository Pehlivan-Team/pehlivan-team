import { NextRequest, NextResponse } from "next/server";
import { createShortLink } from "@/lib/shortener"; // Firestore'a kaydeden merkezi fonksiyonu import ediyoruz

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ success: false, error: "URL gerekli." }, { status: 400 });
    }

    // Gelen URL'i ve request header'larını merkezi fonksiyona gönderiyoruz.
    // Bu fonksiyon artık tüm işi (doğrulama, slug oluşturma, Firestore'a kaydetme) yapacak.
    const shortUrl = await createShortLink(url, request.headers);

    return NextResponse.json({ success: true, shortUrl });

  } catch (error) {
    console.error("API Error in /api/shorten:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
    // Hata mesajını istemciye daha anlaşılır bir şekilde gönderiyoruz.
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}