import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

// --- OLAY GÜNCELLEME (PUT) ---
export async function PUT(request: NextRequest, context: { params: any }) {
  try {
    const params = context.params
    const resolvedParams: any = await params
    const session: any = await getServerSession(authOptions as any)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Yetkiniz yok.' }, { status: 403 })
    }

    const docId = resolvedParams?.id
    const body = await request.json()
    if (!docId || !body) {
      return NextResponse.json({ success: false, error: 'Eksik bilgi.' }, { status: 400 })
    }

    await firestoreAdmin.collection('timeline').doc(docId).update(body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Timeline PUT Error:', error)
    return NextResponse.json(
      { success: false, error: 'Güncelleme sırasında bir hata oluştu.' },
      { status: 500 }
    )
  }
}

// --- OLAY SİLME (DELETE) ---
export async function DELETE(request: NextRequest, context: { params: any }) {
  try {
    const params = context.params
    const resolvedParams: any = await params
    const session: any = await getServerSession(authOptions as any)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Yetkiniz yok.' }, { status: 403 })
    }

    const docId = resolvedParams?.id
    if (!docId) {
      return NextResponse.json(
        { success: false, error: "Silinecek olay ID'si eksik." },
        { status: 400 }
      )
    }

    await firestoreAdmin.collection('timeline').doc(docId).delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Timeline DELETE Error:', error)
    return NextResponse.json(
      { success: false, error: 'Silme sırasında bir hata oluştu.' },
      { status: 500 }
    )
  }
}
