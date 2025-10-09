import solar1 from "@/assets/arabalar/solar2.jpg";
// Change this line from 'import' to 'const'
const elektrak = "https://bys.trakya.edu.tr/cache/img-thumb/a/af/af9/af9d/af9dee9a6229799a047998db29ff848f.png";
import monte from "@/assets/arabalar/mavi2.jpeg";
import monteRC from "@/assets/arabalar/sarı1.jpeg";
import pehli1 from "@/assets/arabalar/pehli1.png";

export const timelineEvents = [
  {
    year: "2014",
    title: "Pehlivan Solar & İlk Başarılar",
    description: "Takımımızın ilk aracı olan Pehlivan Solar ile yola çıktık. Katıldığımız ilk yarış olan Formula G'de 'Kurul Özel Ödülü' ve TÜBİTAK yarışında '3.lük Ödülü' kazanarak güçlü bir başlangıç yaptık.",
    image: solar1,
    awards: ["Formula G - Kurul Özel Ödülü", "TÜBİTAK - 3.lük Ödülü"],
  },
  {
    year: "2015",
    title: "Elektrak & Tasarım Ödülü",
    description: "İkinci aracımız Elektrak'ı geliştirdik ve katıldığı ilk TÜBİTAK Efficiency Challenge'da 'Tasarım Ödülü'nü kazandık.",
    image: elektrak, // This will now correctly use the URL string
    awards: ["TÜBİTAK - Tasarım Ödülü"],
  },
  // ... rest of the file is correct
  {
    year: "2016",
    title: "Balkan Turu ve Yeni Başarılar",
    description: "Elektrak ile 5 ülkeyi kapsayan bir Balkan Turu'na çıktık ve uluslararası alanda tanınırlık kazandık. Aynı yıl TÜBİTAK Efficiency Challenge'da 'İkincilik Ödülü' ve 'En İyi Sunum Ödülü'nü alarak başarılarımızı taçlandırdık.",
    image: elektrak,
    awards: ["TÜBİTAK - İkincilik Ödülü", "TÜBİTAK - En İyi Sunum Ödülü"],
  },
  {
    year: "2019",
    title: "Pehlivan Monte & Avrupa Macerası",
    description: "Üçüncü aracımız Pehlivan Monte ile Shell Eco Marathon Avrupa'ya katılma hakkı kazanarak uluslararası arenada yeniden boy gösterdik.",
    image: monte,
    awards: ["Shell ECO Marathon - Katılım Hakkı"],
  },
  {
    year: "2021",
    title: "Pehlivan MONTE-RC",
    description: "COVID-19 sürecinin zorluklarına rağmen dördüncü aracımız MONTE-RC'yi geliştirdik ve TÜBİTAK Efficiency Challenge'a katıldık.",
    image: monteRC,
    awards: ["TÜBİTAK - Katılım Hakkı"],
  },
  {
    year: "2024 - Günümüz",
    title: "Yeni Proje: Pehli1",
    description: "En güncel projemiz olan Pehli1 üzerinde çalışmalarımıza devam ediyoruz. Bu araçla TÜBİTAK Efficiency Challenge'da yeni başarılara imza atmayı hedefliyoruz.",
    image: pehli1,
    awards: ["Geliştirme Aşamasında"],
  },
];