import { firestoreAdmin } from "@/lib/firebase-admin";
import SponsorClientPage from "./_components/Needs";

// Veri Tipleri
interface IhtiyacItem {
  part_name: string;
  quantity: number;
  price: number;
  link: string;
}

interface TeamData {
  name: string;
  items: IhtiyacItem[];
  total: number;
}

// Sunucu Tarafında Veri Çekme Fonksiyonu
async function getAllNeeds(): Promise<TeamData[]> {
  const configDoc = await firestoreAdmin
    .collection("config")
    .doc("needsList")
    .get();
  const departments: string[] = configDoc.data()?.departments || [
    "Mekanik",
    "Gövde",
    "Elektrik",
  ];

  const allTeamData: TeamData[] = [];

  for (const deptId of departments) {
    const snapshot = await firestoreAdmin
      .collection(deptId)
      .orderBy("part_name")
      .get();

    // DEĞİŞİKLİK BURADA: doc.data()'dan gelen veriyi manuel olarak yeni bir objeye atıyoruz.
    const items: IhtiyacItem[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        part_name: data.part_name,
        quantity: data.quantity,
        price: data.price,
        link: data.link,
      };
    });

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    allTeamData.push({ name: `${deptId} Departmanı`, items, total });
  }

  return allTeamData;
}

// Bu bir Sunucu Bileşeni, bu yüzden 'async' kullanabiliriz.
export default async function SponsorPage() {
  // 1. Veriyi sunucuda çekiyoruz.
  const needs = await getAllNeeds();
  const grandTotal = needs.reduce((sum, team) => sum + team.total, 0);

  // 2. "Düz" hale getirilmiş veriyi prop olarak istemci bileşenine aktarıyoruz.
  return <SponsorClientPage needs={needs} grandTotal={grandTotal} />;
}