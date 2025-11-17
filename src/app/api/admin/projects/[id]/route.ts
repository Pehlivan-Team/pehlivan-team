import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

// PROJE GÜNCELLEME (PUT)
export async function PUT(request: NextRequest, context: { params: any }) {
  try {
    const params = context.params
    const resolvedParams: any = await params
    const session: any = await getServerSession(authOptions as any)
    if (!session?.user?.permissions?.canManageProjects) {
      return NextResponse.json({ success: false, error: 'Yetkiniz yok.' }, { status: 403 })
    }
    const docId = resolvedParams?.id
    const body = await request.json()
    await firestoreAdmin.collection('projects').doc(docId).update(body)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Güncelleme sırasında bir hata oluştu.' },
      { status: 500 }
    )
  }
}

// PROJE SİLME (DELETE)
export async function DELETE(request: NextRequest, context: { params: any }) {
  try {
    const params = context.params
    const resolvedParams: any = await params
    const session: any = await getServerSession(authOptions as any)
    if (!session?.user?.permissions?.canManageProjects) {
      return NextResponse.json({ success: false, error: 'Yetkiniz yok.' }, { status: 403 })
    }
    const docId = resolvedParams?.id
    await firestoreAdmin.collection('projects').doc(docId).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Silme sırasında bir hata oluştu.' },
      { status: 500 }
    )
  }
}
