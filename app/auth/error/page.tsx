'use client'

import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    CredentialsSignin: 'Invalid email or password',
    Callback: 'Authentication callback failed',
    OAuthSignin: 'OAuth sign in failed',
    OAuthCallback: 'OAuth callback failed',
    EmailSignInError: 'Email sign in failed',
    default: 'Authentication error occurred',
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/10">
      <Card className="w-full max-w-md border-destructive">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>
            {error && error in errorMessages
              ? errorMessages[error as keyof typeof errorMessages]
              : errorMessages.default}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please try again or contact support if the problem persists.
          </p>

          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/auth/signin">Back to Sign In</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/">Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
