'use client'

import { Printer } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const PrintButton = () => {
  return (
    <Button className="text-black border-black" onClick={() => window.print()}>
      <Printer className="mr-2 h-4 w-4 text-black" />
      Yazdır
    </Button>
  )
}
