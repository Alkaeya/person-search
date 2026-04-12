-- CreateTable User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable Session
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for User email (unique)
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex for Session sessionToken (unique)
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- AddForeignKey for Session
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Alter Person table to add userId column (nullable first)
ALTER TABLE "Person" ADD COLUMN "userId" TEXT;

-- Create an admin user for existing data
INSERT INTO "User" ("id", "email", "password", "name", "createdAt", "updatedAt")
VALUES ('admin-user-' || gen_random_uuid()::text, 'admin@example.com', '$2a$10$YIjlrPnoJ8/LewY5Z9UUhe8L4G5s/yv5Mr4qLISHewonzU.H2PDOK', 'Admin User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Assign all existing persons to the admin user
UPDATE "Person" SET "userId" = (SELECT "id" FROM "User" WHERE "email" = 'admin@example.com' LIMIT 1)
WHERE "userId" IS NULL;

-- Make userId NOT NULL
ALTER TABLE "Person" ALTER COLUMN "userId" SET NOT NULL;

-- Drop existing unique constraint on email
DROP INDEX IF EXISTS "Person_email_key";

-- Add compound unique constraint on userId and email
ALTER TABLE "Person" ADD CONSTRAINT "Person_userId_email_key" UNIQUE ("userId", "email");

-- AddForeignKey for Person
ALTER TABLE "Person" ADD CONSTRAINT "Person_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
