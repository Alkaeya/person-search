'use client';

import { useEffect, useState } from 'react';
import UserCard from './user-card';
import { getUserById } from '@/app/actions/actions';
import type { User } from '@/app/actions/schemas';

export default function UserCardClient({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (err) {
        console.error('Error loading user:', err);
        setError('Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  if (loading) {
    return <p>Loading user...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!user) {
    return <p className="text-sm text-gray-500">User not found</p>;
  }

  return <UserCard user={user} onUserUpdated={setUser} />;
}
