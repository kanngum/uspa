export interface HomeDegreeType {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomeProgrammeRecord {
  id: string;
  code: string;
  name: string;
  degree: HomeDegreeType | string;
  level?: string;
  duration?: number;
  faculty: string;
  facultyAbbreviation?: string;
  tuition?: {
    amount: number;
    currency: string;
    academicYear?: string;
  };
  requirementCount?: number;
}

export interface HomeFacultyRecord {
  id: string;
  name: string;
  abbreviation: string;
  programmeCount?: number;
  type?: string;
}