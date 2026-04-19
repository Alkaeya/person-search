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
2. Set `AUTH_URL` to your production domain (example: `https://person-search-gules.vercel.app`).
3. Set `AUTH_SECRET` (or `NEXTAUTH_SECRET`) in Vercel project settings.
4. Set `NEXT_PUBLIC_GITHUB_REPO_URL` to your public repository URL.
5. Run migration and seed once against production database:
   - `pnpm prisma:deploy`
   - `pnpm prisma:seed`
6. Redeploy and verify sign-in plus all CRUD operations from the production site.
7. Submit one Vercel URL.

## Latest Production Fixes
- [x] Fixed Auth.js invalid URL sign-in failures by aligning auth env vars (`AUTH_URL` + `AUTH_SECRET`) and upgrading auth runtime dependencies.
- [x] Deployed safe add-user server-action error handling so production surfaces friendly messages instead of generic server component render errors.
- [x] Improved add-user error mapping for Zod and Prisma typed errors so invalid fields and duplicate emails return actionable toasts.
- [x] Switched navbar sign-in/sign-out to NextAuth client methods (`signIn` and `signOut` with `redirect: false`) for immediate client session propagation.
- [x] Hydrated `SessionProvider` with server `auth()` session in root layout to reduce stale auth state after credential login.
- [x] Added explicit client `getSession()` refresh after auth actions before route refresh/navigation.
