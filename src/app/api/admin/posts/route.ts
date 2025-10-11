import { NextRequest, NextResponse } from 'next/server';
import { firestoreAdmin } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import admin from 'firebase-admin';

// YENİ YAZI OLUŞTURMA (POST)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Yetkiniz yok.' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, isPublished, imageUrl, slug } = body;

    if (!title || !content || !slug) {
      return NextResponse.json({ success: false, error: 'Başlık, içerik ve slug zorunludur.' }, { status: 400 });
    }

    const newPost = await firestoreAdmin.collection('posts').add({
      ...body,
      author: session.user.name,
      authorImage: session.user.image,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: newPost.id });

  } catch (error) {
    console.error("Post Create Error:", error);
    return NextResponse.json({ success: false, error: "Bilinmeyen bir hata oluştu." }, { status: 500 });
  }
}