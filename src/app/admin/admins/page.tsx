import { firestoreAdmin } from "@/lib/firebase-admin";
import { AdminsClientPage } from "./_components/AdminsClientPage";

export interface AdminUser {
  email: string;
}

// Firestore'dan tüm adminlerin listesini çeken fonksiyon
async function getAdmins(): Promise<AdminUser[]> {
  const adminsSnapshot = await firestoreAdmin.collection("admins").get();

  if (adminsSnapshot.empty) {
    return [];
  }

  // Doküman ID'leri e-posta adresleri olduğu için, ID'leri alıyoruz.
  return adminsSnapshot.docs.map(doc => ({ email: doc.id }));
}

export default async function AdminSettingsPage() {
  const admins = await getAdmins();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Yönetici Ayarları</h1>
      <AdminsClientPage initialAdmins={admins} />
    </div>
  );
}