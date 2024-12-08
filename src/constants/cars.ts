import solar1 from "@/assets/arabalar/solar.jpeg";
import solar2 from "@/assets/arabalar/solar2.jpg";

import mavi1 from "@/assets/arabalar/mavi1.jpeg";
import mavi2 from "@/assets/arabalar/mavi2.jpeg";

import sari1 from "@/assets/arabalar/sarı1.jpeg";

export const cars = [
  {
    name: "Pehlivan Solar",
    year: 2014,
    awards: ["FORMULA G 2014 Kurul Özel Ödülü", "TÜBİTAK 2014 3.lük Ödülü"],
    photos: [solar2, solar1],
    carDesc:
      "Pehlivan Team'in ilk aracı olan Pehlivan Solar, 2014 yılında yarışlara katılmıştır. 2014 yılında Formula G ve TÜBİTAK yarışlarında dereceye giren araç, takımın başarısını kanıtlamıştır. Ayrıca araç, Trakya Üniversitesi Mühendislik Fakültesinde sergilenmektedir.",
    carPage: "/cars/pehlivan-solar",
    teamLeader: "Ali Deroğlu",
  },
  {
    name: "Elektrak",
    year: "2015 - 2016",
    awards: [
      "Communication Award",
      "Balkan Tour 2016",
      "TEC 2016 İkincilik Ödülü",
      "TEC 2015 Tasarım Ödülü",
    ],
    photos: [
      "https://bys.trakya.edu.tr/cache/img-thumb/a/af/af9/af9d/af9dee9a6229799a047998db29ff848f.png",
    ],
    carDesc:
      "Elektrak, Pehlivan Team'in ikinci aracıdır. 2015 ve 2016 yıllarında yarışlara katılan araç, takımın başarısını kanıtlamıştır. Ayrıca Balkan Turuna çıkan aracımız 'En İyi Sunum Ödülü' kazanmıştır. 5 ülkede 6 noktasını kapsayan Balkan Turu Bilim ve Teknik Dergisi Haziran sayısına çıkmıştır. Haberlere de konu olan aracımız Trakya Üniversitesi Mühendislik Fakültesinde sergilenmektedir.",
    carPage: "/cars/elektrak",
    teamLeader: "Ali Deroğlu - Yunus Emre Kukut",
  },
  {
    name: "Pehlivan Monte",
    year: 2019,
    awards: ["Europa Shell ECO Marathon 2019 Katılım Hakkı"],
    photos: [mavi2, mavi1],
    carDesc:
      "Pehlivan Monte, Pehlivan Team'in üçüncü aracıdır. 2019 yılında Shell Eco Marathon katılmaya hak kazanan araç, takımın başarısını kanıtlamıştır. ",
    carPage: "/cars/pehlivan-monte",
    teamLeader: "Osman Muhammed Güler",
  },
  {
    name: "Pehlivan MONTE-RC",
    year: 2021,
    awards: ["Tubitak Efficiency Challange 2021 Katılım Hakkı"],
    photos: [sari1],
    carDesc:
      "Pehlivan MONTE-RC, Pehlivan Team'in dördüncü aracıdır. 2021 yılında COVID-19 Sürecine rağmen geliştirilen aracımız Tübitak EFFICIENCY CHALLANGE yarışlarına katılmıştır. ",
    carPage: "/cars/pehlivan-monte-rc",
    teamLeader: "Enes Çetin - Can Polat Öcal",
  },
];
