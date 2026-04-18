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

    const redirectUrl = await nextAuthSignIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (typeof redirectUrl !== "string") {
      console.error("NextAuth sign-in returned an unexpected response")
      return { success: false, error: "Sign in failed" }
    }

    if (redirectUrl.includes("error=")) {
      return { success: false, error: "Invalid email or password" }
    }

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("CredentialsSignin")) {
        return { success: false, error: "Invalid email or password" }
      }

      if (error.message.includes("Invalid URL")) {
        return {
          success: false,
          error:
            "Authentication URL is invalid. Set AUTH_URL or NEXTAUTH_URL with http:// or https://.",
        }
      }
    }

    const message = error instanceof Error ? error.message : "Sign in failed"
    console.error("Sign in error:", error)
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

