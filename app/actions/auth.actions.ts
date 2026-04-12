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
  signInSchema.parse(data)
  // NextAuth signIn will redirect on success, throw on error
  return await nextAuthSignIn("credentials", {
    email: data.email,
    password: data.password,
    redirect: true,
    callbackUrl: "/",
  })
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
