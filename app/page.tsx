import { UserDialog } from './components/user-dialog';
import SearchInput from './components/search-input';
import UserCardClient from './components/user-card-client';
import { TechnicalOverview } from './components/technical-overview';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const rawUserId = resolvedSearchParams?.userId;
  const parsedUserId = rawUserId ? Number(rawUserId) : null;
  const selectedUserId = Number.isInteger(parsedUserId) && parsedUserId !== null ? parsedUserId : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-5xl font-bold mb-12">User Search</h1>

      <div className="flex gap-6 mb-8 items-start">
        <div className="flex-shrink-0 mt-6">
          <UserDialog />
        </div>

        <div className="flex-1">
          <SearchInput />
        </div>
      </div>

      {selectedUserId && (
        <div className="mb-8">
          <UserCardClient userId={selectedUserId} />
        </div>
      )}

      <div className="mt-8">
        <TechnicalOverview />
      </div>
    </div>
  );
}
