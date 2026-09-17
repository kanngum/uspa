CREATE TYPE "FeePeriod" AS ENUM ('ANNUAL', 'PROGRAMME_TOTAL', 'FIRST_YEAR', 'UNKNOWN');
CREATE TYPE "AdmissionRuleCategory" AS ENUM ('O_LEVEL', 'A_LEVEL', 'QUALIFICATION', 'ENTRANCE_EXAM', 'EQUIVALENCY');

ALTER TABLE "Programme"
  ADD COLUMN "applicationCycle" TEXT,
  ADD COLUMN "sourceDocument" TEXT,
  ADD COLUMN "sourceImportedAt" TIMESTAMP(3),
  ADD COLUMN "needsReview" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "reviewNotes" TEXT;

ALTER TABLE "Tuition"
  ADD COLUMN "feePeriod" "FeePeriod" NOT NULL DEFAULT 'UNKNOWN';

CREATE TABLE "ProgrammeAdmissionRule" (
  "id" TEXT NOT NULL,
  "programmeId" TEXT NOT NULL,
  "category" "AdmissionRuleCategory" NOT NULL,
  "text" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProgrammeAdmissionRule_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProgrammeAdmissionRule_programmeId_category_text_key"
  ON "ProgrammeAdmissionRule"("programmeId", "category", "text");

ALTER TABLE "ProgrammeAdmissionRule"
  ADD CONSTRAINT "ProgrammeAdmissionRule_programmeId_fkey"
  FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;
