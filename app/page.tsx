'use client';

import { useSession } from 'next-auth/react';
import UsersList from './components/users-list';
import { UserDialog } from './components/user-dialog';
import SearchInput from './components/search-input-cmd';
import { TechnicalOverview } from './components/technical-overview';

export default function Home() {
  const { data: session } = useSession();

  // Authenticated view - show users table
  if (session?.user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Search User</h1>
          <UserDialog />
        </div>
        <UsersList />
      </div>
    );
  }

  // Unauthenticated view - show search interface with how it works
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">User Search</h1>

      <div className="flex gap-8">
        <div className="flex-shrink-0">
          <UserDialog />
        </div>

        <div className="flex-1">
          <div className="mb-8">
            <SearchInput />
          </div>

          <TechnicalOverview />
        </div>
      </div>
    </div>
  );
}
