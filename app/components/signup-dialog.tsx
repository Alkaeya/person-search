'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, type SignUpInput } from '@/app/actions/auth.schemas'
import { signUpUser } from '@/app/actions/auth.actions'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

interface SignUpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSignInClick: () => void
}

export function SignUpDialog({ open, onOpenChange, onSignInClick }: SignUpDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true)
    try {
      // Create the user
      await signUpUser(data)

      toast({
        title: 'Success',
        description: 'Account created! Redirecting to sign in...',
      })

      form.reset()
      onOpenChange(false)

      // Redirect to the auth signin page which will handle the actual auth
      setTimeout(() => {
        router.push(`/auth/signin?email=${encodeURIComponent(data.email)}`)
      }, 1000)
    } catch (error) {
      setIsLoading(false)
      const message = error instanceof Error ? error.message : 'Sign up failed'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Create your account</DialogTitle>
          <DialogDescription>Welcome! Please fill in the details to get started.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter your email address"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Create a password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Confirm your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Continue'}
            </Button>
          </form>
        </Form>

        <div className="space-y-3 pt-2 text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={() => {
                onOpenChange(false)
                onSignInClick()
              }}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
