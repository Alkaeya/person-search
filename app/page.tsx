import UserSearch from './components/user-search'
import { TechnicalOverview } from './components/technical-overview'
import { UserDialog } from './components/user-dialog'
import { AuthGuard } from './components/auth-guard'

export default async function Home({ searchParams }: { searchParams: Promise<{ userId?: string }> }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Person CRUD App</h1>
      <AuthGuard />
      <UserSearch searchParams={searchParams} />
      <UserDialog />
      <TechnicalOverview />
    </div>
  )
}
