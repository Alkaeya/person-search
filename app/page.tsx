import UsersList from './components/users-list'
import { UserDialog } from './components/user-dialog'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Search User</h1>
        <UserDialog />
      </div>
      <UsersList />
    </div>
  )
}
