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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
  })

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true)
    try {
      await signUpUser(data)
      toast({
        title: 'Success',
        description: 'Account created and signed in successfully',
      })
      router.push('/')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Sign up to start managing your persons</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="you@example.com"
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
                        placeholder="Create a strong password"
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
                    <FormLabel>Confirm Password</FormLabel>
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
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
