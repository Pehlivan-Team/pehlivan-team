import { Rocket, Zap, Dna, Mic, Code } from "lucide-react";
import placeHolderRocketImage from "@/assets/placeholder_ROCKET.jpg";
import placeHolderEvImage from "@/assets/placeholder_EV.jpg";
import placeHolderOtonomImage from "@/assets/placeholder_BORU.jpg";
import placeHolderLinuxImage from "@/assets/placeholder_Linux.jpg";
import placeHolderPRImage from "@/assets/placeholder_PR.jpg";

export const teamsData = [
  {
    slug: "elektrikli-arac",
    name: "Pehlivan Team / Elektrikli Araç",
    leader: "Eşref Kaan Kurtoğlu ",
    Icon: Zap,
    image: placeHolderEvImage, // Placeholder
    description:
      "Takımımızın köklerini oluşturan Elektrikli Araç ekibi, TÜBİTAK Efficiency Challenge gibi prestijli yarışlar için yüksek verimli elektrikli araçlar tasarlar ve üretir. Aerodinamik, kompozit malzemeler, batarya teknolojisi ve yerli motor sürücüleri gibi alanlarda uzmanlaşmıştır.",
    responsibilities: [
      "Araç şasi ve gövde tasarımı",
      "Batarya yönetim sistemleri (BMS) geliştirme",
      "Yerli motor sürücü kartı tasarımı",
      "Araç mekanik ve süspansiyon sistemleri",
      "Verimlilik ve performans analizleri",
    ],
  },
  {
    slug: "roket",
    name: "Pehlivan Team / Roket",
    leader: "Tolga Topçu",
    Icon: Rocket,
    image: placeHolderRocketImage, // Placeholder
    description:
      "Gökyüzüne ulaşma hedefiyle yola çıkan Roket Takımımız, Teknofest gibi ulusal yarışmalar için roket tasarımı ve üretimi yapar. Aerodinamik, itki sistemleri, aviyonik ve kurtarma sistemleri üzerine yoğunlaşarak, teknolojinin sınırlarını zorlar.",
    responsibilities: [
      "Yapısal ve aerodinamik tasarım ve analiz",
      "Aviyonik sistemlerin geliştirilmesi (uçuş bilgisayarı)",
      "Kurtarma sistemleri (paraşüt vb.) tasarımı",
      "İtki sistemi entegrasyonu",
      "Uçuş simülasyonları ve veri analizi",
    ],
  },
  {
    slug: "boru-otonom",
    name: "Börü / Otonom Araç",
    leader: "Sergen Zıvana",
    Icon: Dna,
    image: placeHolderOtonomImage, // Placeholder
    description:
      "Geleceğin teknolojisini bugünden şekillendiren Börü Otonom Araç Takımı, yapay zeka ve sensör teknolojilerini kullanarak kendi kendine sürüş yeteneğine sahip araçlar geliştirir. Görüntü işleme, makine öğrenmesi ve sensör füzyonu temel çalışma alanlarıdır.",
    responsibilities: [
      "Yapay zeka ve makine öğrenmesi modelleri geliştirme",
      "Görüntü işleme ve şerit takibi algoritmaları",
      "LIDAR, kamera ve diğer sensörlerin entegrasyonu",
      "Araç kontrol sistemleri ve otonom sürüş mantığı",
      "Simülasyon ortamında test ve doğrulama",
    ],
  },
  {
    slug: "linux",
    name: "Pehlivan Team / Linux Geliştirme",
    leader: "Ercan Ersoy",
    Icon: Code,
    image: placeHolderLinuxImage, // Placeholder
    description:
      "Açık kaynak dünyasının kalbinde yer alan Linux Geliştirme Takımımız, projelerimiz için özelleştirilmiş gömülü Linux sistemleri ve sürücüleri geliştirir. Araçlarımızın beyin fonksiyonlarını oluşturan yazılımsal altyapıyı sağlarlar.",
    responsibilities: [
      "Gömülü sistemler için Linux kerneli yapılandırma",
      "Donanım sürücüleri (driver) geliştirme",
      "Araç içi iletişim protokolleri (CAN bus vb.)",
      "Gerçek zamanlı işletim sistemleri (RTOS)",
      "Sistem performansı ve optimizasyonu",
    ],
  },
  {
    slug: "pr",
    name: "PR / İçerik Üretimi",
    leader: "Eşref Kaan Kurtoğlu",
    Icon: Mic,
    image: placeHolderPRImage, // Placeholder
    description:
      "Başarılarımızı ve teknik yolculuğumuzu dünyaya duyuran Halkla İlişkiler (PR) ve İçerik Üretimi ekibimiz, takımımızın sesi ve yüzüdür. Sosyal medya yönetimi, sponsorluk ilişkileri ve etkinlik organizasyonu gibi alanlarda faaliyet gösterirler.",
    responsibilities: [
      "Sosyal medya hesaplarının yönetimi ve içerik üretimi",
      "Sponsorluk dosyaları hazırlama ve ilişkileri yönetme",
      "Basın bültenleri ve tanıtım materyalleri oluşturma",
      "Web sitesi içeriğini güncelleme",
      "Etkinlik ve fuar organizasyonları",
    ],
  },
];
