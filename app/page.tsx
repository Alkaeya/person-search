import { UserDialog } from './components/user-dialog';
import UserSearch from './components/user-search';

export default function Home() {
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-5xl font-bold mb-12">User Search</h1>

      <div className="flex gap-6 mb-8">
        <div className="flex-shrink-0 pt-1">
          <UserDialog />
        </div>
      </div>

      <UserSearch searchParams={searchParams} />
    </div>
  );
}
