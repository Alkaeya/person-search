import SearchInput from './search-input-cmd';
import UserCardClient from './user-card-client';

export default async function UserSearch({ searchParams }: { searchParams: Promise<{ userId?: string }> }) {
  // Resolve searchParams but DON'T fetch the user on the server
  // Let the client component handle fetching to avoid server errors
  const resolvedSearchParams = await searchParams;
  const rawUserId = resolvedSearchParams?.userId;
  const parsedUserId = rawUserId ? Number(rawUserId) : null;
  const selectedUserId = Number.isInteger(parsedUserId) && parsedUserId !== null ? parsedUserId : null;

  return (
    <div className="space-y-6">
      <SearchInput />
      {selectedUserId && <UserCardClient userId={selectedUserId} />}
    </div>
  );
}
