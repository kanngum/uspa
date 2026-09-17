export type DegreeLevel =
  | "UNDERGRADUATE"
  | "POSTGRADUATE"
  | "DOCTORATE"
  | "PROFESSIONAL";

export type StudentType = "FRESHMAN" | "DIRECT_ENTRY" | "TRANSFER";

export type EligibilityFlowBranch =
  | "freshman-subjects"
  | "previous-degree"
  | "unsupported-entry";

export type EligibilityStatus =
  | "ELIGIBLE"
  | "CONDITIONALLY_ELIGIBLE"
  | "NOT_ELIGIBLE";

export type EligibilityStep =
  | "o-level"
  | "a-level"
  | "previous-degree"
  | "results";

export interface SubjectGradeEntry {
  id: string;
  subject: string;
  grade: string;
}

export interface PreviousDegreeInput {
  degreeName: string;
  institution: string;
  graduationYear: string;
  classification: string;
  degreeLabel?: string;
  previousProgrammeId?: string;
}

export interface EligibilityFormInput {
  oLevelSubjects: Array<{ name: string; grade: string }>;
  aLevelSubjects?: Array<{ name: string; grade: string }>;
  programmeId?: string;
  programmeCode?: string;
  level?: DegreeLevel;
  universityId?: string;
  studentType?: StudentType;
  ugDegree?: PreviousDegreeInput;
}

export interface EligibilityCheckInput {
  oLevelSubjects: Array<{ subjectId: string; grade: string }>;
  aLevelSubjects?: Array<{ subjectId: string; grade: string }>;
  programmeId?: string;
  programmeCode?: string;
  level?: DegreeLevel;
  universityId?: string;
  studentType?: StudentType;
  ugDegree?: PreviousDegreeInput;
}

export interface EligibilityReason {
  type: "success" | "warning" | "error";
  message: string;
}

export interface EligibilityResultItem {
  id: string;
  name: string;
  code: string;
  level: string;
  status: EligibilityStatus;
  reasons: EligibilityReason[];
  missingRequirements: string[];
  satisfiedRequirements: string[];
}

export interface EligibilityResults {
  status: EligibilityStatus;
  summary: string;
  eligible: EligibilityResultItem[];
  conditionallyEligible: EligibilityResultItem[];
  notEligible: EligibilityResultItem[];
}
