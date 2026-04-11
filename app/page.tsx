import UserSearch from './components/user-search';
import { TechnicalOverview } from './components/technical-overview';
import { UserDialog } from './components/user-dialog';
import PersonTable from './components/person-table';
import { Suspense } from 'react';

export default async function Home({ searchParams }: { searchParams: Promise<{ userId?: string }> }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Person CRUD App</h1>
        <UserDialog />
      </div>
      <UserSearch searchParams={searchParams} />
      <Suspense fallback={<p className="mt-8 text-muted-foreground">Loading people…</p>}>
        <PersonTable />
      </Suspense>
      <TechnicalOverview />
    </div>
  );
}
