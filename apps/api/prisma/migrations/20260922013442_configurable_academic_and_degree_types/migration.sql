-- Rename the existing PostgreSQL enums so their names can be reused
-- by the new configurable tables.
ALTER TYPE "AcademicUnitType" RENAME TO "AcademicUnitType_old";
ALTER TYPE "DegreeType" RENAME TO "DegreeType_old";

-- Create configurable academic unit types
CREATE TABLE "AcademicUnitType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicUnitType_pkey" PRIMARY KEY ("id")
);

-- Create configurable degree types
CREATE TABLE "DegreeType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DegreeType_pkey" PRIMARY KEY ("id")
);

-- Unique constraints
CREATE UNIQUE INDEX "AcademicUnitType_name_key"
ON "AcademicUnitType"("name");

CREATE UNIQUE INDEX "AcademicUnitType_code_key"
ON "AcademicUnitType"("code");

CREATE UNIQUE INDEX "DegreeType_name_key"
ON "DegreeType"("name");

CREATE UNIQUE INDEX "DegreeType_code_key"
ON "DegreeType"("code");

-- Seed the academic unit types represented by the old enum
INSERT INTO "AcademicUnitType"
    ("id", "name", "code", "description", "updatedAt")
VALUES
    (
        'aut_faculty',
        'Faculty',
        'FACULTY',
        'Faculty-level academic unit',
        CURRENT_TIMESTAMP
    ),
    (
        'aut_school',
        'School',
        'SCHOOL',
        'School-level academic unit',
        CURRENT_TIMESTAMP
    );

-- Seed the degree types represented by the old enum
INSERT INTO "DegreeType"
    ("id", "name", "code", "description", "updatedAt")
VALUES
    (
        'dt_bsc',
        'Bachelor of Science',
        'BSC',
        'Bachelor of Science',
        CURRENT_TIMESTAMP
    ),
    (
        'dt_ba',
        'Bachelor of Arts',
        'BA',
        'Bachelor of Arts',
        CURRENT_TIMESTAMP
    ),
    (
        'dt_beng',
        'Bachelor of Engineering',
        'BENG',
        'Bachelor of Engineering',
        CURRENT_TIMESTAMP
    ),
    (
        'dt_bed',
        'Bachelor of Education',
        'BED',
        'Bachelor of Education',
        CURRENT_TIMESTAMP
    ),
    (
        'dt_llb',
        'Bachelor of Laws',
        'LLB',
        'Bachelor of Laws',
        CURRENT_TIMESTAMP
    ),
    (
        'dt_mbbs',
        'Bachelor of Medicine and Bachelor of Surgery',
        'MBBS',
        'Bachelor of Medicine and Bachelor of Surgery',
        CURRENT_TIMESTAMP
    ),
    (
        'dt_hnd',
        'Higher National Diploma',
        'HND',
        'Higher National Diploma',
        CURRENT_TIMESTAMP
    ),
    (
        'dt_diploma',
        'Diploma',
        'DIPLOMA',
        'Diploma',
        CURRENT_TIMESTAMP
    ),
    (
        'dt_pgd',
        'Postgraduate Diploma',
        'PGD',
        'Postgraduate Diploma',
        CURRENT_TIMESTAMP
    ),
    (
        'dt_msc',
        'Master of Science',
        'MSC',
        'Master of Science',
        CURRENT_TIMESTAMP
    ),
    (
        'dt_ma',
        'Master of Arts',
        'MA',
        'Master of Arts',
        CURRENT_TIMESTAMP
    ),
    (
        'dt_meng',
        'Master of Engineering',
        'MENG',
        'Master of Engineering',
        CURRENT_TIMESTAMP
    ),
    (
        'dt_phd',
        'Doctor of Philosophy',
        'PHD',
        'Doctor of Philosophy',
        CURRENT_TIMESTAMP
    ),
    (
        'dt_certificate',
        'Certificate',
        'CERTIFICATE',
        'Certificate',
        CURRENT_TIMESTAMP
    ),
    (
        'dt_btech',
        'Bachelor of Technology',
        'BTECH',
        'Bachelor of Technology',
        CURRENT_TIMESTAMP
    ),
    (
        'dt_hpd',
        'HPD',
        'HPD',
        'HPD',
        CURRENT_TIMESTAMP
    );

-- Add the new foreign-key columns as nullable temporarily.
ALTER TABLE "AcademicUnit"
ADD COLUMN "typeId" TEXT;

ALTER TABLE "Programme"
ADD COLUMN "degreeId" TEXT;

-- Migrate existing AcademicUnit types.
UPDATE "AcademicUnit" au
SET "typeId" = aut."id"
FROM "AcademicUnitType" aut
WHERE aut."code" = au."type"::TEXT;

-- Migrate existing Programme degree types.
UPDATE "Programme" p
SET "degreeId" = dt."id"
FROM "DegreeType" dt
WHERE dt."code" = p."degree"::TEXT;

-- Verify that every existing row was migrated.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "AcademicUnit"
        WHERE "typeId" IS NULL
    ) THEN
        RAISE EXCEPTION
            'AcademicUnit migration failed: one or more rows have no typeId';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM "Programme"
        WHERE "degreeId" IS NULL
    ) THEN
        RAISE EXCEPTION
            'Programme migration failed: one or more rows have no degreeId';
    END IF;
END $$;

-- The new columns can now safely become required.
ALTER TABLE "AcademicUnit"
ALTER COLUMN "typeId" SET NOT NULL;

ALTER TABLE "Programme"
ALTER COLUMN "degreeId" SET NOT NULL;

-- Remove the old enum-backed columns.
ALTER TABLE "AcademicUnit"
DROP COLUMN "type";

ALTER TABLE "Programme"
DROP COLUMN "degree";

-- Remove the old PostgreSQL enum types.
DROP TYPE "AcademicUnitType_old";

DROP TYPE "DegreeType_old";

-- Add the new foreign keys.
ALTER TABLE "AcademicUnit"
ADD CONSTRAINT "AcademicUnit_typeId_fkey"
FOREIGN KEY ("typeId")
REFERENCES "AcademicUnitType"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "Programme"
ADD CONSTRAINT "Programme_degreeId_fkey"
FOREIGN KEY ("degreeId")
REFERENCES "DegreeType"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;