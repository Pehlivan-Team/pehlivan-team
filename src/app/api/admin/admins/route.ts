import { NextRequest, NextResponse } from "next/server";
import { firestoreAdmin } from "@/lib/firebase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// YENİ ADMİN EKLEME (POST)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Yetkiniz yok." },
        { status: 403 }
      );
    }
    if (!session?.user?.permissions?.canManageAdmins) {
      return NextResponse.json(
        { success: false, error: "Admin ekleme yetkiniz yok." },
        { status: 403 }
      );
    }

    const { email } = await request.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz e-posta adresi." },
        { status: 400 }
      );
    }

    // Doküman ID'si olarak e-posta adresini kullanarak yeni admini ekle
    await firestoreAdmin.collection("admins").doc(email).set({
      isAdmin: true,
    });

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error("Admin Ekleme Hatası:", error);
    return NextResponse.json(
      { success: false, error: "Bilinmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}

// ADMİN SİLME (DELETE)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Yetkiniz yok." },
        { status: 403 }
      );
    }
    if (!session?.user?.permissions?.canManageAdmins) {
      return NextResponse.json(
        { success: false, error: "Admin silme yetkiniz yok." },
        { status: 403 }
      );
    }

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { success: false, error: "E-posta adresi gerekli." },
        { status: 400 }
      );
    }

    // Bir adminin kendini silmesini engelle
    if (session.user.email === email) {
      return NextResponse.json(
        { success: false, error: "Kendinizi silemezsiniz." },
        { status: 400 }
      );
    }

    // Doküman ID'si olarak e-posta adresini kullanarak admini sil
    await firestoreAdmin.collection("admins").doc(email).delete();

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error("Admin Silme Hatası:", error);
    return NextResponse.json(
      { success: false, error: "Bilinmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}
// ADMİN YETKİLERİNİ GÜNCELLEME (PUT)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // Sadece admin yönetme yetkisi olanlar bu işlemi yapabilir
    if (!session?.user?.permissions?.canManageAdmins) {
      return NextResponse.json(
        { success: false, error: "Yetkiniz yok." },
        { status: 403 }
      );
    }

    const { email, permissions } = await request.json();
    if (!email || !permissions) {
      return NextResponse.json(
        { success: false, error: "Eksik bilgi." },
        { status: 400 }
      );
    }

    // Kullanıcının kendi yetkilerini değiştirmesini engelle (güvenlik için)
    if (session.user.email === email) {
      return NextResponse.json(
        { success: false, error: "Kendi yetkilerinizi değiştiremezsiniz." },
        { status: 400 }
      );
    }

    // Firestore'da ilgili adminin permissions alanını güncelle
    await firestoreAdmin.collection("admins").doc(email).update({
      permissions: permissions,
    });
    revalidatePath(`/admin/admins`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Güncelleme Hatası:", error);
    return NextResponse.json(
      { success: false, error: "Bilinmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}
