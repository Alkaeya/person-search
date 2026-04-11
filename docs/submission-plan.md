# Person App Submission Plan

## Goal
Deliver one Vercel production URL that demonstrates full-stack CRUD with real database persistence.

## Implementation Checklist
- [x] Replace in-memory records with Prisma + PostgreSQL.
- [x] Keep CRUD inside Next.js server actions (no new API routes).
- [x] Add seed data and migration files for evaluator testing.
- [x] Provide in-app documentation routes: `/about`, `/github`, `/database`.
- [x] Ensure responsive UI works on desktop and mobile.
- [x] Add `getAllUsers` server action to list all records.
- [x] Add `PersonTable` component on the home page showing all people with inline edit/delete.
- [x] Switch fonts from `next/font/google` to the `geist` npm package (eliminates build-time network dependency).
- [x] Remove unused `app/api/people/route.ts` (server actions used throughout instead).
- [x] Simplify `next.config.ts` – remove unused `path`/webpack alias that caused Turbopack NFT warning.

## Deployment Checklist
1. Set `DATABASE_URL` in Vercel project settings.
2. Set `NEXT_PUBLIC_GITHUB_REPO_URL` to your public repository URL.
3. Run migration and seed once against production database:
   - `pnpm prisma:deploy`
   - `pnpm prisma:seed`
4. Redeploy and verify all CRUD operations from the production site.
5. Submit one Vercel URL.

