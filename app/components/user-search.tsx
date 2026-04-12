import { Suspense } from 'react';
import SearchInput from './search-input-cmd';
import UserCard from './user-card';
import { getUserById } from '@/app/actions/actions';

export default async function UserSearch({ searchParams }: { searchParams: Promise<{ userId?: string }> }) {
  // Resolve the searchParams asynchronously
  const resolvedSearchParams = await searchParams;
  const selectedUserId = resolvedSearchParams?.userId || null;

  // Fetch the user based on the selectedUserId
  let user = null;
  try {
    user = selectedUserId ? await getUserById(selectedUserId) : null;
  } catch (error) {
    console.error('Error fetching user:', error);
    user = null;
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
}
