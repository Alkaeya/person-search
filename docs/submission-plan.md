# Person App Submission Plan

## Goal
Deliver one Vercel production URL that demonstrates full-stack CRUD with real database persistence.

## Implementation Checklist
- [x] Replace in-memory records with Prisma + PostgreSQL.
- [x] Keep CRUD inside Next.js server actions (no new API routes).
- [x] Add seed data and migration files for evaluator testing.
- [x] Provide in-app documentation routes: `/about`, `/github`, `/database`.
- [x] Ensure responsive UI works on desktop and mobile.

## Deployment Checklist
1. Set `DATABASE_URL` in Vercel project settings.
2. Set `NEXT_PUBLIC_GITHUB_REPO_URL` to your public repository URL.
3. Run migration and seed once against production database:
   - `pnpm prisma:deploy`
   - `pnpm prisma:seed`
4. Redeploy and verify all CRUD operations from the production site.
5. Submit one Vercel URL.
