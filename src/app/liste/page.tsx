import Link from "next/link";
import { firestoreAdmin } from "@/lib/firebase-admin";
import { Printer, PlusCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import logo from "@/public/logo_png.png";
import { Button } from "@/components/ui/button";
import { PrintButton } from "./_components/PrintButton";

// --- Veri Tipleri ---
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

// --- Sunucu Tarafında Veri Çekme Fonksiyonu (Düzeltilmiş Hali) ---
async function getAllNeeds(): Promise<TeamData[]> {
  // 1. Departman listesini artık Firestore'dan dinamik olarak çekiyoruz.
  const configDoc = await firestoreAdmin
    .collection("config")
    .doc("needsList")
    .get();

  // Eğer config dokümanı yoksa veya boşsa, varsayılan bir liste kullan.
  const departments: string[] = configDoc.data()?.departments || [
    "Mekanik",
    "Gövde",
    "Elektrik",
  ];

  const allTeamData: TeamData[] = [];

  // 2. Sabit liste yerine, Firestore'dan gelen dinamik listeyi döngüye alıyoruz.
  for (const deptId of departments) {
    const snapshot = await firestoreAdmin
      .collection(deptId)
      .orderBy("part_name")
      .get();

    const items: IhtiyacItem[] = snapshot.docs.map(
      (doc) => doc.data() as IhtiyacItem
    );

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Görünen isim için "Departmanı" ekini ekliyoruz.
    allTeamData.push({ name: `${deptId} Departmanı`, items, total });
  }

  return allTeamData;
}

// --- Ana Sayfa Bileşeni (Değişiklik yok) ---
export default async function ListePage() {
  const teams = await getAllNeeds();
  const grandTotal = teams.reduce((sum, team) => sum + team.total, 0);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-8">
          <div className="flex justify-between items-center print:hidden">
            <h1 className="text-3xl font-bold text-gray-800">
              İhtiyaç Listesi
            </h1>
            <div className="flex gap-2">
              <Link href="/liste/ekle">
                <Button variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Yeni Ürün Ekle
                </Button>
              </Link>
              <PrintButton />
            </div>
          </div>
          <div className="hidden print:flex justify-between items-center border-b-2 pb-4 mb-4">
            <div className="flex items-center gap-4">
              <Image
                src={logo}
                alt="Pehlivan Team Logo"
                width={50}
                height={50}
              />
              <h1 className="text-2xl font-bold">
                Pehlivan Team İhtiyaç Listesi
              </h1>
            </div>
            <p className="text-lg">{new Date().toLocaleDateString("tr-TR")}</p>
          </div>
        </header>

        <div className="bg-white/50 p-6 rounded-lg shadow-md">
          {teams.map((team) => (
            <TeamSection key={team.name} {...team} />
          ))}
          <div className="mt-8 pt-4 border-t-4 border-gray-800">
            <p className="text-right text-2xl font-bold text-gray-900">
              Genel Toplam: {grandTotal.toFixed(2)} ₺
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Yeniden Kullanılabilir Alt Bileşenler (Değişiklik yok) ---

const TeamSection = ({ name, items, total }: TeamData) => (
  <div className="border-t-2 border-dashed border-gray-300 pt-6 mt-6 first:mt-0 first:border-t-0">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">{name}</h2>
    <div className="space-y-4">
      {items.length > 0 ? (
        items.map((item, index) => <ItemCard key={index} {...item} />)
      ) : (
        <p className="text-gray-500">
          Bu departman için henüz bir ihtiyaç eklenmemiş.
        </p>
      )}
    </div>
    <p className="text-right font-bold text-lg mt-4 text-gray-700">
      Departman Toplamı: {total.toFixed(2)} ₺
    </p>
  </div>
);

const ItemCard = (item: IhtiyacItem) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row gap-4 items-start break-inside-avoid">
    <div className="flex-grow">
      <p className="font-bold text-lg text-gray-900">{item.part_name}</p>
      <p className="text-gray-600">Adet: {item.quantity}</p>
      <p className="text-gray-600">Birim Fiyat: {item.price.toFixed(2)} ₺</p>
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline print:hidden break-all"
      >
        {item.link}
      </a>
    </div>
    <div className="hidden print:block ml-auto">
      <QRCodeSVG value={item.link} size={80} />
    </div>
  </div>
);
