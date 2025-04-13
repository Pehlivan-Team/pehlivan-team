const logo = require("../assets/logo_png.png");
const description_cols = {
  "fatih-cosar": [
    "Fatih Coşar, takım kaptanı ve makine mühendisliği öğrencisidir.",
    "Yenilik ve verimliliğe odaklanarak takımı yönetir ve tüm projelerin en yüksek standartlarda tamamlanmasını sağlar.",
  ],
  "yener-suphan-gunes": [
    "Yener Süphan Güneş, elektrik ve yazılım geliştirme başkanıdır.",
    "Elektrik ve elektronik mühendisliği öğrencisi olarak, devre tasarımı ve yazılım entegrasyonu konularında uzmanlık getirir.",
  ],
  "ozan-cagan-isik": [
    "Ozan Çağan Işık, tasarım başkanı ve makine mühendisliği öğrencisidir.",
    "Takımın projelerinin estetik ve işlevsel tasarımından sorumludur, projelerin hem görsel olarak çekici hem de mekanik olarak sağlam olmasını sağlar.",
  ],
  "kaan-yilmaz": [
    "Kaan Yılmaz, analiz başkanı ve makine mühendisliği öğrencisidir.",
    "Hesaplamalı analiz ve simülasyonlarda uzmanlaşmıştır, takımın tasarımlarının performansı ve güvenilirliği hakkında kritik bilgiler sağlar.",
  ],
  "mert-kilic": [
    "Mert Kılıç, gövde tasarım başkanı ve makine mühendisliği öğrencisidir.",
    "Takımın projelerinin yapısal bütünlüğü ve aerodinamiğine odaklanır, projelerin tüm güvenlik ve performans standartlarını karşılamasını sağlar.",
  ],
  "mirza-berk-demirtas": [
    "Mirza Berk Demirtaş, mekanik başkanı ve makine mühendisliği öğrencisidir.",
    "Takımın projelerinin mekanik sistemlerini denetler, sistemlerin sorunsuz ve verimli çalışmasını sağlar.",
  ],
  "esref-kaan-kurtoglu": [
    "Eşref Kaan Kurtoğlu, projelerin gövdesinden sorumlu ve makine mühendisliği öğrencisidir.",
    "Tasarım ekibiyle yakın çalışarak yapısal bileşenlerin sağlam ve güvenilir olmasını sağlar.",
  ],
  "emirhan-fidan": [
    "Emirhan Fidan, mekanikten sorumlu ve makine mühendisliği öğrencisidir.",
    "Mekanik sistemlerin geliştirilmesi ve bakımında yardımcı olur, sistemlerin takımın katı standartlarını karşılamasını sağlar.",
  ],
  "emir-yavuz": [
    "Emir Yavuz, mekanikten sorumlu ve makine mühendisliği öğrencisidir.",
    "Mekanik bileşenlerin en yüksek performans için sorunlarını giderir ve optimize eder.",
  ],
};

