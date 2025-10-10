import { firestoreAdmin } from "@/lib/firebase-admin";
import { NeedsClientPage } from "./_components/NeedsClientPage";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export interface NeedItem {
  id: string; // Firestore document ID
  part_name: string;
  quantity: number;
  price: number;
  link: string;
}

export interface DepartmentNeeds {
  departmentName: string;
  items: NeedItem[];
}

// Firestore'dan tüm departmanların ihtiyaç listesini çeken fonksiyon
async function getNeeds(): Promise<DepartmentNeeds[]> {
  // Departman listesini de Firestore'dan dinamik olarak çekiyoruz
  const configDoc = await firestoreAdmin.collection('config').doc('needsList').get();
  const departments = configDoc.data()?.departments || ["Mekanik", "Gövde", "Elektrik"];

  const allNeeds: DepartmentNeeds[] = [];

  for (const dept of departments) {
    const snapshot = await firestoreAdmin.collection(dept).get();
    const items: NeedItem[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        part_name: data.part_name,
        quantity: data.quantity,
        price: data.price,
        link: data.link,
      };
    });
    allNeeds.push({ departmentName: dept, items });
  }

  return allNeeds;
}

export default async function AdminNeedsPage() {
  const needsData = await getNeeds();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">İhtiyaç Listesi Yönetimi</h1>
        <Link href="/liste/ekle">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Yeni Ürün Ekle
          </Button>
        </Link>
      </div>
      <NeedsClientPage initialData={needsData} />
    </div>
  );
}