'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { SignInDialog } from './signin-dialog'
import { SignUpDialog } from './signup-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export function AuthGuard() {
  const { data: session } = useSession()
  const [signInOpen, setSignInOpen] = useState(false)
  const [signUpOpen, setSignUpOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Open sign-in dialog if user is not authenticated
    if (mounted && session !== undefined && !session?.user) {
      setSignInOpen(true)
    }
  }, [session, mounted])

  if (!mounted) {
    return null
  }

  return (
    <>
      {!session?.user && (
        <div className="mb-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Sign in required</AlertTitle>
            <AlertDescription>
              Please sign in or sign up to add users.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <SignInDialog
        open={signInOpen}
        onOpenChange={setSignInOpen}
        onSignUpClick={() => {
          setSignInOpen(false)
          setSignUpOpen(true)
        }}
      />

      <SignUpDialog
        open={signUpOpen}
        onOpenChange={setSignUpOpen}
        onSignInClick={() => {
          setSignUpOpen(false)
          setSignInOpen(true)
        }}
      />
    </>
  )
}