export const members = [
  {
    id: "fatih-cosar",
    name: "Fatih Coşar",
    role: "Takım Kaptanı / Makine Mühendisliği",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQFJU_ltvuInQg/profile-displayphoto-shrink_400_400/B4DZVHhTLSHAAg-/0/1740661667421?e=1750291200&v=beta&t=ZuZN3KIj3DB8mHsAfdTetku584QAsnWTAI4GxarjRIY",
    socials: {
      linkedin: "https://www.linkedin.com/in/fatih-co%C5%9Far-a67266237/",
      instagram: "https://www.instagram.com/fatih.csar/",
    },
    description: description_cols["fatih-cosar"],
  },
  {
    id: "yener-suphan-gunes",
    name: "Yener Süphan Güneş",
    role: "Elektronik Başkanı/Elektrik-Elektronik Mühendisliği",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQHpnkgGrAC76w/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1710853420584?e=1750291200&v=beta&t=Ug38yR1oejSQfVYkjxt2ZTm0DoOh5HQBPvyCC-JDS64",
    socials: {
      linkedin:
        "https://www.linkedin.com/in/yener-s%C3%BCphan-g%C3%BCne%C5%9F-452435209/",
      instagram: "https://www.instagram.com/yenergunes/",
    },
    description: description_cols["yener-suphan-gunes"],
  },
  {
    id: "ozan-cagan-isik",
    name: "Ozan Çağan Işık",
    role: "Tasarım Başkanı / Makine Mühendisliği",
    img: "https://media.licdn.com/dms/image/v2/D5603AQFr6Y5WXmO5CA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1667554273512?e=1750291200&v=beta&t=ro-G8PFFPn1A4vU_pg2yZQHLcE_sfO7Xe35-iS3KeqU",
    socials: {
      linkedin:
        "https://www.linkedin.com/in/ozan-%C3%A7a%C4%9Fan-i%C5%9F%C4%B1k-281a83255/",
      instagram: "https://www.instagram.com/ozancaganisik/",
    },
    description: description_cols["ozan-cagan-isik"],
  },
  {
    id: "kaan-yilmaz",
    name: "Kaan Yılmaz",
    role: "Analiz Başkanı / Makine Mühendisliği",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQEIi8al_UsVxg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1701944312763?e=1750291200&v=beta&t=u6yYzZ5-gMEACpo9rufcbwyZthu23seC1sMCJfRJCW4",
    socials: {
      linkedin: "https://www.linkedin.com/in/kaan-y%C4%B1lmaz-aba536254/",
      instagram: "https://www.instagram.com/kaanylmz227/",
    },
    description: description_cols["kaan-yilmaz"],
  },
  {
    id: "mert-kilic",
    name: "Mert Kılıç",
    role: "Gövde Tasarım Başkanı / Makine Mühendisliği",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQEX-P1tsB3xUQ/profile-displayphoto-shrink_400_400/B4DZVlZfYhHIAg-/0/1741162938549?e=1750291200&v=beta&t=L5lbpym_w_o8R7ZP4SAPBaSfR6vxHQBYMSWMooSLXFs",
    socials: {
      linkedin:
        "https://www.linkedin.com/in/mert-k%C4%B1l%C4%B1%C3%A7-2227562b8/",
      instagram: "https://www.instagram.com/merdozki/",
    },
    description: description_cols["mert-kilic"],
  },
  {
    id: "mirza-berk-demirtas",
    name: "Mirza Berk Demirtaş",
    role: "Mekanik Başkanı / Makine Mühendisliği",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQE7In7vRjX_NQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1730484538565?e=1750291200&v=beta&t=S-uu6SNdzLn8j9wJFdlIuxstQxpv9aHWFLvGv4otayU",
    socials: {
      linkedin:
        "https://www.linkedin.com/in/mirza-berk-demirta%C5%9F-72a953190/",
      instagram: "https://www.instagram.com/mirzaberks/",
    },
    description: description_cols["mirza-berk-demirtas"],
  },
  {
    id: "esref-kaan-kurtoglu",
    name: "Eşref Kaan Kurtoğlu",
    role: "Gövde Sorumlusu /Makine Mühendisliği",
    img: "https://media.licdn.com/dms/image/v2/D4E03AQGI3IIUBs7Zfg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1731615714552?e=1750291200&v=beta&t=ubM60hkQ6m1rrQppYb0bPgb-3asQ2PBjKSWRUQHUPsE",
    socials: {
      linkedin:
        "https://www.linkedin.com/in/e%C5%9Fref-kaan-kurto%C4%9Flu-69891018a/",
      instagram: "https://www.instagram.com/esref_kaankurtoglu_",
    },
    description: description_cols["esref-kaan-kurtoglu"],
  },
  {
    id: "emirhan-fidan",
    name: "Emirhan Fidan",
    role: "Mekanik Sorumlusu /Makine Mühendisliği",
    img: "https://gedik-jewellery.vercel.app/_next/image?url=https%3A%2F%2Ffiles.edgestore.dev%2Fw7pjcbgsb9kdy7yw%2Fgedik%2F_public%2F08e51ca9-f4a0-41e9-a84e-3a4b54f08746.jpg&w=640&q=75",
    socials: {
      linkedin: "https://www.linkedin.com/in/emirhan-fidan-2782b4229/",
      instagram: "https://www.instagram.com/fdn.emirhan/",
    },
    description: description_cols["emirhan-fidan"],
  },
  {
    id: "emir-yavuz",
    name: "Emir Yavuz",
    role: "Mekanik Sorumlusu /Makine Mühendisliği",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQHqPxEMeJyBLw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1731533595225?e=1750291200&v=beta&t=DwmRJzizkGOCXC1C7Sct2_Mtjkhp7J-sZomNObJntxM",
    socials: {
      linkedin: "https://www.linkedin.com/in/emir-yavuz-090437196/",
      instagram: "https://www.instagram.com/emiryvuz_/",
    },
    description: description_cols["emir-yavuz"],
  },
  {
    id: "tolga-topcu",
    name: "Tolga Topcu",
    role: "Mekanik Sorumlusu /Makine Mühendisliği",
    img: "https://media.licdn.com/dms/image/v2/D4E03AQGxGIBRX9zziw/profile-displayphoto-shrink_400_400/B4EZVdoVaOHUAg-/0/1741032611659?e=1750291200&v=beta&t=gL7FZ2ICM8YzfJVjNzNXdDXx4aQrLo-uAiHZmUckk0Q",
    socials: {
      linkedin: "https://www.linkedin.com/in/tolga-top%C3%A7u-9b91a230a/",
      instagram: "https://www.instagram.com/t0lga_topcu",
    },
    description: description_cols["emir-yavuz"],
  },
];
