import { redirect } from 'next/navigation'
import { auth } from '@/app/auth'
import UsersList from '../components/users-list'

export default async function DirectoryPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <UsersList />
    </div>
  )
}
