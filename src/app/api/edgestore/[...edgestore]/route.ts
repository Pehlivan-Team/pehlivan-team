import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export const runtime = 'nodejs';

const es = initEdgeStore.create();

/**
 * Bu, Edge Store'un ana arka planıdır.
 * Güvenlik kurallarını ve dosya demetlerini (buckets) burada tanımlarız.
 */


const edgeStoreRouter = es.router({
  publicFiles: es
    .imageBucket()
    // Burası en önemli kısım: Sadece adminlerin dosya yüklemesine izin veriyoruz.
    .beforeUpload(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.isAdmin) {
        // Eğer kullanıcı admin değilse, yüklemeyi engelle.
        return false;
      }
      return true; // Kullanıcı admin ise devam et.
    }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

export type EdgeStoreRouter = typeof edgeStoreRouter;