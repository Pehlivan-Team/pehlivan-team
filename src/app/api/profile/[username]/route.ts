import { NextRequest, NextResponse } from 'next/server'

import { firestoreAdmin } from '@/lib/firebase-admin' //

export async function GET(req: NextRequest, context: { params: any }) {
  const params = context.params
  const resolvedParams: any = await params
  const { username } = resolvedParams

  if (!username) {
    return NextResponse.json({ error: 'Kullanıcı adı gerekli' }, { status: 400 })
  }

  try {
    const usersRef = firestoreAdmin.collection('users')
    const q = usersRef.where('username', '==', username).limit(1)
    const querySnapshot = await q.get()

    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    const userDoc = querySnapshot.docs[0]
    const userData = userDoc.data()

    // ÖNEMLİ: E-posta gibi özel verileri buradan kaldır
    const publicProfile = {
      username: userData.username,
      name: userData.name,
      bio: userData.bio,
      team: userData.team,
      profilePictureUrl: userData.profilePictureUrl,
      socialLinks: userData.socialLinks,
    }

    // include canonical uid so callers can query by authorId
    ;(publicProfile as any).uid = userDoc.id

    return NextResponse.json(publicProfile)
  } catch (error) {
    console.error('Profil getirme hatası:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
