'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import UserSearch from './components/user-search'
import { TechnicalOverview } from './components/technical-overview'
import { UserDialog } from './components/user-dialog'
import { SignInDialog } from './components/signin-dialog'
import { SignUpDialog } from './components/signup-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function Home({ searchParams }: { searchParams: Promise<{ userId?: string }> }) {
  const { data: session } = useSession()
  const [signInOpen, setSignInOpen] = useState(false)
  const [signUpOpen, setSignUpOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Open sign-in dialog if user is not authenticated
    if (session === undefined || (mounted && !session?.user)) {
      // Only open if not already open and session is loaded
      if (mounted && session !== undefined && !session?.user) {
        setSignInOpen(true)
      }
    }
  }, [session, mounted])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Person CRUD App</h1>

      {mounted && !session?.user && (
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

      <UserSearch searchParams={searchParams} />
      <UserDialog />
      <TechnicalOverview />

      {mounted && (
        <>
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
      )}
    </div>
  )
}
