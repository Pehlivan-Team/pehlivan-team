import cobanoglulogo from "@/public/cobanoglu.jpg";

interface Sponsor {
  name: string;
  logo: string;
  url: string;
  logoWidth: number;
  logoHeight: number;
  description: string;
  tier: string;
}

const Sponsors: Sponsor[] = [
  {
    name: "BOSCH",
    logo: "https://cdnuploads.aa.com.tr/uploads/Contents/2020/03/04/thumbs_b_c_a5ba64a27d49a929e9fdf630ad8ba4a1.jpg",
    url: "https://www.bosch.com.tr/",
    logoWidth: 200,
    logoHeight: 200,
    description: "BOSCH",
    tier: "gold",
  },
  {
    name: "UzunKöprü Ticaret ve Sanayi Odası",
    logo: "https://www.utso.org.tr/public/img/logo.png",
    url: "https://www.utso.org.tr/",
    logoWidth: 200,
    logoHeight: 200,
    description: "UzunKöprü Ticaret ve Sanayi Odası",
    tier: "gold",
  },
  {
    name: "UzunKöprü Belediyesi",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH2w71eLVn35bKyY_OadcwES_ismL82Rds6w&s",
    url: "https://www.uzunkopru.bel.tr/",
    logoWidth: 200,
    logoHeight: 200,
    description: "UzunKöprü Belediyesi",
    tier: "gold",
  },
  {
    name: "Çobanoğlu AV",
    logo: "https://i.postimg.cc/MKCPzvCP/cobanoglu.jpg",
    url: "https://www.instagram.com/cobanogluav/",
    logoWidth: 200,
    logoHeight: 200,
    description: "Çobanoğlu AV",
    tier: "gold",
  },
  {
    name: "Bilişim Deposu",
    logo: "https://haritane.com/yer/bilisim-deposu-672772.jpg",
    url: "https://www.bilisimdeposu.com/",
    logoWidth: 200,
    logoHeight: 200,
    description: "Bilişim Deposu",
    tier: "gold",
  },
];

export default Sponsors;
