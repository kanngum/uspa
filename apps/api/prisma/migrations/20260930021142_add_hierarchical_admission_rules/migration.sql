-- CreateTable
CREATE TABLE "UniversityAdmissionRule" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "category" "AdmissionRuleCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subjectId" TEXT,
    "minimumGrade" TEXT,
    "minimumCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniversityAdmissionRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicUnitAdmissionRule" (
    "id" TEXT NOT NULL,
    "academicUnitId" TEXT NOT NULL,
    "category" "AdmissionRuleCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subjectId" TEXT,
    "minimumGrade" TEXT,
    "minimumCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicUnitAdmissionRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentAdmissionRule" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "category" "AdmissionRuleCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subjectId" TEXT,
    "minimumGrade" TEXT,
    "minimumCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepartmentAdmissionRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UniversityAdmissionRule_universityId_idx" ON "UniversityAdmissionRule"("universityId");

-- CreateIndex
CREATE INDEX "UniversityAdmissionRule_subjectId_idx" ON "UniversityAdmissionRule"("subjectId");

-- CreateIndex
CREATE INDEX "AcademicUnitAdmissionRule_academicUnitId_idx" ON "AcademicUnitAdmissionRule"("academicUnitId");

-- CreateIndex
CREATE INDEX "AcademicUnitAdmissionRule_subjectId_idx" ON "AcademicUnitAdmissionRule"("subjectId");

-- CreateIndex
CREATE INDEX "DepartmentAdmissionRule_departmentId_idx" ON "DepartmentAdmissionRule"("departmentId");

-- CreateIndex
CREATE INDEX "DepartmentAdmissionRule_subjectId_idx" ON "DepartmentAdmissionRule"("subjectId");

-- AddForeignKey
ALTER TABLE "UniversityAdmissionRule" ADD CONSTRAINT "UniversityAdmissionRule_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityAdmissionRule" ADD CONSTRAINT "UniversityAdmissionRule_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicUnitAdmissionRule" ADD CONSTRAINT "AcademicUnitAdmissionRule_academicUnitId_fkey" FOREIGN KEY ("academicUnitId") REFERENCES "AcademicUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicUnitAdmissionRule" ADD CONSTRAINT "AcademicUnitAdmissionRule_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentAdmissionRule" ADD CONSTRAINT "DepartmentAdmissionRule_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentAdmissionRule" ADD CONSTRAINT "DepartmentAdmissionRule_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
