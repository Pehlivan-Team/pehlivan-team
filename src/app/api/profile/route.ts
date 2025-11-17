import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin' //
import { UserProfile } from '@/types/profile'

/**
 * Giriş yapmış kullanıcının profil verilerini getirir.
 * Eğer profili yoksa, Google hesabından alınan varsayılan verilerle oluşturur.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  const userEmail = session.user.email
  const userRef = firestoreAdmin.collection('users').doc(userEmail)
  const doc = await userRef.get()

  if (!doc.exists) {
    // İlk kez giriş yapan kullanıcı için varsayılan profili oluştur
    const defaultProfile: UserProfile = {
      email: userEmail,
      name: session.user.name || 'Kullanıcı',
      image: session.user.image || '',
      username: userEmail.split('@')[0], // E-postadan varsayılan bir kullanıcı adı
      bio: '',
      team: '',
      profilePictureUrl: session.user.image || '', // Başlangıçta Google resmini kullan
      socialLinks: {},
    }

    await userRef.set(defaultProfile)
    return NextResponse.json(defaultProfile)
  }

  return NextResponse.json(doc.data())
}

/**
 * Giriş yapmış kullanıcının profil verilerini günceller.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  const userEmail = session.user.email
  const dataToUpdate = await req.json()

  // Kullanıcının e-posta, isim gibi verileri değiştirmesini engelle
  const { username, bio, team, profilePictureUrl, socialLinks } = dataToUpdate

  // Kullanıcı adı benzersiz mi kontrol et
  if (username) {
    const usersRef = firestoreAdmin.collection('users')
    const existingUser = await usersRef.where('username', '==', username).limit(1).get()

    if (!existingUser.empty && existingUser.docs[0].id !== userEmail) {
      return NextResponse.json({ error: 'Bu kullanıcı adı zaten alınmış.' }, { status: 400 })
    }
  }

  const userRef = firestoreAdmin.collection('users').doc(userEmail)

  try {
    // Build update payload only with fields that are explicitly provided
    const updatePayload: Record<string, any> = {}
    if (typeof dataToUpdate.name !== 'undefined') updatePayload.name = dataToUpdate.name
    if (typeof username !== 'undefined') updatePayload.username = username
    if (typeof bio !== 'undefined') updatePayload.bio = bio
    if (typeof team !== 'undefined') updatePayload.team = team
    if (typeof profilePictureUrl !== 'undefined') updatePayload.profilePictureUrl = profilePictureUrl
    if (typeof socialLinks !== 'undefined') updatePayload.socialLinks = socialLinks

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ success: true, message: 'Güncellenecek alan yok.' })
    }

    await userRef.update(updatePayload)
    return NextResponse.json({ success: true, message: 'Profil güncellendi.' })
  } catch (error) {
    console.error('Profil güncelleme hatası:', error)
    return NextResponse.json({ error: 'Profil güncellenirken bir hata oluştu.' }, { status: 500 })
  }
}
