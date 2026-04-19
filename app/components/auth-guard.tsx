'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { SignInDialog } from './signin-dialog'
import { SignUpDialog } from './signup-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export function AuthGuard() {
  const { data: session, status } = useSession()
  const [signInOpen, setSignInOpen] = useState(false)
  const [signUpOpen, setSignUpOpen] = useState(false)
  const [prefilledEmail, setPrefilledEmail] = useState('')

  if (status === 'loading') {
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
              <button
                onClick={() => setSignInOpen(true)}
                className="ml-1 font-medium underline"
              >
                Sign in now
              </button>
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
        prefilledEmail={prefilledEmail}
      />

      <SignUpDialog
        open={signUpOpen}
        onOpenChange={setSignUpOpen}
        onSignInClick={(email: string) => {
          setPrefilledEmail(email)
          setSignUpOpen(false)
          setSignInOpen(true)
        }}
      />
    </>
  )
}
