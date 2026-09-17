export interface HomeProgrammeRecord {
  id: string;
  code: string;
  name: string;
  degree: string;
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
