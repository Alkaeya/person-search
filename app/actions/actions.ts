//app/actions/actions.ts

'use server'

import { revalidatePath } from 'next/cache'
import { User, userSchema } from './schemas'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'

export async function searchUsers(query: string): Promise<User[]> {
    const normalizedQuery = query.trim()
    if (!normalizedQuery) {
        return []
    }

    const results = await prisma.person.findMany({
        where: {
            name: {
                contains: normalizedQuery,
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
    const validatedInput = userSchema.omit({ id: true }).parse(data)

    const created = await prisma.person.create({
        data: validatedInput,
    })

    const validatedUser = userSchema.parse(created)
    revalidatePath('/')
    return validatedUser
}

export async function deleteUser(id: string): Promise<void> {
    const existing = await prisma.person.findUnique({ where: { id } })
    if (!existing) {
        throw new Error(`User with id ${id} not found`)
    }

    await prisma.person.delete({ where: { id } })
    revalidatePath('/') // Revalidate the page or component path

}

export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
    const existingUser = await prisma.person.findUnique({ where: { id } })
    if (!existingUser) {
        throw new Error(`User with id ${id} not found`)
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

    revalidatePath('/') // Revalidate the page or component path

    return validatedUser
}

export const getUserById = cache(async (id: string) => {
    const user = await prisma.person.findUnique({ where: { id } })
    return user || null
})
