// ==========================================
// USPA Utility Functions
// ==========================================

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

/**
 * Converts a grade string to its numeric point value
 */
export const gradeToPoints = (grade: string): number => {
  return GRADE_POINTS[grade.toUpperCase()] ?? 99;
};

/**
 * Checks if a grade meets a minimum grade requirement
 */
export const meetsMinimumGrade = (grade: string, minimumGrade: string): boolean => {
  const gradePoint = gradeToPoints(grade);
  const minPoint = gradeToPoints(minimumGrade);
  return gradePoint <= minPoint; // Lower points = better grade
};

/**
 * Determines if a grade is a pass (C6 or better for O-Level, E or better for A-Level)
 */
export const isPassGrade = (grade: string, level: 'O_LEVEL' | 'A_LEVEL'): boolean => {
  const upper = grade.toUpperCase();
  if (level === 'O_LEVEL') {
    return ['A1', 'B2', 'B3', 'C4', 'C5', 'C6'].includes(upper);
  }
  return ['A', 'B', 'C', 'D', 'E'].includes(upper);
};

/**
 * Calculates total points for a set of subjects
 */
export const calculateTotalPoints = (
  subjects: { grade: string; level: 'O_LEVEL' | 'A_LEVEL' }[]
): number => {
  return subjects.reduce((total, subj) => total + gradeToPoints(subj.grade), 0);
};

/**
 * Counts the number of passes in a set of subjects
 */
export const countPasses = (
  subjects: { grade: string; level: 'O_LEVEL' | 'A_LEVEL' }[]
): number => {
  return subjects.filter((s) => isPassGrade(s.grade, s.level)).length;
};

/**
 * Generates a searchable slug from a string
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Formats currency amount (XAF)
 */
export const formatCurrency = (amount: number, currency: string = 'XAF'): string => {
  return `${amount.toLocaleString()} ${currency}`;
};

/**
 * Truncates text to a given length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '...';
};

/**
 * Groups an array by a key function
 */
export const groupBy = <T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> => {
  return array.reduce(
    (result, item) => {
      const key = keyFn(item);
      if (!result[key]) result[key] = [];
      result[key].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
};

/**
 * Debounce utility
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Clamps a number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as object).length === 0;
  return false;
};

/**
 * Generates a random color based on a string (for avatars, badges, etc.)
 */
export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.abs(hash).toString(16).substring(0, 6);
  return `#${color.padStart(6, '0')}`;
};

/**
 * Calculates academic year string (e.g., "2024/2025")
 */
export const getAcademicYear = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = date.getMonth();
  // Academic year starts in September
  if (month >= 8) {
    return `${year}/${year + 1}`;
  }
  return `${year - 1}/${year}`;
};

