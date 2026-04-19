//app/actions/actions.ts

'use server'

import { revalidatePath } from 'next/cache'
import { User, userSchema } from './schemas'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/auth'
import { ZodError } from 'zod'

export async function getCurrentUser() {
    const session = await auth()
    if (!session?.user?.id) {
        return null
    }

    return await prisma.user.findUnique({
        where: { id: session.user.id },
    })
}

export async function searchUsers(query: string): Promise<User[]> {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        return []
    }

    const normalizedQuery = query.trim()
    if (!normalizedQuery) {
        return []
    }

    const results = await prisma.person.findMany({
        where: {
            userId: currentUser.id,
            name: {
                contains: normalizedQuery,
                mode: 'insensitive',
            },
        },
        orderBy: {
            name: 'asc',
        },
        take: 10,
    })

    return results.map((user) => userSchema.parse(user))
}

export async function addUser(data: Omit<User, 'id'>): Promise<User> {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        throw new Error('Unauthorized: Please sign in first')
    }

    const validatedInput = userSchema.omit({ id: true }).parse(data)

    const created = await prisma.person.create({
        data: {
            ...validatedInput,
            userId: currentUser.id,
        },
    })

    const validatedUser = userSchema.parse(created)
    revalidatePath('/')
    return validatedUser
}

export async function addUserSafe(
    data: Omit<User, 'id'>
): Promise<{ success: boolean; message: string; data?: User }> {
    try {
        const newUser = await addUser(data)
        return {
            success: true,
            message: `User ${newUser.name} added successfully`,
            data: newUser,
        }
    } catch (error) {
        console.error('[addUserSafe] Error details:', {
            errorType: error instanceof Error ? error.constructor.name : typeof error,
            message: error instanceof Error ? error.message : String(error),
            fullError: error,
        })

        if (error instanceof ZodError) {
            const firstIssue = error.issues[0]?.message
            return {
                success: false,
                message: firstIssue || 'Please check the form fields and try again.',
            }
        }

        const prismaErrorCode =
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            typeof (error as { code?: unknown }).code === 'string'
                ? (error as { code: string }).code
                : null

        if (prismaErrorCode === 'P2002') {
            return {
                success: false,
                message: 'This email already exists in your list.',
            }
        }

        if (prismaErrorCode === 'P2003') {
            return {
                success: false,
                message: 'Your session is out of sync. Please sign in again.',
            }
        }

        if (prismaErrorCode === 'P2025') {
            return {
                success: false,
                message: 'Could not save this user. Please refresh and try again.',
            }
        }

        if (
            typeof error === 'object' &&
            error !== null &&
            'name' in error &&
            (error as { name?: string }).name === 'PrismaClientValidationError'
        ) {
            return {
                success: false,
                message: 'Please check the form fields and try again.',
            }
        }

        const message =
            error instanceof Error ? error.message.toLowerCase() : ''

        if (message.includes('unique constraint')) {
            return {
                success: false,
                message: 'This email already exists in your list.',
            }
        }

        if (message.includes('unauthorized')) {
            return {
                success: false,
                message: 'Please sign in to add users.',
            }
        }

        if (message.includes('invalid email') || message.includes('phone number')) {
            return {
                success: false,
                message: 'Please check the form fields and try again.',
            }
        }

        return {
            success: false,
            message: 'Failed to add user. Please try again.',
        }
    }
}

export async function deleteUser(id: string): Promise<void> {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        throw new Error('Unauthorized: Please sign in first')
    }

    const existing = await prisma.person.findUnique({ where: { id } })

    if (!existing) {
        throw new Error(`Person with id ${id} not found`)
    }

    if (existing.userId !== currentUser.id) {
        throw new Error('Unauthorized: You do not own this person record')
    }

    await prisma.person.delete({ where: { id } })
    revalidatePath('/')
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        throw new Error('Unauthorized: Please sign in first')
    }

    const existingUser = await prisma.person.findUnique({ where: { id } })

    if (!existingUser) {
        throw new Error(`Person with id ${id} not found`)
    }

    if (existingUser.userId !== currentUser.id) {
        throw new Error('Unauthorized: You do not own this person record')
    }

    const updatedUser = userSchema.parse({ ...existingUser, ...data })

    const persisted = await prisma.person.update({
        where: { id },
        data: {
            name: updatedUser.name,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
        },
    })

    const validatedUser = userSchema.parse(persisted)
    revalidatePath('/')

    return validatedUser
}

export const getUserById = cache(async (id: string) => {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        return null
    }

    const user = await prisma.person.findUnique({
        where: { id },
    })

    if (user && user.userId !== currentUser.id) {
        return null
    }

    return user || null
})
