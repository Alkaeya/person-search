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
      return { success: false, error: "Email already in use" }
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
      },
    })

    return { success: true, user }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign up failed"
    return { success: false, error: message }
  }
}

export async function signInUser(data: SignInInput) {
  try {
    signInSchema.parse(data)

    const result = await nextAuthSignIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      return { success: false, error: "Invalid email or password" }
    }

    if (result?.ok) {
      return { success: true }
    }

    return { success: false, error: "Sign in failed" }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign in failed"
    return { success: false, error: message }
  }
}

export async function signOutUser() {
  try {
    await signOut({ redirect: false })
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign out failed"
    return { success: false, error: message }
  }
}

