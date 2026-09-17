// ==========================================
// USPA Shared Types
// ==========================================

// --- Enums ---
export enum UserRole {
  VISITOR = 'VISITOR',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export enum AcademicUnitType {
  FACULTY = 'FACULTY',
  SCHOOL = 'SCHOOL',
}

export enum DegreeType {
  BSC = 'BSC',
  BA = 'BA',
  BENG = 'BENG',
  BED = 'BED',
  LLB = 'LLB',
  MBBS = 'MBBS',
  HND = 'HND',
  DIPLOMA = 'DIPLOMA',
  PGD = 'PGD',
  MSC = 'MSC',
  MA = 'MA',
  MENG = 'MENG',
  PHD = 'PHD',
}

export enum ProgrammeLevel {
  UNDERGRADUATE = 'UNDERGRADUATE',
  POSTGRADUATE = 'POSTGRADUATE',
  DOCTORATE = 'DOCTORATE',
  PROFESSIONAL = 'PROFESSIONAL',
}

export enum SubjectLevel {
  O_LEVEL = 'O_LEVEL',
  A_LEVEL = 'A_LEVEL',
}

export enum RequirementType {
  REQUIRED = 'REQUIRED',
  OPTIONAL = 'OPTIONAL',
}

export enum EligibilityStatus {
  ELIGIBLE = 'ELIGIBLE',
  CONDITIONALLY_ELIGIBLE = 'CONDITIONALLY_ELIGIBLE',
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
}

export enum RuleEntityType {
  UNIVERSITY = 'UNIVERSITY',
  FACULTY = 'FACULTY',
  DEPARTMENT = 'DEPARTMENT',
  PROGRAMME = 'PROGRAMME',
}

export enum RuleOperator {
  MIN_SUBJECTS = 'MIN_SUBJECTS',
  MIN_GRADE = 'MIN_GRADE',
  REQUIRED_SUBJECT = 'REQUIRED_SUBJECT',
  OPTIONAL_SUBJECT = 'OPTIONAL_SUBJECT',
  MIN_PASSES = 'MIN_PASSES',
  SPECIFIC_GRADE_IN = 'SPECIFIC_GRADE_IN',
  SUBJECT_COMBINATION = 'SUBJECT_COMBINATION',
}

// --- Core Entities ---

export interface University {
  id: string;
  name: string;
  abbreviation: string;
  website?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicUnit {
  id: string;
  universityId: string;
  name: string;
  abbreviation?: string;
  type: AcademicUnitType;
  description?: string;
  departments?: Department[];
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  academicUnitId: string;
  name: string;
  abbreviation?: string;
  description?: string;
  academicUnit?: AcademicUnit;
  programmes?: Programme[];
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  level: SubjectLevel;
  createdAt: string;
  updatedAt: string;
}

export interface Programme {
  id: string;
  departmentId: string;
  code: string;
  name: string;
  degree: DegreeType;
  level: ProgrammeLevel;
  duration: number;
  description?: string;
  department?: Department;
  requirements?: ProgrammeRequirement[];
  tuition?: Tuition[];
  careers?: Career[];
  keywords?: Keyword[];
  createdAt: string;
  updatedAt: string;
}

export interface ProgrammeRequirement {
  id: string;
  programmeId: string;
  subjectId: string;
  requirementType: RequirementType;
  minimumGrade?: string;
  subject?: Subject;
}

export interface Career {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Keyword {
  id: string;
  word: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tuition {
  id: string;
  programmeId: string;
  academicYear: string;
  amount: number;
  currency: string;
}

export interface GeneralAdmissionRule {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionRule {
  id: string;
  entityType: RuleEntityType;
  universityId?: string;
  academicUnitId?: string;
  departmentId?: string;
  programmeId?: string;
  priority: number;
  description?: string;
  isActive: boolean;
  conditions: RuleCondition[];
  createdAt: string;
  updatedAt: string;
}

export interface RuleCondition {
  id: string;
  admissionRuleId: string;
  operator: RuleOperator;
  field?: string;
  value: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavedProgramme {
  id: string;
  userId: string;
  programmeId: string;
  programme?: Programme;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

// --- DTOs ---

export interface SearchProgrammesDto {
  query?: string;
  facultyId?: string;
  departmentId?: string;
  degreeType?: DegreeType;
  level?: ProgrammeLevel;
  career?: string;
  page?: number;
  limit?: number;
}

export interface EligibilityCheckDto {
  oLevelSubjects: { subjectId: string; grade: string }[];
  aLevelSubjects?: { subjectId: string; grade: string }[];
  programmeId?: string;
  qualificationType?: string;
}

export interface EligibilityResult {
  programmeId: string;
  programmeName: string;
  status: EligibilityStatus;
  reasons: EligibilityReason[];
  missingRequirements: string[];
  satisfiedRequirements: string[];
}

export interface EligibilityReason {
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  rule?: string;
}

export interface AiQueryDto {
  query: string;
  userId?: string;
}

export interface AiResponse {
  message: string;
  programmes?: Programme[];
  eligibility?: EligibilityResult[];
  suggestions?: string[];
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ProgrammeCompareDto {
  programmeIds: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// --- Grade Constants ---

export const O_LEVEL_GRADES = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'] as const;
export const A_LEVEL_GRADES = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

export type OLevelGrade = (typeof O_LEVEL_GRADES)[number];
export type ALevelGrade = (typeof A_LEVEL_GRADES)[number];

export const GRADE_POINTS: Record<string, number> = {
  A1: 1,
  B2: 2,
  B3: 3,
  C4: 4,
  C5: 5,
  C6: 6,
  D7: 7,
  E8: 8,
  F9: 9,
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
};

// --- Utility Types ---

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

