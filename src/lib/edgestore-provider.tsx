'use client'

import React from 'react'

import { EdgeStoreProvider } from '@/lib/edgestore' // <-- Import from our new lib file

type Props = {
  children?: React.ReactNode
}

export const EdgeStoreProviderClient = ({ children }: Props) => {
  return <EdgeStoreProvider>{children}</EdgeStoreProvider>
}
