'use client'

import { useTransition } from 'react'
import { Button } from "@/components/ui/button"
import { Trash } from 'lucide-react'
import { deleteUser } from '@/app/actions/actions'
import { toast } from "@/hooks/use-toast"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function DeleteButton({ userId }: { userId: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    try {
      await deleteUser(userId)

      const params = new URLSearchParams(searchParams.toString())
      const selectedUserId = params.get('userId')

      startTransition(() => {
        if (selectedUserId === String(userId)) {
          params.delete('userId')
          const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
          router.replace(nextUrl)
        }
        router.refresh()
      })

      toast({
        title: "User Deleted",
        description: `A user with the ID ${userId} has been deleted.`,
        variant: "default",
      })
    } catch (error) {
      console.error('DeleteButton: Error deleting user', error)
      toast({
        title: "Error",
        description: "An error occurred while deleting the user.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button onClick={handleDelete} variant="destructive" disabled={isPending}>
      <Trash className="w-4 h-4 mr-2" />
      {isPending ? 'Deleting...' : 'Delete'}
    </Button>
  )
}
