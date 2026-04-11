// app/components/person-table.tsx
import { getAllUsers } from '@/app/actions/actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DeleteButton from './delete-button'
import { UserEditDialog } from './user-edit-dialog'

export default async function PersonTable() {
  const people = await getAllUsers()

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>All People ({people.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {people.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4 text-center">
            No people found. Use &ldquo;Add Person&rdquo; to create the first record.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {people.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">{person.name}</TableCell>
                    <TableCell>{person.email}</TableCell>
                    <TableCell>{person.phoneNumber}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <UserEditDialog user={person} />
                        <DeleteButton userId={person.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
