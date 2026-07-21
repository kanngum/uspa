// ==========================================
// USPA Configuration Constants
// ==========================================

export const APP_NAME = 'UBa Smart Programme Advisor';
export const APP_ACRONYM = 'USPA';
export const APP_DESCRIPTION =
  'Intelligent Program Discovery and Admission Eligibility Platform';

export const API_PREFIX = '/api';
export const API_PORT = 3001;
export const WEB_PORT = 3000;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 200,
  DEBOUNCE_MS: 300,
  CACHE_TTL_SECONDS: 300, // 5 minutes
} as const;

export const ELIGIBILITY = {
  MIN_O_LEVEL_SUBJECTS: 4,
  MIN_A_LEVEL_SUBJECTS: 2,
  MIN_O_LEVEL_PASSES: 4,
  MIN_A_LEVEL_PASSES: 2,
} as const;

export const AUTH = {
  JWT_EXPIRY: '7d',
  BCRYPT_ROUNDS: 12,
  REFRESH_TOKEN_EXPIRY_DAYS: 30,
} as const;

export const ROLES = {
  STUDENT: 'STUDENT',
  FACULTY_ADMIN: 'FACULTY_ADMIN',
  ADMISSIONS_OFFICER: 'ADMISSIONS_OFFICER',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export const FACULTIES = {
  FASA: { name: 'Faculty of Health Sciences', abbreviation: 'FASA' },
  FHS: { name: 'Faculty of Health Sciences', abbreviation: 'FHS' },
  FET: { name: 'Faculty of Engineering and Technology', abbreviation: 'FET' },
  FLA: { name: 'Faculty of Law and Political Science', abbreviation: 'FLA' },
  FSE: { name: 'Faculty of Science', abbreviation: 'FSE' },
  HTTTC_BAMBILI: {
    name: 'Higher Teacher Training College Bambili',
    abbreviation: 'HTTTC Bambili',
  },
  HTTTC_KUMBA: {
    name: 'Higher Teacher Training College Kumba',
    abbreviation: 'HTTTC Kumba',
  },
  COLTECH: { name: 'College of Technology', abbreviation: 'COLTECH' },
  CBMS: { name: 'College of Business and Management Sciences', abbreviation: 'CBMS' },
} as const;

export const DEGREE_TYPES = {
  BSC: 'Bachelor of Science',
  BA: 'Bachelor of Arts',
  BENG: 'Bachelor of Engineering',
  BED: 'Bachelor of Education',
  LLB: 'Bachelor of Laws',
  MBBS: 'Bachelor of Medicine and Surgery',
  HND: 'Higher National Diploma',
  DIPLOMA: 'Diploma',
  PGD: 'Postgraduate Diploma',
  MSC: 'Master of Science',
  MA: 'Master of Arts',
  MENG: 'Master of Engineering',
  PHD: 'Doctor of Philosophy',
} as const;

export const SUBJECT_CATEGORIES = {
  SCIENCE: ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'Computer Science'],
  ARTS: [
    'Literature in English',
    'Literature in French',
    'History',
    'Geography',
    'Economics',
  ],
  LANGUAGES: ['English Language', 'French Language', 'Arabic', 'German', 'Spanish', 'Latin'],
  VOCATIONAL: [
    'Food and Nutrition',
    'Clothing and Textiles',
    'Accounting',
    'Commerce',
    'Office Practice',
  ],
} as const;

export const O_LEVEL_SUBJECTS = [
  'English Language',
  'Mathematics',
  'Biology',
  'Chemistry',
  'Physics',
  'Geography',
  'Economics',
  'History',
  'Literature in English',
  'Literature in French',
  'French Language',
  'Computer Science',
  'Accounting',
  'Commerce',
  'Food and Nutrition',
  'Clothing and Textiles',
  'Religious Studies',
  '公民教育 (Civic Education)',
  'Agricultural Science',
  'Additional Mathematics',
  'Office Practice',
  'Arabic',
  'German',
  'Spanish',
  'Latin',
  'Philosophy',
  'Music',
  'Fine Arts',
  'Physical Education',
  'Home Economics',
] as const;

export const A_LEVEL_SUBJECTS = [
  'Biology',
  'Chemistry',
  'Physics',
  'Mathematics',
  'Further Mathematics',
  'Computer Science',
  'Geography',
  'Economics',
  'History',
  'Literature in English',
  'Literature in French',
  'French Language',
  'English Language',
  'Accounting',
  'Commerce',
  'Geology',
  'Philosophy',
  'Sociology',
  'Psychology',
  'Anthropology',
  'Political Science',
  'Islamic Studies',
  'Christian Religious Studies',
] as const;

