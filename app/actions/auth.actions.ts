"use server"

import { signIn, signOut } from "@/app/auth"
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

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name || null,
      },
    })

    // Sign in the user
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    })

    return { success: true, user }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign up failed"
    throw new Error(message)
  }
}

export async function signInUser(data: SignInInput) {
  try {
    const validatedData = signInSchema.parse(data)

    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    })

    if (result?.error) {
      throw new Error("Invalid email or password")
    }

    return { success: true }
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
