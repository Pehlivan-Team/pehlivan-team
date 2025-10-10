import { NextRequest, NextResponse } from 'next/server';
import { firestoreAdmin } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// --- OLAY GÜNCELLEME (PUT) ---
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Yetkiniz yok.' }, { status: 403 });
    }

    const docId = params.id;
    const body = await request.json();
    if (!docId || !body) {
        return NextResponse.json({ success: false, error: 'Eksik bilgi.' }, { status: 400 });
    }

    await firestoreAdmin.collection('timeline').doc(docId).update(body);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Timeline PUT Error:", error);
    return NextResponse.json({ success: false, error: "Güncelleme sırasında bir hata oluştu." }, { status: 500 });
  }
}

// --- OLAY SİLME (DELETE) ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Yetkiniz yok.' }, { status: 403 });
    }

    const docId = params.id;
    if (!docId) {
        return NextResponse.json({ success: false, error: 'Silinecek olay ID\'si eksik.' }, { status: 400 });
    }

    await firestoreAdmin.collection('timeline').doc(docId).delete();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Timeline DELETE Error:", error);
    return NextResponse.json({ success: false, error: "Silme sırasında bir hata oluştu." }, { status: 500 });
  }
}