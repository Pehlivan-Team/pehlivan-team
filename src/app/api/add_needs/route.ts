import { NextRequest, NextResponse } from "next/server";
import { firestoreAdmin } from "@/lib/firebase-admin"; // Sunucu tarafı Firebase'i import et
import admin from 'firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { part_name, quantity, price, link, team } = await request.json();

    if (!part_name || !quantity || !price || !link || !team) {
      return NextResponse.json({ success: false, error: "Tüm zorunlu alanlar doldurulmalıdır." }, { status: 400 });
    }
    
    // Gelen departman adına göre ilgili Firestore koleksiyonunu hedefle (örn: "Mekanik")
    const collectionRef = firestoreAdmin.collection(team);

    // Yeni bir doküman ekle
    await collectionRef.add({
      part_name,
      quantity: Number(quantity),
      price: Number(price),
      link,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, message: "Ürün başarıyla eklendi." });

  } catch (error) {
    console.error("API Error in /api/liste/ekle:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}