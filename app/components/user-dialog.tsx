// app/components/user-dialog.tsx
'use client'

import { useState } from 'react'
import { addUserSafe } from '@/app/actions/actions'
import { userFormSchema, User, UserFormData } from '@/app/actions/schemas'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { UserForm } from './user-form'
import { Button } from '@/components/ui/button'
import { SignInDialog } from './signin-dialog'
import { SignUpDialog } from './signup-dialog'
import MutableDialog, { ActionState } from '@/components/mutable-dialog'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function UserDialog() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [signInOpen, setSignInOpen] = useState(false)
  const [signUpOpen, setSignUpOpen] = useState(false)

  const handleAddUser = async (data: UserFormData): Promise<ActionState<User>> => {
    const result = await addUserSafe(data)

    if (result.success) {
      const params = new URLSearchParams(searchParams.toString())
      if (params.has('userId')) {
        params.delete('userId')
        const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
        router.replace(nextUrl)
      }
    }

    return {
      success: result.success,
      message: result.message,
      data: result.data,
    }
  }

  const handleAddButtonClick = () => {
    if (!session?.user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add users.',
        variant: 'destructive',
      })
      setSignInOpen(true)
      return
    }
  }

  // Show button with click handler if user is not logged in
  if (!session?.user) {
    return (
      <>
        <div className="mt-6">
          <Button onClick={handleAddButtonClick}>Add User</Button>
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

  return (
    <MutableDialog<UserFormData>
      formSchema={userFormSchema}
      FormComponent={UserForm}
      action={handleAddUser}
      triggerButtonLabel="Add User"
      addDialogTitle="Add New User"
      dialogDescription="Fill out the form below to add a new user."
      submitButtonLabel="Save"
      defaultValues={{ name: '', email: '', phoneNumber: '' }}
    />
  )
}