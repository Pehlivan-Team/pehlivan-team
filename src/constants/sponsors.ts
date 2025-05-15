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
    logo: "https://imghost.net/ib/c58YKT5mzhQqh0Y_1747312962.jpg",
    url: "https://www.utso.org.tr/",
    logoWidth: 200,
    logoHeight: 200,
    description: "UzunKöprü Ticaret ve Sanayi Odası",
    tier: "gold",
  },
  {
    name: "UzunKöprü Belediyesi",
    logo: "https://imghost.net/ib/wCmziNqH4x3tvtf_1747313022.jpg",
    url: "https://www.uzunkopru.bel.tr/",
    logoWidth: 200,
    logoHeight: 200,
    description: "UzunKöprü Belediyesi",
    tier: "gold",
  },
  {
    name: "Çobanoğlu AV",
    logo: "https://imghost.net/ib/6eqNSp7KFdIz0Gi_1747314635.jpg",
    url: "https://www.uzunkopru.bel.tr/",
    logoWidth: 200,
    logoHeight: 200,
    description: "Çobanoğlu AV",
    tier: "gold",
  },
  {
    name: "Bilişim Deposu",
    logo: "https://imghost.net/ib/C9YWIrRLIYZOpS4_1747315391.jpg",
    url: "https://www.bilisimdeposu.com/",
    logoWidth: 200,
    logoHeight: 200,
    description: "Bilişim Deposu",
    tier: "gold",
  },
];

export default Sponsors;
