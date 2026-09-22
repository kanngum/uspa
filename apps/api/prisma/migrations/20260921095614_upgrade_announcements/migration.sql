/*
  Upgrade Announcement records with article/news fields.

  Existing announcements are assigned slugs before the slug column
  becomes required and unique.
*/

-- Add the new fields except slug first.
ALTER TABLE "Announcement"
ADD COLUMN "applicationCycle" TEXT,
ADD COLUMN "applicationDeadline" TIMESTAMP(3),
ADD COLUMN "applicationStatus" TEXT,
ADD COLUMN "applicationUrl" TEXT,
ADD COLUMN "categoryId" TEXT,
ADD COLUMN "featuredImage" TEXT,
ADD COLUMN "lastVerified" TIMESTAMP(3),
ADD COLUMN "officialSourceUrl" TEXT,
ADD COLUMN "publishedAt" TIMESTAMP(3),
ADD COLUMN "slug" TEXT,
ADD COLUMN "source" TEXT,
ADD COLUMN "sourceDocument" TEXT,
ADD COLUMN "summary" TEXT;

-- Generate a readable slug for existing announcements.
UPDATE "Announcement"
SET "slug" =
  TRIM(
    BOTH '-' FROM
    REGEXP_REPLACE(
      LOWER("title"),
      '[^a-z0-9]+',
      '-',
      'g'
    )
  );

-- Make duplicate or empty slugs unique.
UPDATE "Announcement" a
SET "slug" = a."slug" || '-' || SUBSTRING(a."id", 1, 8)
WHERE a."slug" IS NULL
   OR a."slug" = ''
   OR EXISTS (
     SELECT 1
     FROM "Announcement" b
     WHERE b."slug" = a."slug"
       AND b."id" <> a."id"
   );

-- Make slug required after existing records have values.
ALTER TABLE "Announcement"
ALTER COLUMN "slug" SET NOT NULL;

-- Create announcement categories.
CREATE TABLE "AnnouncementCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnnouncementCategory_pkey" PRIMARY KEY ("id")
);

-- Category indexes.
CREATE UNIQUE INDEX "AnnouncementCategory_name_key"
ON "AnnouncementCategory"("name");

CREATE UNIQUE INDEX "AnnouncementCategory_slug_key"
ON "AnnouncementCategory"("slug");

-- Announcement indexes.
CREATE UNIQUE INDEX "Announcement_slug_key"
ON "Announcement"("slug");

CREATE INDEX "Announcement_published_publishedAt_idx"
ON "Announcement"("published", "publishedAt");

CREATE INDEX "Announcement_categoryId_idx"
ON "Announcement"("categoryId");

CREATE INDEX "Announcement_programmeId_idx"
ON "Announcement"("programmeId");

-- Category relationship.
ALTER TABLE "Announcement"
ADD CONSTRAINT "Announcement_categoryId_fkey"
FOREIGN KEY ("categoryId")
REFERENCES "AnnouncementCategory"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;