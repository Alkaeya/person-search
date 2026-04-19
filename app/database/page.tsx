import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const prismaSchema = `model Person {
  id          Int      @id @default(autoincrement())
  name        String
  email       String
  phoneNumber String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, email])
}`

export default function DatabasePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Database Structure</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Prisma Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              The app uses Prisma ORM with a PostgreSQL datasource configured through
              <span className="font-mono"> DATABASE_URL</span>.
            </p>
            <p>
              Database changes are managed through versioned SQL migrations in the
              <span className="font-mono"> prisma/migrations</span> directory.
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary">Prisma ORM</Badge>
              <Badge variant="secondary">PostgreSQL</Badge>
              <Badge variant="secondary">Server Actions</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CRUD Mapping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Create: <span className="font-mono">addUser</span> inserts Person rows.</p>
            <p>Read: <span className="font-mono">searchUsers</span> and <span className="font-mono">getUserById</span> query records.</p>
            <p>Update: <span className="font-mono">updateUser</span> updates existing Person rows.</p>
            <p>Delete: <span className="font-mono">deleteUser</span> removes rows by ID.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Prisma Schema</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
            <code>{prismaSchema}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
