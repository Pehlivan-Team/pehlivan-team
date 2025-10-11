import { NextRequest, NextResponse } from 'next/server';
import { firestoreAdmin } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import admin from 'firebase-admin';

// YAZI GÜNCELLEME (PUT)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Yetkiniz yok.' }, { status: 403 });
    }
    const docId = params.id;
    const body = await request.json();
    
    await firestoreAdmin.collection('posts').doc(docId).update({
        ...body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Post Update Error:", error);
    return NextResponse.json({ success: false, error: "Güncelleme sırasında bir hata oluştu." }, { status: 500 });
  }
}

// YAZI SİLME (DELETE)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Yetkiniz yok.' }, { status: 403 });
    }
    const docId = params.id;
    await firestoreAdmin.collection('posts').doc(docId).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Post Delete Error:", error);
    return NextResponse.json({ success: false, error: "Silme sırasında bir hata oluştu." }, { status: 500 });
  }
}