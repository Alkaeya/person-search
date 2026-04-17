"use server"

import { signIn as nextAuthSignIn, signOut } from "@/app/auth"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { signUpSchema, signInSchema } from "./auth.schemas"
import type { SignUpInput, SignInInput } from "./auth.schemas"

export async function signUpUser(data: SignUpInput) {
  try {
    const validatedData = signUpSchema.parse(data)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      throw new Error("Email already in use")
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 10)

    // Create user (without name)
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
      },
    })

    return { success: true, user }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign up failed"
    throw new Error(message)
  }
}

export async function signInUser(data: SignInInput) {
  try {
    signInSchema.parse(data)
    // Use redirect: false to handle errors in the dialog
    const result = await nextAuthSignIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      throw new Error("Invalid email or password")
    }

    if (result?.ok) {
      // Redirect on success
      return { success: true }
    }

    throw new Error("Sign in failed")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign in failed"
    throw new Error(message)
  }
}

export async function signOutUser() {
  try {
    await signOut({ redirect: false })
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign out failed"
    throw new Error(message)
  }
}
