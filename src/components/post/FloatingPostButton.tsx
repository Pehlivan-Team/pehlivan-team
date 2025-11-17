'use client'

import { useState } from 'react'

import PostComposer from '@/components/profile/PostComposer'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useSession } from 'next-auth/react'

export default function FloatingPostButton() {
  const session = useSession()
  const [open, setOpen] = useState(false)
  if (!session?.data?.user) return null
  const user = session.data.user
  if (!user.username) return null


  return (
    <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="rounded-full h-14 w-14 p-0 text-xl bg-gray-800/80"
            aria-label="Create post"
          >
            +
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create a post</DialogTitle>
          </DialogHeader>
          <PostComposer username={user.username}/>
        </DialogContent>
      </Dialog>
    </div>
  )
}
