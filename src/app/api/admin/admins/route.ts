import { NextRequest, NextResponse } from "next/server";
import { firestoreAdmin } from "@/lib/firebase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
