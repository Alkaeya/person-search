import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

const repositoryUrl =
  process.env.NEXT_PUBLIC_GITHUB_REPO_URL ?? 'https://github.com/gocallum/person-search'

export default function GithubPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">GitHub Repository</h1>
      <Card>
        <CardHeader>
          <CardTitle>Source Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This project is fully open source. Use the link below to review the full implementation,
            including Prisma schema, migrations, and the complete CRUD workflow.
          </p>
          <Button asChild className="w-full sm:w-auto">
            <Link href={repositoryUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Open Public GitHub Repository
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Tip: Set <span className="font-mono">NEXT_PUBLIC_GITHUB_REPO_URL</span> in your environment
            to point this page to your actual repository.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
