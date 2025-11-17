import { initEdgeStore } from '@edgestore/server'
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'

// runtime removed temporarily to avoid invalid segment export during build

const es = initEdgeStore.create()

/**
 * Bu, Edge Store'un ana arka planıdır.
 * Güvenlik kurallarını ve dosya demetlerini (buckets) burada tanımlarız.
 */

const edgeStoreRouter = es.router({
  // Admin-only general public files bucket (unchanged policy)
  publicFiles: es.imageBucket().beforeUpload(async () => {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return false
    }
    return true
  }),

  // New bucket for profile images: allow any authenticated user
  profileImages: es.imageBucket().beforeUpload(async () => {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      console.log('[EdgeStore] DENY profileImages upload: no session')
      return false
    }
    console.log('[EdgeStore] ALLOW profileImages upload for', session.user.email)
    return true
  }),

  // New bucket for post images: allow any authenticated user
  postImages: es.imageBucket().beforeUpload(async () => {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      console.log('[EdgeStore] DENY postImages upload: no session')
      return false
    }
    console.log('[EdgeStore] ALLOW postImages upload for', session.user.email)
    return true
  }),
})

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
})

export { handler as GET, handler as POST }

export type EdgeStoreRouter = typeof edgeStoreRouter
