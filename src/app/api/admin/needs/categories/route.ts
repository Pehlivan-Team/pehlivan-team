import { NextRequest, NextResponse } from 'next/server';
import { firestoreAdmin } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import admin from 'firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Yetkiniz yok.' }, { status: 403 });
    }

    const { categoryName } = await request.json();
    if (!categoryName || typeof categoryName !== 'string' || categoryName.length < 2) {
      return NextResponse.json({ success: false, error: 'Geçersiz kategori adı.' }, { status: 400 });
    }

    const configRef = firestoreAdmin.collection('config').doc('needsList');

    // Yeni kategoriyi 'departments' dizisine ekle
    await configRef.update({
      departments: admin.firestore.FieldValue.arrayUnion(categoryName)
    });

    return NextResponse.json({ success: true, categoryName });

  } catch (error) {
    console.error("Add Category API Error:", error);
    return NextResponse.json({ success: false, error: "Bilinmeyen bir hata oluştu." }, { status: 500 });
  }
}