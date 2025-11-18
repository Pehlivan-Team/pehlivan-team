#  Pehlivan Team - Resmi Web Sitesi & Sosyal Medya Platformu

**Trakya Üniversitesi Tasarım ve Proje Topluluğu**

Pehlivan Team için modern, interaktif web sitesi ve eksiksiz sosyal medya platformu - başarılarımızı, araçlarımızı, tarihçemizi sergileyen ve topluluğumuz için tam özellikli sosyal ağ deneyimi sunan platform.

 **Canlı Demo:** [pehli1team.com](https://pehli1team.com)

---

##  Proje Hakkında

Bu kapsamlı platform iki ana amaca hizmet eder:
1. **Tanıtım Web Sitesi** - Takım başarıları, araçlar, tarihçe ve üye alımı
2. **Sosyal Medya Platformu** - Takım üyeleri ve topluluk için eksiksiz sosyal ağ çözümü

Modern web teknolojileriyle inşa edilmiş bu proje, basit bir tanıtım sitesinden gerçek zamanlı beslemeler, kullanıcı etkileşimleri, içerik önbelleği ve profesyonel araçlar içeren zengin özellikli bir sosyal platforma evrilmiştir.

---

##  Temel Özellikler

###  **Ana Web Sitesi Özellikleri**
- **İnteraktif Zaman Çizelgesi** - 2014'ten günümüze animasyonlu yolculuk
- **Araç Galerisi** - Tüm araçlarımızın hover efektleriyle kapsamlı vitrin
- **Takım Bölümleri** - Her alt takım için detaylı sayfalar (Elektrikli Araç, Roket, Otonom, PR, vb.)
- **Dinamik Başarılar** - Ödüller ve başarıların gerçek zamanlı gösterimi
- **Google Sheets Entegrasyonu** - Otomatik form gönderimi işleme
- **Mobil Öncelikli Tasarım** - Alt navigasyon ile tüm cihazlarda duyarlı

###  **Sosyal Medya Platformu** (`/feed`)
- **Eksiksiz Sosyal Ağ** - Takım topluluğu için Facebook benzeri işlevsellik
- **Gerçek Zamanlı Besleme Sistemi** - Lazy loading ile sonsuz kaydırma
- **Gelişmiş Gönderi Türleri** - Sosyal, proje güncellemeleri, takım güncellemeleri, eğitim paylaşımları, grup arayışı, bağlantılı gönderiler, sponsorlu içerik
- **Kullanıcı Etkileşimleri** - İyimser UI ile beğenme, yorum yapma, takip etme/etmeme sistemi
- **İçerik Yönetimi** - Resim yükleme, kategori seçimi, link paylaşımı ile zengin gönderi oluşturucu
- **Akıllı Önbellekleme** - Firebase kota tükenmesini önlemek için 2 dakikalık TTL önbellek sistemi
- **Arama ve Keşif** - Kullanıcı arama, hashtag desteği, bahsetme sistemi
- **Performans Optimize** - %90+ önbellek isabet oranı, 300ms altı yanıt süreleri

###  **Geliştirici Araçları**
- **URL Kısaltıcı** - QR kod üretimi ile markalı kısa linkler
- **Çoklu Logo QR Kodları** - Pehlivan Team, TP-Sosyal ve Topluluk logoları desteği
- **Yönetim Paneli** - İçerik yönetimi, analitik, kullanıcı yönetimi
- **Link Yönetimi** - Profesyonel URL kısaltma hizmeti

---

##  Teknoloji Stack

### **Ön Yüz**
- **Framework:** Next.js 16 (App Router)
- **Dil:** TypeScript
- **Stil:** Tailwind CSS + shadcn/ui
- **Animasyonlar:** Framer Motion
- **Durum Yönetimi:** İyimser güncellemeler ile React hooks
- **Form İşleme:** React Hook Form + Zod doğrulama
- **Resim İşleme:** EdgeStore entegrasyonu
- **İkonlar:** Lucide React

### **Arka Yüz & Veritabanı**
- **Veritabanı:** Firebase Firestore
- **Kimlik Doğrulama:** NextAuth.js (Google, GitHub, LinkedIn OAuth)
- **Dosya Depolama:** EdgeStore
- **Önbellekleme:** TTL ile bellek içi önbellekleme
- **Yönetim SDK:** Sunucu işlemleri için Firebase Admin

### **Performans & Optimizasyon**
- **Önbellekleme Stratejisi:** Otomatik temizlik ile 2 dakikalık TTL
- **Resim Optimizasyonu:** Next.js Image bileşeni + EdgeStore
- **Kod Bölme:** Next.js App Router ile otomatik
- **SEO:** Yerleşik Next.js SEO optimizasyonu

---

##  Proje Yapısı

```
src/
├── app/                          # Next.js App Router
│   ├── (social)/                 # Sosyal medya rotaları
│   │   ├── feed/                 # Ana sosyal besleme
│   │   ├── profile/[username]/   # Kullanıcı profilleri
│   │   ├── search/               # Kullanıcı/içerik arama
│   │   └── posts/[id]/           # Bireysel gönderi sayfaları
│   ├── admin/                    # Yönetim paneli
│   ├── api/                      # API rotaları
│   │   ├── posts/                # Önbellekli gönderi CRUD
│   │   ├── auth/                 # Kimlik doğrulama
│   │   ├── follow/               # Takip sistemi
│   │   └── edgestore/            # Dosya yükleme
│   ├── shortener/                # URL kısaltma aracı
│   └── ...                       # Diğer sayfalar
├── components/
│   ├── feed/                     # Sosyal besleme bileşenleri
│   │   ├── LazyFeed.tsx          # Sonsuz kaydırmalı besleme
│   │   └── FeedSearchBox.tsx     # Arama işlevselliği
│   ├── follow/                   # Takip sistemi
│   │   └── FollowButton.tsx      # Gerçek zamanlı takip etme/etmeme
│   ├── post/                     # Gönderi bileşenleri
│   │   ├── PostCard.tsx          # Bireysel gönderi gösterimi
│   │   └── PostComposer.tsx      # Zengin gönderi oluşturma
│   ├── ui/                       # Yeniden kullanılabilir UI bileşenleri
│   └── ...
├── lib/
│   ├── auth.ts                   # NextAuth yapılandırması
│   ├── firebase.ts               # Firebase istemci yapılandırması
│   ├── firebase-admin.ts         # Firebase admin SDK
│   └── validation/               # Zod şemaları
└── types/                        # TypeScript tanımları
```

---

##  Özellik Detayları

### **Sosyal Medya Platformu**
- **Besleme Türleri:** Tüm gönderiler, takip edilen besleme, akıllı algoritmalarla trend gönderiler
- **Gönderi Kategorileri:** Belirli doğrulama kurallarıyla 7 farklı gönderi türü
- **Kullanıcı Sistemi:** Takip ilişkileri ile eksiksiz profil yönetimi
- **Performans:** Gelişmiş önbellekleme Firebase kota sorunlarını önler
- **Gerçek Zamanlı:** Anında kullanıcı geri bildirimi için iyimser UI güncellemeleri

### **URL Kısaltıcı**
- **Markalı Linkler:** Pehlivan Team markalaması ile özel kısa URL'ler
- **QR Üretimi:** Logo seçenekleri ile çoklu format QR kodları (PNG, JPG, SVG)
- **Analitik Hazır:** Gelecekteki analitik entegrasyonu için hazırlanmış

### **Yönetim Özellikleri**
- **İçerik Yönetimi:** Tüm içerik türleri için tam CRUD işlemleri
- **Kullanıcı Yönetimi:** Kullanıcı yönetimi ve izinler
- **Analitik Paneli:** Kullanım istatistikleri ve performans metrikleri

---

##  Performans Metrikleri

### **Önbellekleme Sistemi**
- **Önbellek İsabet Oranı:** %90+
- **Yanıt Süreleri:** Ortalama 300ms altı
- **Firebase Kotası:** Okumalarda %95 azalma
- **TTL Yönetimi:** 2 dakikalık akıllı önbellekleme

### **Kullanıcı Deneyimi**
- **Sonsuz Kaydırma:** Intersection observer ile sorunsuz yükleme
- **İyimser UI:** Tüm kullanıcı eylemleri için anında geri bildirim
- **Mobil Performans:** Mobil öncelikli deneyim için optimize edilmiş

---


##  Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

##  Takım Kredileri

**Pehlivan Team tarafından geliştirildi**
- **Platform Mimarisi:** Modern full-stack sosyal medya platformu
- **Performans Mühendisliği:** Gelişmiş önbellekleme ve optimizasyon
- **UI/UX Tasarım:** Mobil öncelikli duyarlı tasarım
- **Arka Uç Sistemleri:** Ölçeklenebilir Firebase mimarisi

---

##  İletişim

- **Web Sitesi:** [pehli1team.com](https://pehli1team.com)
- **Sosyal:** [@pehlivanteam](https://instagram.com/pehlivanteam)
- **LinkedIn:** [Pehlivan Team](https://linkedin.com/company/pehlivan-team)
- **GitHub:** [Pehlivan-Team](https://github.com/Pehlivan-Team)

---

**Made by [Anshinx](https://github.com/anshinx) with <3 for Tas-Pro Trakya **