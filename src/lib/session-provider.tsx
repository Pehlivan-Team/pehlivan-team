'use client'

import { SessionProvider } from 'next-auth/react'
import React from 'react'

type Props = {
  children?: React.ReactNode
}
// NextAuth.js oturum sağlayıcısı componenti
export const NextAuthProvider = ({ children }: Props) => {
  // refetchInterval: seconds between background session revalidations
  // refetchOnWindowFocus: revalidate when the window/tab is focused
  // These help keep the client session fresh (profile changes, role changes) without forcing sign-out/sign-in.
  return (
    <SessionProvider refetchInterval={30} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  )
}
