import { firestoreAdmin } from "@/lib/firebase-admin";
import { AdminsClientPage } from "./_components/AdminsClientPage";

// AdminPermissions tipini next-auth.d.ts'den import etmek yerine burada tekrar tanımlayabiliriz.
interface AdminPermissions {
  canManageAdmins?: boolean;
  canManageBlog?: boolean;
  canManageLinks?: boolean;
  canManageNeeds?: boolean;
  canManageTimeline?: boolean;
}

export interface AdminUser {
  email: string;
  permissions: AdminPermissions;
}

// Firestore'dan tüm adminlerin listesini ve yetkilerini çeken fonksiyon
async function getAdmins(): Promise<AdminUser[]> {
  const adminsSnapshot = await firestoreAdmin.collection("admins").get();

  if (adminsSnapshot.empty) {
    return [];
  }

  return adminsSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      email: doc.id,
      permissions: data.permissions || {}, // Eğer permissions yoksa boş bir obje ata
    };
  });
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