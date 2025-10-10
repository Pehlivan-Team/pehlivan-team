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
