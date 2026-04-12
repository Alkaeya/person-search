'use client';

import { useSession } from 'next-auth/react';
import UsersList from './components/users-list';
import { UserDialog } from './components/user-dialog';
import SearchInput from './components/search-input-cmd';
import { TechnicalOverview } from './components/technical-overview';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-5xl font-bold mb-12">User Search</h1>

      <div className="flex gap-6 mb-8">
        <div className="flex-shrink-0 pt-1">
          <UserDialog />
        </div>

        <div className="flex-1">
          <SearchInput />
        </div>
      </div>

      {/* Show users table only when authenticated */}
      {session?.user && (
        <div className="mb-12">
          <UsersList />
        </div>
      )}

      {/* Show how it works section */}
      <TechnicalOverview />
    </div>
  );
}
