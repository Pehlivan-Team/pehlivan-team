import solar1 from "@/assets/arabalar/solar.jpeg";
import solar2 from "@/assets/arabalar/solar2.jpg";

import mavi1 from "@/assets/arabalar/mavi1.jpeg";
import mavi2 from "@/assets/arabalar/mavi2.jpeg";

import sari1 from "@/assets/arabalar/sarı1.jpeg";

export const cars = [
  {
    name: "Pehlivan Solar",
    year: 2014,
    awards: ["FORMULA G 2015", "TÜBİTAK 2015"],
    photos: [solar2, solar1],
    carDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    carPage: "/cars/pehlivan-solar",
    teamLeader: "Ali Deroğlu",
  },
  {
    name: "Elektrak",
    year: "2015 - 2016",
    awards: ["FORMULA G 2016", "TÜBİTAK 2016"],
    photos: [
      "https://bys.trakya.edu.tr/cache/img-thumb/a/af/af9/af9d/af9dee9a6229799a047998db29ff848f.png",
    ],
    carDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    carPage: "/cars/elektrak",
    teamLeader: "Ali Deroğlu - Yunus Emre Kukut",
  },
  {
    name: "Pehlivan Monte",
    year: 2019,
    awards: ["FORMULA G 2017", "TÜBİTAK 2017"],
    photos: [mavi2, mavi1],
    carDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    carPage: "/cars/pehlivan-monte",
    teamLeader: "Osman Muhammed Güler",
  },
  {
    name: "Pehlivan MONTE-RC",
    year: 2021,
    awards: ["FORMULA G 2018", "TÜBİTAK 2018"],
    photos: [sari1],
    carDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    carPage: "/cars/pehlivan-monte-rc",
    teamLeader: "Enes Çetin - Can Polat Öcal",
  },
];
