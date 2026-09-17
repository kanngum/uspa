import type {
  DegreeLevel,
  EligibilityFlowBranch,
  EligibilityStatus,
  EligibilityStep,
  PreviousDegreeInput,
  StudentType,
  SubjectGradeEntry,
} from "@/app/lib/types/eligibility";

export const MIN_O_LEVEL_SUBJECTS = 4;
export const MIN_A_LEVEL_SUBJECTS = 2;
export const MAX_O_LEVEL_SUBJECTS = 12;
export const MAX_A_LEVEL_SUBJECTS = 6;

export const EMPTY_PREVIOUS_DEGREE: PreviousDegreeInput = {
  degreeName: "",
  institution: "",
  graduationYear: "",
  classification: "",
  degreeLabel: "",
  previousProgrammeId: "",
};

let subjectRowId = 0;

export function createSubjectRow(): SubjectGradeEntry {
  subjectRowId += 1;
  return { id: `subject-row-${subjectRowId}`, subject: "", grade: "" };
}

export function createSubjectRows(count = 1): SubjectGradeEntry[] {
  return Array.from({ length: count }, createSubjectRow);
}

export function getCompleteSubjectCount(entries: SubjectGradeEntry[]): number {
  return entries.filter((entry) => entry.subject.trim() && entry.grade.trim()).length;
}

export function getDuplicateSubjects(entries: SubjectGradeEntry[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  entries.forEach((entry) => {
    const subject = entry.subject.trim().toLowerCase();
    if (!subject) return;
    if (seen.has(subject)) duplicates.add(entry.subject.trim());
    seen.add(subject);
  });

  return Array.from(duplicates);
}

export function getEligibilityBranch(
  level: DegreeLevel,
  studentType: StudentType,
): EligibilityFlowBranch {
  if (level === "POSTGRADUATE" || level === "DOCTORATE") {
    return "previous-degree";
  }

  return studentType === "FRESHMAN" ? "freshman-subjects" : "unsupported-entry";
}

export function getInitialStep(branch: EligibilityFlowBranch): EligibilityStep {
  return branch === "previous-degree" ? "previous-degree" : "o-level";
}

export function getSubjectValidationMessage(
  level: "o" | "a",
  entries: SubjectGradeEntry[],
): string | null {
  const completeCount = getCompleteSubjectCount(entries);
  const duplicateSubjects = getDuplicateSubjects(entries);
  const minimum = level === "o" ? MIN_O_LEVEL_SUBJECTS : MIN_A_LEVEL_SUBJECTS;
  const label = level === "o" ? "O Level" : "A Level";

  if (duplicateSubjects.length > 0) {
    return `Choose each ${label} subject only once. Duplicate: ${duplicateSubjects.join(", ")}.`;
  }

  if (completeCount < minimum) {
    return `Add ${minimum - completeCount} more complete ${label} subject${minimum - completeCount === 1 ? "" : "s"} before continuing.`;
  }

  return null;
}

export function formatEligibilityStatus(status: EligibilityStatus): string {
  switch (status) {
    case "ELIGIBLE":
      return "Meets listed requirements";
    case "CONDITIONALLY_ELIGIBLE":
      return "Needs review";
    case "NOT_ELIGIBLE":
      return "Does not meet listed requirements";
  }
}

export function formatEligibilitySummary(counts: {
  eligible: number;
  conditional: number;
  notEligible: number;
}): string {
  return `${counts.eligible} meet the listed requirements, ${counts.conditional} need review, and ${counts.notEligible} do not meet the listed requirements.`;
}

export function formatProgrammeLevel(level?: string): string {
  if (!level) return "Level not listed";
  return level
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatDuration(duration?: number): string {
  if (!duration) return "Duration not listed";
  return `${duration} ${duration === 1 ? "year" : "years"}`;
}

export function formatProgrammeCode(code?: string): string {
  return code?.trim() || "Code unavailable";
}
