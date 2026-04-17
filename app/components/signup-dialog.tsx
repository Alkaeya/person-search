'use client'

import { useState } from 'react'
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
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [accountExistsEmail, setAccountExistsEmail] = useState<string | null>(null)

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
      const result = await signUpUser(data)

      if (!result.success) {
        // Check if it's an email already in use error
        if (result.error?.includes('Email already in use')) {
          setAccountExistsEmail(form.getValues('email'))
          toast({
            title: 'Account Exists',
            description: 'This email already has an account. Please sign in instead.',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Sign up failed',
            variant: 'destructive',
          })
        }
        setIsLoading(false)
        return
      }

      // Show success and close signup modal
      toast({
        title: 'Success',
        description: 'Account created! Now please sign in with your credentials.',
      })
      form.reset()
      setAccountExistsEmail(null)
      onOpenChange(false)

      // Open signin modal after a brief delay so user can see the toast
      setTimeout(() => {
        onSignInClick()
      }, 500)
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

  const handleSignInWithExistingEmail = () => {
    onOpenChange(false)
    setTimeout(() => {
      onSignInClick()
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>
            {accountExistsEmail ? 'Account Already Exists' : 'Create your account'}
          </DialogTitle>
          <DialogDescription>
            {accountExistsEmail
              ? `The email ${accountExistsEmail} is already registered. Please sign in to your existing account.`
              : 'Welcome! Please fill in the details to get started.'}
          </DialogDescription>
        </DialogHeader>

        {accountExistsEmail ? (
          <div className="space-y-4">
            <Button onClick={handleSignInWithExistingEmail} className="w-full">
              Sign In to Existing Account
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setAccountExistsEmail(null)
                form.reset()
              }}
              className="w-full"
            >
              Create New Account with Different Email
            </Button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

