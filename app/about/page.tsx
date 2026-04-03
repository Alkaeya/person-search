import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Github, Layers } from 'lucide-react'

function ArchitectureOverview() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Architecture Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Person Search is a full-stack Next.js 16 application that manages persisted person records
          with complete Create, Read, Update, and Delete workflows.
        </p>
        <p className="mb-4">
          The UI is built with React 19, TypeScript, Tailwind CSS, and shadcn/ui components,
          while server actions coordinate data mutations and retrieval.
        </p>
        <p>
          Prisma ORM provides the data-access layer to a PostgreSQL database with migration support,
          ensuring reliable schema evolution and production-ready persistence.
        </p>
      </CardContent>
    </Card>
  )
}

function StackSummary() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Technology Stack</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="flex items-center gap-2"><Layers className="h-4 w-4" /> Next.js 16 + React 19 + TypeScript</p>
        <p className="flex items-center gap-2"><Database className="h-4 w-4" /> Prisma ORM + PostgreSQL</p>
        <p className="flex items-center gap-2"><Github className="h-4 w-4" /> Source code linked in the app via the GitHub page</p>
      </CardContent>
    </Card>
  )
}

function DocumentationLinks() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Documentation Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          This app includes dedicated documentation routes required for evaluation.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/github">Open /github</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/database">Open /database</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">About This Person App</h1>
        <ArchitectureOverview />
        <StackSummary />
        <DocumentationLinks />
        <Button asChild variant="link" className="mt-4">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
      </main>
    </div>
  )
}

