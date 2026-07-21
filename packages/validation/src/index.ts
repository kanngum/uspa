// ==========================================
// USPA Validation Schemas
// ==========================================

// Simple validation helpers (no external deps for shared package)
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidGrade = (grade: string, level: 'O_LEVEL' | 'A_LEVEL'): boolean => {
  const oLevelGrades = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'];
  const aLevelGrades = ['A', 'B', 'C', 'D', 'E', 'F'];

  if (level === 'O_LEVEL') return oLevelGrades.includes(grade.toUpperCase());
  return aLevelGrades.includes(grade.toUpperCase());
};

export const isValidPassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain an uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain a lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain a number' };
  }
  return { valid: true };
};

export const isValidPhoneNumber = (phone: string): boolean => {
  // Cameroon phone numbers: 6XXXXXXXX
  const cameroonRegex = /^6[0-9]{8}$/;
  return cameroonRegex.test(phone);
};

export const validateSearchQuery = (query: string): { valid: boolean; sanitized: string } => {
  const sanitized = query.trim().replace(/[<>]/g, '');
  return {
    valid: sanitized.length > 0 && sanitized.length <= 200,
    sanitized,
  };
};

export const validatePagination = (
  page: number,
  limit: number
): { page: number; limit: number } => {
  return {
    page: Math.max(1, Math.floor(page)),
    limit: Math.min(100, Math.max(1, Math.floor(limit))),
  };
};

export const validateEligibilityInput = (input: {
  oLevelSubjects: { subjectId: string; grade: string }[];
  aLevelSubjects?: { subjectId: string; grade: string }[];
}): string[] => {
  const errors: string[] = [];

  if (!input.oLevelSubjects || input.oLevelSubjects.length === 0) {
    errors.push('At least one O Level subject is required');
  }

  if (input.oLevelSubjects) {
    for (const subj of input.oLevelSubjects) {
      if (!subj.subjectId) errors.push('Subject ID is required for all O Level entries');
      if (!subj.grade) errors.push(`Grade is required for O Level subject ${subj.subjectId}`);
      else if (!isValidGrade(subj.grade, 'O_LEVEL')) {
        errors.push(`Invalid O Level grade: ${subj.grade}`);
      }
    }
  }

  if (input.aLevelSubjects) {
    for (const subj of input.aLevelSubjects) {
      if (!subj.subjectId) errors.push('Subject ID is required for all A Level entries');
      if (!subj.grade) errors.push(`Grade is required for A Level subject ${subj.subjectId}`);
      else if (!isValidGrade(subj.grade, 'A_LEVEL')) {
        errors.push(`Invalid A Level grade: ${subj.grade}`);
      }
    }
  }

  return errors;
};

export const FACULTY_SLUGS = [
  'fasa',
  'fhs',
  'fet',
  'fla',
  'fse',
  'htttc-bambili',
  'htttc-kumba',
  'coltech',
  'cbms',
] as const;

export type FacultySlug = (typeof FACULTY_SLUGS)[number];

