'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function BackToSearchButton() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleBackToSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('userId')
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(nextUrl)
  }

  return (
    <div className="mt-4 flex justify-center">
      <Button variant="outline" onClick={handleBackToSearch}>
        Back to Search
      </Button>
    </div>
  )
}