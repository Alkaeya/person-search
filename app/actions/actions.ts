//app/actions/actions.ts

'use server'

import { revalidatePath } from 'next/cache'
import { User, userSchema } from './schemas'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/auth'

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

export async function deleteUser(id: string): Promise<void> {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        throw new Error('Unauthorized: Please sign in first')
    }

    const personId = parseInt(id, 10)
    const existing = await prisma.person.findUnique({ where: { id: personId } })

    if (!existing) {
        throw new Error(`Person with id ${id} not found`)
    }

    if (existing.userId !== currentUser.id) {
        throw new Error('Unauthorized: You do not own this person record')
    }

    await prisma.person.delete({ where: { id: personId } })
    revalidatePath('/')
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        throw new Error('Unauthorized: Please sign in first')
    }

    const personId = parseInt(id, 10)
    const existingUser = await prisma.person.findUnique({ where: { id: personId } })

    if (!existingUser) {
        throw new Error(`Person with id ${id} not found`)
    }

    if (existingUser.userId !== currentUser.id) {
        throw new Error('Unauthorized: You do not own this person record')
    }

    const updatedUser = userSchema.parse({ ...existingUser, ...data })

    const persisted = await prisma.person.update({
        where: { id: personId },
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

    const personId = parseInt(id, 10)
    const user = await prisma.person.findUnique({
        where: { id: personId },
    })

    if (user && user.userId !== currentUser.id) {
        return null
    }

    return user || null
})
