'use client'

import { useState } from "react"
import * as React from "react"
import { SearchCommand } from "@/components/search-command"
import { searchUsers } from '@/app/actions/actions'
import { User } from "../actions/schemas"
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { SignInDialog } from './signin-dialog'
import { SignUpDialog } from './signup-dialog'


export default function SearchInput() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [signInOpen, setSignInOpen] = useState(false)
  const [signUpOpen, setSignUpOpen] = useState(false)

  const handleSearch = React.useCallback(async (value: string) => {
    if (!session?.user) {
      return []
    }
    return searchUsers(value)
  }, [session?.user])

  const handleFocus = React.useCallback(() => {
    if (!session?.user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to search users.',
        variant: 'destructive',
      })
      setSignInOpen(true)
    }
  }, [session?.user, toast])

  const handleSelect = React.useCallback((user: User) => {
    // Update URL
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('userId', String(user.id))
      window.history.pushState({}, '', url.toString())
      window.location.reload()
    } catch {
      // If URL construction fails, just reload the page
      window.location.reload()
    }
  }, [])

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <SearchCommand<User>
          onSearch={handleSearch}
          onItemSelect={handleSelect}
          getItemId={(user) => String(user.id)}
          getItemLabel={(user) => user.name}
          placeholder="Search users..."
          noResultsText="No users found."
          onFocus={handleFocus}
        />
      </div>

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

