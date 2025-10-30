"use client";
// Google One Tap ile NextAuth.js entegrasyonu için bir React componenti
//! Düzgün çalışmıyor. Kontrol edip düzeltmek lazım.
import { useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";

declare global {
  interface Window {
    // Google One Tap attaches to window.google; mark it optional to avoid TS errors
    google?: any;
  }
}

export default function GoogleOneTap() {
  const { data: session, status } = useSession();
  const initialized = useRef(false);

  useEffect(() => {
    // Eğer kullanıcı zaten giriş yapmışsa veya bu component zaten yüklendiyse, tekrar çalıştırma
    console.log(status, initialized.current);
    if (status !== "unauthenticated" || initialized.current) {
      console.log("Component already initialized or user authenticated");
      return;
    }

    // Google Client ID'yi .env dosyasından al
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      console.error(
        "Google Client ID bulunamadı. NEXT_PUBLIC_GOOGLE_CLIENT_ID değişkenini kontrol edin."
      );
      return;
    }

    // Google'ın kimlik doğrulama script'i yüklendiğinde bu fonksiyon çalışacak
    if (window.google) {
      try {
        // Google One Tap'i başlat
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            // Kullanıcı modal'a tıkladığında bu callback çalışır
            // Google'dan gelen credential'ı al
            const { credential } = response;

            // next-auth'un signIn fonksiyonunu kullanarak giriş yap
            const result = await signIn("google", {
              credential,
              redirect: false, // Sayfanın yeniden yüklenmesini engelle
            });

            if (result?.ok) {
              toast.success("Başarıyla giriş yapıldı!");
            } else if (result?.error) {
              toast.error(`Giriş hatası: ${result.error}`);
            }
          },
          // Bu seçenek, kullanıcının oturumu varsa modal'ı otomatik olarak gösterir
          auto_select: false,
        });

        // Kullanıcıya One Tap modal'ını göster
        window.google.accounts.id.prompt();

        // Component'in tekrar başlatılmasını engelle
        initialized.current = true;
      } catch (error) {
        console.error("Google One Tap başlatılamadı:", error);
      }
    }
  }, [status]); // status değiştiğinde (örn: "loading" -> "unauthenticated") tekrar kontrol et

  // Bu component'in kendisi bir arayüz (UI) çizmez, sadece arka planda çalışır.
  return null;
}
