import { NextRequest, NextResponse } from "next/server";
import { firestoreAdmin } from "@/lib/firebase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import admin from "firebase-admin";

// YENİ OLAY EKLEME (POST)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Yetkiniz yok." },
        { status: 403 }
      );
    }

    const body = await request.json();
    // Add server-side timestamp
    /*
      createdAt: admin.firestore.FieldValue.serverTimestamp(), kısmı önemli.
      Bu, Firestore'da olayın oluşturulma zamanını doğru bir şekilde kaydetmek için kullanılır.
      Klasik JS Date objesi ile de timestamp oluşturulabilir ancak bu durumda istemci ve sunucu saat dilimi farklılıkları
      nedeniyle tutarsızlıklar yaşanabilir. Bu yüzden Firestore'un kendi timestamp'ini kullanmak en iyisidir.
      Peki zaten firestore'da createdAt alanı var, neden bir de biz ekliyoruz?
      Çünkü firestore'un kendi timestamp'i, veritabanına veri eklenirken otomatik olarak oluşturulur.
      Ancak biz API üzerinden yeni bir olay eklerken, bu timestamp'in doğru ve tutarlı olmasını sağlamak için
      manuel olarak eklememiz gerekiyor.
      Ayrıca bunu eklememek firestore'un kendi timestamp'ini render ederken sorunlara yol açıyor.
      */
    const payload = {
      ...body,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const newEvent = await firestoreAdmin.collection("timeline").add(payload);

    return NextResponse.json({ success: true, id: newEvent.id });
  } catch (error) {
    console.error("Timeline POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Bilinmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}
