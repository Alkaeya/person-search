// app/components/user-dialog.tsx
'use client'

import { addUser } from '@/app/actions/actions'
import { userFormSchema, User, UserFormData } from '@/app/actions/schemas'
import { useSession } from 'next-auth/react'
import { UserForm } from './user-form'
import MutableDialog, { ActionState } from '@/components/mutable-dialog'

export function UserDialog() {
  const { data: session } = useSession()

  const handleAddUser = async (data: UserFormData): Promise<ActionState<User>> => {
    try {
      const newUser = await addUser(data)
      return {
        success: true,
        message: `User ${newUser.name} added successfully`,
        data: newUser
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add user ' + (error instanceof Error ? error.message : 'Unknown error')
      }
    }
  }

  // Only show the dialog if user is logged in
  if (!session?.user) {
    return null
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
      defaultValues={{ name: '', email: '', phoneNumber: '' }} // Default empty values
    />
  )
}