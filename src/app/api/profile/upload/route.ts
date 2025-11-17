import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// This route no longer attempts to use Firestore/Firebase. The project uses EdgeStore
// for images — clients should upload directly to EdgeStore via the client API.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  // Server-side uploads are disabled for this project. Instruct clients to use EdgeStore.
  return NextResponse.json({ error: 'Sunucu tarafı yüklemeleri devre dışı. Lütfen istemci üzerinden EdgeStore (`/api/edgestore`) ile resim yükleyin.' }, { status: 501 })
}
