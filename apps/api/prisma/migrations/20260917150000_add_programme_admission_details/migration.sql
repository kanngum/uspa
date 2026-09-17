ALTER TABLE "Programme"
  ADD COLUMN "awardType" TEXT,
  ADD COLUMN "entryRequirements" TEXT,
  ADD COLUMN "applicationDeadline" TIMESTAMP(3),
  ADD COLUMN "applicationStatus" TEXT;
