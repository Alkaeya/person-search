-- Convert Person.id from TEXT to INT autoincrement while preserving existing rows.
-- Existing IDs are remapped to sequential integers.

CREATE SEQUENCE IF NOT EXISTS "Person_id_seq";

ALTER TABLE "Person" ADD COLUMN "id_new" INTEGER;

UPDATE "Person"
SET "id_new" = nextval('"Person_id_seq"')
WHERE "id_new" IS NULL;

ALTER TABLE "Person" ALTER COLUMN "id_new" SET NOT NULL;

SELECT setval('"Person_id_seq"', COALESCE((SELECT MAX("id_new") FROM "Person"), 0));

ALTER TABLE "Person" DROP CONSTRAINT IF EXISTS "Person_pkey";
ALTER TABLE "Person" DROP COLUMN "id";
ALTER TABLE "Person" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "Person" ADD CONSTRAINT "Person_pkey" PRIMARY KEY ("id");

ALTER TABLE "Person" ALTER COLUMN "id" SET DEFAULT nextval('"Person_id_seq"');
ALTER SEQUENCE "Person_id_seq" OWNED BY "Person"."id";
