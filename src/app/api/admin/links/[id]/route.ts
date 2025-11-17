import { revalidatePath } from 'next/cache'
import { NextResponse, NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

export async function DELETE(request: NextRequest, context: { params: any }) {
  try {
    const params = context.params
    const resolvedParams: any = await params
    const session: any = await getServerSession(authOptions as any)

    // Kullanıcının admin olup olmadığını kontrol et
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Yetkiniz yok.' }, { status: 403 })
    }

    const docId = resolvedParams?.id
    if (!docId) {
      return NextResponse.json({ success: false, error: 'Link ID eksik.' }, { status: 400 })
    }

    // Dökümanı Firestore'dan sil
    await firestoreAdmin.collection('links').doc(docId).delete()
    revalidatePath(`/admin/links`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete API Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
