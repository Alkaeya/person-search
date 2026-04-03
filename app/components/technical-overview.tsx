import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TechnicalOverview() {
  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle>How it works</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          The search functionality is implemented using Next.js server actions backed by Prisma ORM and a real PostgreSQL database. The command search input sends queries to a server action that filters persisted person records with a{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            contains
          </code>
          {" "}matching strategy. Create, edit, and delete actions mutate the database and trigger route revalidation so the UI stays in sync with stored records.
        </p>
      </CardContent>
    </Card>
  )
}

