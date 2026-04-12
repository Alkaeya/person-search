import { Suspense } from 'react';
import SearchInput from './search-input-cmd';
import UserCard from './user-card';
import { getUserById } from '@/app/actions/actions';

export default async function UserSearch({ searchParams }: { searchParams: Promise<{ userId?: string }> }) {
  try {
    // Resolve the searchParams asynchronously
    const resolvedSearchParams = await searchParams;
    const selectedUserId = resolvedSearchParams?.userId || null;

    // Fetch the user based on the selectedUserId
    let user = null;
    if (selectedUserId) {
      try {
        user = await getUserById(selectedUserId);
      } catch (error) {
        console.error('Error fetching user:', error);
        user = null;
      }
    }

    return (
      <div className="space-y-6">
        <SearchInput />
        {selectedUserId && (
          <Suspense fallback={<p>Loading user...</p>}>
            {user ? <UserCard user={user} /> : null}
          </Suspense>
        )}
      </div>
    );
  } catch (error) {
    console.error('UserSearch error:', error);
    // Return minimal UI instead of crashing
    return (
      <div className="space-y-6">
        <SearchInput />
        <p className="text-sm text-gray-500">Unable to load selected user.</p>
      </div>
    );
  }
}
