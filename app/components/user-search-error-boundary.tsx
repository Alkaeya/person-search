'use client'

import { useEffect } from 'react'

export function UserSearchErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('UserSearch error:', error)
  }, [error])

  return (
    <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Unable to load search</h2>
      <p className="text-sm mb-4">
        An error occurred while loading the search. This is usually temporary.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-destructive text-white rounded hover:bg-destructive/90"
      >
        Try again
      </button>
    </div>
  )
}
