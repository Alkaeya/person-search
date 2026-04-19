'use client'

import { useState, useEffect } from 'react'
import { getUserById } from '@/app/actions/actions'
import { User } from '@/app/actions/schemas'

export function useUser(userId: number | null) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!userId) {
      queueMicrotask(() => setUser(null))
      return
    }

    if (userId) {
      getUserById(userId).then(fetchedUser => {
        if (fetchedUser) {
          setUser(fetchedUser)
        } else {
          setUser(null)
        }
      })
    }
  }, [userId])

  const mutate = () => {
    if (userId) {
      getUserById(userId).then(fetchedUser => {
        if (fetchedUser) {
          setUser(fetchedUser)
        } else {
          setUser(null)
        }
      })
    }
  }

  return { user, mutate }
}

