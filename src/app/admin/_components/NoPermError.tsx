import { FileLock2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

function NoPermError() {
  return (
    <Alert>
      <AlertTitle className="text-xl flex flex-row">
        <FileLock2 className="mr-2" />
        Bu Sayfaya Erişim İzniniz Bulunmamaktadır.
      </AlertTitle>
      <AlertDescription className="mt-2">
        Bu sayfa yetki alanınız dışındadır. Bir hata olduğunu düşünüyorsanız, lütfen{' '}
        <Link className="text-blue-500" href="mailto:yenersg.58@gmail.com">
          buradan
        </Link>{' '}
        iletişime geçin.
        <br />
        <Link href="/admin" className="text-blue-500">
          Ana Sayfaya Dön
        </Link>
      </AlertDescription>
    </Alert>
  )
}

export default NoPermError
