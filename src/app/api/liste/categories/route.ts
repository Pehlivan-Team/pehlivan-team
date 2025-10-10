import { NextResponse } from 'next/server';
import { firestoreAdmin } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const configRef = firestoreAdmin.collection('config').doc('needsList');
    const doc = await configRef.get();

    if (!doc.exists) {
      throw new Error("Kategori konfigürasyonu bulunamadı.");
    }

    const departments = doc.data()?.departments || [];
    return NextResponse.json({ success: true, departments });

  } catch (error) {
    console.error("Get Categories API Error:", error);
    return NextResponse.json({ success: false, error: "Kategoriler alınamadı." }, { status: 500 });
  }
}