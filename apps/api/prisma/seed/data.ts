// ==========================================
// USPA Seed Data - University of Bamenda
// ==========================================

export const university = {
  name: 'The University of Bamenda',
  abbreviation: 'UBa',
  website: 'https://www.uba.cm',
  description:
    'A prestigious higher education institution in the North West Region of Cameroon, offering diverse undergraduate and postgraduate programmes across multiple faculties and schools.',
};

// ==========================================
// FACULTIES & DEPARTMENTS
// ==========================================

export const academicUnits = [
  {
    name: 'Faculty of Health Sciences',
    abbreviation: 'FHS',
    type: 'FACULTY' as const,
    description: 'Offers programmes in health, clinical science, medicine, nursing, pharmacy and public health.',
    departments: [
      {
        name: 'Biomedical Science',
        abbreviation: 'BMS',
        description: 'Offers programmes in biomedical science',
      },
      {
        name: 'Clinical Science',
        abbreviation: 'CLS',
        description: 'Offers programmes in clinical science',
      },
      {
        name: 'General Medicine',
        abbreviation: 'MD',
        description: 'Offers programmes in general medicine',
      },
      {
        name: 'Medical and BioMedical Sciences',
        abbreviation: 'MBMS',
        description: 'Offers programmes in medical and biomedical sciences',
      },
      {
        name: 'Medical Laboratory Science',
        abbreviation: 'MLS',
        description: 'Offers programmes in medical laboratory science',
      },
      {
        name: 'Nursing/Midwifery',
        abbreviation: 'NMW',
        description: 'Offers programmes in nursing and midwifery',
      },
      {
        name: 'Pharmacy',
        abbreviation: 'PHAM',
        description: 'Offers programmes in pharmacy',
      },
      {
        name: 'Public Health',
        abbreviation: 'PH',
        description: 'Offers programmes in public health',
      },
    ],
  },

  {
  name: 'Faculty of Engineering and Technology',
  abbreviation: 'FET',
  type: 'FACULTY' as const,
  description: 'Provides engineering and technology programmes including Civil, Electrical, Mechanical, Computer, and Telecommunications Engineering.',
  departments: [
    {
      name: 'Civil Engineering',
      abbreviation: 'CIV',
      description: 'Offers programmes in civil engineering',
    },
    {
      name: 'Electrical and Electronic Engineering',
      abbreviation: 'EEE',
      description: 'Offers programmes in electrical and electronic engineering',
    },
    {
      name: 'Mechanical Engineering',
      abbreviation: 'MEC',
      description: 'Offers programmes in mechanical engineering',
    },
    {
      name: 'Computer Engineering',
      abbreviation: 'CPE',
      description: 'Offers programmes in computer engineering',
    },
    {
      name: 'Telecommunications Engineering',
      abbreviation: 'TEL',
      description: 'Offers programmes in telecommunications engineering',
    },
  ],
},

  {
    name: 'Faculty of Law and Political Science',
    abbreviation: 'FLPS',
    type: 'FACULTY' as const,
    description: 'Offers programmes in law, political science and public law.',
    departments: [
      {
        name: 'Capacité en Droit',
        abbreviation: 'CAPA',
        description: 'Offers programmes in legal capacity and law',
      },
      {
        name: 'English Private Law',
        abbreviation: 'EPL',
        description: 'Offers programmes in English private law',
      },
      {
        name: 'French Private Law',
        abbreviation: 'FPL',
        description: 'Offers programmes in French private law',
      },
      {
        name: 'Political Science',
        abbreviation: 'POS',
        description: 'Offers programmes in political science',
      },
      {
        name: 'Public Law',
        abbreviation: 'PUL',
        description: 'Offers programmes in public law',
      },
    ],
  },

  {
    name: 'Faculty of Science',
    abbreviation: 'FS',
    type: 'FACULTY' as const,
    description: 'Offers science programmes in biology, chemistry, physics, geology, mathematics and related fields.',
    departments: [
      {
        name: 'Zoology',
        abbreviation: 'ZOO',
        description: 'Offers programmes in zoology',
      },
      {
        name: 'Biochemistry',
        abbreviation: 'BCH',
        description: 'Offers programmes in biochemistry',
      },
      {
        name: 'Biological Science',
        abbreviation: 'BS',
        description: 'Offers programmes in biological science',
      },
      {
        name: 'Chemistry',
        abbreviation: 'CHM',
        description: 'Offers programmes in chemistry',
      },
      {
        name: 'Geology, Mining and Environmental Science',
        abbreviation: 'GMES',
        description: 'Offers programmes in geology, mining and environmental science',
      },
      {
        name: 'Mathematics and Computer Science',
        abbreviation: 'MCS',
        description: 'Offers programmes in mathematics and computer science',
      },
      {
        name: 'Microbiology and Parasitology',
        abbreviation: 'MICP',
        description: 'Offers programmes in microbiology and parasitology',
      },
      {
        name: 'Physics',
        abbreviation: 'PHY',
        description: 'Offers programmes in physics',
      },
      {
        name: 'Plant Sciences (Botany)',
        abbreviation: 'BOT',
        description: 'Offers programmes in plant sciences and botany',
      },
      {
        name: 'Thermal and Energy Engineering',
        abbreviation: 'TEE',
        description: 'Offers programmes in thermal and energy engineering',
      },
    ],
  },

  {
    name: 'Faculty of Arts',
    abbreviation: 'FA',
    type: 'FACULTY' as const,
    description: 'Offers programmes in humanities, language studies, arts and communication.',
    departments: [
      {
        name: 'Communication and Development Studies',
        abbreviation: 'CDS',
        description: 'Offers programmes in communication and development studies',
      },
      {
        name: 'Education',
        abbreviation: 'ED',
        description: 'Offers programmes in education',
      },
      {
        name: 'English',
        abbreviation: 'ENG',
        description: 'Offers programmes in English',
      },
      {
        name: 'English, Literature and Digital Cultures',
        abbreviation: 'ELDIC',
        description: 'Offers programmes in English, literature and digital cultures',
      },
      {
        name: 'Geography and Planning',
        abbreviation: 'GP',
        description: 'Offers programmes in geography and planning',
      },
      {
        name: 'History, Heritage and International Studies',
        abbreviation: 'HISA',
        description: 'Offers programmes in history, heritage and international studies',
      },
      {
        name: 'Linguistics and African Languages',
        abbreviation: 'LAL',
        description: 'Offers programmes in linguistics and African languages',
      },
      {
        name: 'Performing and Visual Arts',
        abbreviation: 'PVA',
        description: 'Offers programmes in performing and visual arts',
      },
      {
        name: 'Philosophy',
        abbreviation: 'PHI',
        description: 'Offers programmes in philosophy',
      },
      {
        name: 'Psychology',
        abbreviation: 'PY',
        description: 'Offers programmes in psychology',
      },
      {
        name: 'University of Bamenda Language Center',
        abbreviation: 'UBALAC',
        description: 'Offers language and cultural programmes',
      },
    ],
  },

  {
    name: 'Faculty of Education',
    abbreviation: 'FED',
    type: 'FACULTY' as const,
    description: 'Offers education and teacher training programmes across multiple specializations.',
    departments: [
      {
        name: 'Bereavement Counseling',
        abbreviation: 'BRC',
        description: 'Offers programmes in bereavement counseling',
      },
      {
        name: 'Counseling Psychology',
        abbreviation: 'CPY',
        description: 'Offers programmes in counseling psychology',
      },
      {
        name: 'Curriculum and Pedagogy',
        abbreviation: 'CUP',
        description: 'Offers programmes in curriculum and pedagogy',
      },
      {
        name: 'Distance Education',
        abbreviation: 'DED',
        description: 'Offers programmes in distance education',
      },
      {
        name: 'Educational Foundation',
        abbreviation: 'EFA',
        description: 'Offers programmes in educational foundation',
      },
      {
        name: 'Educational Leadership',
        abbreviation: 'EDL',
        description: 'Offers programmes in educational leadership',
      },
      {
        name: 'Educational Psychology',
        abbreviation: 'EPY',
        description: 'Offers programmes in educational psychology',
      },
      {
        name: 'Industrial and Organizational Psychology',
        abbreviation: 'IPY',
        description: 'Offers programmes in industrial and organizational psychology',
      },
      {
        name: 'Physical Education and Animation',
        abbreviation: 'PEA',
        description: 'Offers programmes in physical education and animation',
      },
      {
        name: 'School Counseling',
        abbreviation: 'SCC',
        description: 'Offers programmes in school counseling',
      },
      {
        name: 'Sports',
        abbreviation: 'SPTS',
        description: 'Offers programmes in sports',
      },
      {
        name: 'Teacher Education',
        abbreviation: 'TED',
        description: 'Offers programmes in teacher education',
      },
    ],
  },

  {
    name: 'Faculty of Economics and Management Sciences',
    abbreviation: 'FEMS',
    type: 'FACULTY' as const,
    description: 'Offers programmes in economics, accounting, finance, management and marketing.',
    departments: [
      {
        name: 'Accounting',
        abbreviation: 'ACC',
        description: 'Offers programmes in accounting',
      },
      {
        name: 'Banking and Finance',
        abbreviation: 'BNF',
        description: 'Offers programmes in banking and finance',
      },
      {
        name: 'Business and Finance',
        abbreviation: 'BF',
        description: 'Offers programmes in business and finance',
      },
      {
        name: 'Economics',
        abbreviation: 'ECN',
        description: 'Offers programmes in economics',
      },
      {
        name: 'Management and Marketing',
        abbreviation: 'MGT',
        description: 'Offers programmes in management and marketing',
      },
    ],
  },

  {
    name: 'Higher Technical Teacher Training College',
    abbreviation: 'HTTTC',
    type: 'SCHOOL' as const,
    description: 'Offers teacher training and technical education programmes.',
    departments: [
      {
        name: 'Administrative Techniques',
        abbreviation: 'ADT',
        description: 'Offers programmes in administrative techniques',
      },
      {
        name: 'Civil Engineering and Forestry Techniques',
        abbreviation: 'CEFT',
        description: 'Offers programmes in civil engineering and forestry techniques',
      },
      {
        name: 'Computer Science',
        abbreviation: 'CSC',
        description: 'Offers programmes in computer science',
      },
      {
        name: 'Economic Science',
        abbreviation: 'ECS',
        description: 'Offers programmes in economic science',
      },
      {
        name: 'Electrical and Power Engineering',
        abbreviation: 'EPE',
        description: 'Offers programmes in electrical and power engineering',
      },
      {
        name: 'Electronics and Electricity',
        abbreviation: 'EELEC',
        description: 'Offers programmes in electronics and electricity',
      },
      {
        name: 'Fundamental Science',
        abbreviation: 'FS',
        description: 'Offers programmes in fundamental science',
      },
      {
        name: 'Law',
        abbreviation: 'LAW',
        description: 'Offers programmes in law',
      },
      {
        name: 'Mechanical Engineering',
        abbreviation: 'MEN',
        description: 'Offers programmes in mechanical engineering',
      },
      {
        name: 'Renewable Energy',
        abbreviation: 'REEN',
        description: 'Offers programmes in renewable energy',
      },
      {
        name: 'Science of Education',
        abbreviation: 'SED',
        description: 'Offers programmes in science of education',
      },
      {
        name: 'Social Economy and Family Management',
        abbreviation: 'SFM',
        description: 'Offers programmes in social economy and family management',
      },
    ],
  },

  {
  name: 'College of Business and Management Sciences',
  abbreviation: 'CBMS',
  type: 'SCHOOL' as const,
  description: 'Offers business, accounting, management and finance programmes.',
  departments: [
    {
      name: 'Accounting',
      abbreviation: 'ACCT',
      description: 'Offers programmes in accounting',
    },
    {
      name: 'Banking and Finance',
      abbreviation: 'BF',
      description: 'Offers programmes in banking and finance',
    },
    {
      name: 'Business and Finance',
      abbreviation: 'BFN',
      description: 'Offers programmes in business and finance',
    },
    {
      name: 'Marketing',
      abbreviation: 'MKT',
      description: 'Offers programmes in marketing',
    },
  ],
},

  {
    name: 'Higher Institute of Commerce and Management',
    abbreviation: 'HICM',
    type: 'SCHOOL' as const,
    description: 'Offers commerce, management, transport and hospitality programmes.',
    departments: [
      {
        name: 'Information and Communication Management Systems',
        abbreviation: 'IMC',
        description: 'Offers programmes in information and communication management systems',
      },
      {
        name: 'Accounting and Finance',
        abbreviation: 'AFN',
        description: 'Offers programmes in accounting and finance',
      },
      {
        name: 'Insurance',
        abbreviation: 'INS',
        description: 'Offers programmes in insurance',
      },
      {
        name: 'Management and Entrepreneurship',
        abbreviation: 'MGTC',
        description: 'Offers programmes in management and entrepreneurship',
      },
      {
        name: 'Marketing',
        abbreviation: 'MKT',
        description: 'Offers programmes in marketing',
      },
      {
        name: 'Money and Banking',
        abbreviation: 'MAB',
        description: 'Offers programmes in money and banking',
      },
      {
        name: 'Organizational Sciences',
        abbreviation: 'OGS',
        description: 'Offers programmes in organizational sciences',
      },
      {
        name: 'Air Transport',
        abbreviation: 'ATR',
        description: 'Offers programmes in air transport',
      },
      {
        name: 'Customs',
        abbreviation: 'CUS',
        description: 'Offers programmes in customs',
      },
      {
        name: 'General Studies',
        abbreviation: 'GNS',
        description: 'Offers programmes in general studies',
      },
      {
        name: 'Land Transport',
        abbreviation: 'LTP',
        description: 'Offers programmes in land transport',
      },
      {
        name: 'Maritime Transport',
        abbreviation: 'MTT',
        description: 'Offers programmes in maritime transport',
      },
      {
        name: 'Tourism and Hospitality Management',
        abbreviation: 'TM',
        description: 'Offers programmes in tourism and hospitality management',
      },
      {
        name: 'Transit and Logistics',
        abbreviation: 'TLG',
        description: 'Offers programmes in transit and logistics',
      },
    ],
  },

  {
    name: 'Higher Institute of Transport and Logistics',
    abbreviation: 'HITL',
    type: 'SCHOOL' as const,
    description: 'Offers transport, logistics, education and language-related programmes.',
    departments: [
      {
        name: 'Arts, Languages & Literatures and Philosophy',
        abbreviation: 'ALLP',
        description: 'Offers programmes in arts, languages, literatures and philosophy',
      },
      {
        name: 'Bilingual Letters',
        abbreviation: 'BIL',
        description: 'Offers programmes in bilingual letters',
      },
      {
        name: 'Biology - Geology - Chemistry - Environmental Science',
        abbreviation: 'BGC',
        description: 'Offers programmes in biology, geology, chemistry and environmental science',
      },
      {
        name: 'Biology',
        abbreviation: 'BIO',
        description: 'Offers programmes in biology',
      },
      {
        name: 'Chemistry',
        abbreviation: 'CHM',
        description: 'Offers programmes in chemistry',
      },
      {
        name: 'Computer Science',
        abbreviation: 'CSC',
        description: 'Offers programmes in computer science',
      },
      {
        name: 'Economics',
        abbreviation: 'ECONS',
        description: 'Offers programmes in economics',
      },
      {
        name: 'Economics, Citizenship Education, Information and Communication',
        abbreviation: 'ECEI',
        description: 'Offers programmes in economics, citizenship education, information and communication',
      },
      {
        name: 'English, Arts Education, National Languages and Cultures',
        abbreviation: 'FAEN',
        description: 'Offers programmes in English, arts education, national languages and cultures',
      },
      {
        name: 'English Modern Letters',
        abbreviation: 'EML',
        description: 'Offers programmes in English modern letters',
      },
      {
        name: 'French, Arts Education, National Languages and Cultures',
        abbreviation: 'FAEN',
        description: 'Offers programmes in French, arts education, national languages and cultures',
      },
      {
        name: 'French Modern Letters',
        abbreviation: 'FML',
        description: 'Offers programmes in French modern letters',
      },
      {
        name: 'Geography',
        abbreviation: 'GEO',
        description: 'Offers programmes in geography',
      },
      {
        name: 'Geology',
        abbreviation: 'GELG',
        description: 'Offers programmes in geology',
      },
      {
        name: 'Guidance and Counseling',
        abbreviation: 'GNC',
        description: 'Offers programmes in guidance and counseling',
      },
      {
        name: 'History',
        abbreviation: 'HIS',
        description: 'Offers programmes in history',
      },
      {
        name: 'History/Geography, Citizenship Education and Information',
        abbreviation: 'HGCE',
        description: 'Offers programmes in history/geography, citizenship education and information',
      },
      {
        name: 'Mathematics',
        abbreviation: 'MAT',
        description: 'Offers programmes in mathematics',
      },
      {
        name: 'Mathematics, Fundamental Computer Science and Technology',
        abbreviation: 'MFCT',
        description: 'Offers programmes in mathematics, fundamental computer science and technology',
      },
      {
        name: 'One Foreign Language (Chinese), One Official Language and Art',
        abbreviation: 'OFLC',
        description: 'Offers programmes in Chinese, one official language and art',
      },
      {
        name: 'One Foreign Language (German), One Official Language and Arts',
        abbreviation: 'OFLG',
        description: 'Offers programmes in German, one official language and arts',
      },
      {
        name: 'One Foreign Language (Italian), One Official Language and Art',
        abbreviation: 'OFLI',
        description: 'Offers programmes in Italian, one official language and art',
      },
      {
        name: 'One Foreign Language (Spanish), One Official Language and Art',
        abbreviation: 'OFLS',
        description: 'Offers programmes in Spanish, one official language and art',
      },
      {
        name: 'Philosophy',
        abbreviation: 'PHI',
        description: 'Offers programmes in philosophy',
      },
      {
        name: 'Philosophy, One Foreign Language and One Official Language',
        abbreviation: 'POFL',
        description: 'Offers programmes in philosophy, one foreign language and one official language',
      },
      {
        name: 'Physics',
        abbreviation: 'PHY',
        description: 'Offers programmes in physics',
      },
      {
        name: 'Physics, Chemistry and Technology',
        abbreviation: 'PCTN',
        description: 'Offers programmes in physics, chemistry and technology',
      },
      {
        name: 'Science of Education',
        abbreviation: 'SED',
        description: 'Offers programmes in science of education',
      },
      {
        name: 'Sciences of Education',
        abbreviation: 'SCEN',
        description: 'Offers programmes in sciences of education',
      },
    ],
  },

  {
    name: 'HND/HPD/B.TECH Academic Organ',
    abbreviation: 'HND',
    type: 'SCHOOL' as const,
    description: 'Offers HND, HPD and B.Tech programmes across applied sciences and engineering.',
    departments: [
      {
        name: 'Agriculture and Food Sciences',
        abbreviation: 'AFSH',
        description: 'Offers programmes in agriculture and food sciences',
      },
      {
        name: 'Business, Finance and Management',
        abbreviation: 'BFM',
        description: 'Offers programmes in business, finance and management',
      },
      {
        name: 'Civil Engineering',
        abbreviation: 'CVEN',
        description: 'Offers programmes in civil engineering',
      },
      {
        name: 'Computer Engineering (X)',
        abbreviation: 'CME',
        description: 'Offers programmes in computer engineering',
      },
      {
        name: 'Education',
        abbreviation: 'ED',
        description: 'Offers programmes in education',
      },
      {
        name: 'Electrical and Electronic Engineering',
        abbreviation: 'EEEH',
        description: 'Offers programmes in electrical and electronic engineering',
      },
      {
        name: 'Forestry and Wildlife Technology',
        abbreviation: 'FWT',
        description: 'Offers programmes in forestry and wildlife technology',
      },
      {
        name: 'Home Economics and Social Work HND/BTECH',
        abbreviation: 'HESW',
        description: 'Offers programmes in home economics and social work',
      },
      {
        name: 'Journalism and Media',
        abbreviation: 'JMH',
        description: 'Offers programmes in journalism and media',
      },
      {
        name: 'Law',
        abbreviation: 'LL',
        description: 'Offers programmes in law',
      },
      {
        name: 'Management',
        abbreviation: 'MANH',
        description: 'Offers programmes in management',
      },
      {
        name: 'Mechanical Engineering',
        abbreviation: 'ME',
        description: 'Offers programmes in mechanical engineering',
      },
      {
        name: 'Medical and Biomedical Sciences',
        abbreviation: 'MBSH',
        description: 'Offers programmes in medical and biomedical sciences',
      },
      {
        name: 'Thermal and Energy Engineering',
        abbreviation: 'TEE',
        description: 'Offers programmes in thermal and energy engineering',
      },
      {
        name: 'Tourism Management',
        abbreviation: 'TM',
        description: 'Offers programmes in tourism management',
      },
      {
        name: 'Transport and Maritime Studies',
        abbreviation: 'TMS',
        description: 'Offers programmes in transport and maritime studies',
      },
      {
        name: 'Woodworks',
        abbreviation: 'WWH',
        description: 'Offers programmes in woodworks',
      },
    ],
  },

  {
    name: 'National Higher Polytechnic Institute',
    abbreviation: 'NAHPI',
    type: 'SCHOOL' as const,
    description: 'Offers polytechnic engineering and technical programmes.',
    departments: [
      {
        name: 'Centre for Cybersecurity and Mathematical Cryptology',
        abbreviation: 'CMC',
        description: 'Offers programmes in cybersecurity and mathematical cryptology',
      },
      {
        name: 'Chemical and Biological Engineering',
        abbreviation: 'CBE',
        description: 'Offers programmes in chemical and biological engineering',
      },
      {
        name: 'Civil Engineering and Architecture',
        abbreviation: 'CVL',
        description: 'Offers programmes in civil engineering and architecture',
      },
      {
        name: 'Computer Engineering',
        abbreviation: 'COM',
        description: 'Offers programmes in computer engineering',
      },
      {
        name: 'Electrical and Electronic Engineering',
        abbreviation: 'EEEE',
        description: 'Offers programmes in electrical and electronic engineering',
      },
      {
        name: 'Mechanical and Industrial Engineering',
        abbreviation: 'MEC',
        description: 'Offers programmes in mechanical and industrial engineering',
      },
      {
        name: 'Mining and Mineral Engineering',
        abbreviation: 'MIN',
        description: 'Offers programmes in mining and mineral engineering',
      },
      {
        name: 'Petroleum Engineering',
        abbreviation: 'PET',
        description: 'Offers programmes in petroleum engineering',
      },
    ],
  },

  {
    name: 'Doctoral Training',
    abbreviation: 'DT',
    type: 'SCHOOL' as const,
    description: 'Supports advanced doctoral research and training across multiple sciences.',
    departments: [
      {
        name: 'Economics and Management Sciences',
        abbreviation: 'DTCM',
        description: 'Doctoral training in economics and management sciences',
      },
      {
        name: 'Human Health Sciences - Biomedical Sciences - Public Health',
        abbreviation: 'DTCH',
        description: 'Doctoral training in human health sciences, biomedical sciences and public health',
      },
      {
        name: 'Physical Sciences - Agricultural and Environmental Sciences',
        abbreviation: 'DTCS',
        description: 'Doctoral training in physical sciences and agricultural and environmental sciences',
      },
      {
        name: 'Process-Oriented and Allied Engineering Sciences',
        abbreviation: 'DTCE',
        description: 'Doctoral training in process-oriented and allied engineering sciences',
      },
    ],
  }
];

// ==========================================
// O & A LEVEL SUBJECTS
// ==========================================

export const oLevelSubjects = [
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
  'Civic Education',
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
];

export const aLevelSubjects = [
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
];

// ==========================================
// PROGRAMMES
// ==========================================

export const programmes = [
  // ---- FHS - Medicine ----
  {
    code: 'MBBS-01',
    name: 'Bachelor of Medicine and Bachelor of Surgery',
    degree: 'MBBS',
    level: 'UNDERGRADUATE',
    duration: 7,
    description:
      'A comprehensive medical programme that trains students to become medical doctors. The programme covers basic medical sciences, clinical medicine, surgery, and community health.',
    departmentIndex: { facultyIdx: 0, deptIdx: 0 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics'],
      aLevel: ['Biology', 'Chemistry', 'Physics', 'Mathematics'],
      oLevelPasses: 5,
      aLevelPasses: 3,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Medical Doctor', 'Surgeon', 'Public Health Specialist', 'Medical Researcher'],
    keywords: [
      'medicine',
      'doctor',
      'surgery',
      'medical',
      'health',
      'clinical',
      'physician',
      'mbbs',
    ],
    tuition: 500000,
  },
  {
    code: 'BSC-NUR-01',
    name: 'BSc in Nursing',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 4,
    description:
      'Prepares students for professional nursing practice with a focus on patient care, community health, and clinical skills.',
    departmentIndex: { facultyIdx: 0, deptIdx: 1 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics'],
      aLevel: ['Biology', 'Chemistry'],
      oLevelPasses: 5,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Registered Nurse', 'Nurse Educator', 'Community Health Nurse', 'Clinical Nurse Specialist'],
    keywords: ['nursing', 'nurse', 'healthcare', 'patient care', 'clinical'],
    tuition: 350000,
  },
  {
    code: 'BSC-BMS-01',
    name: 'BSc in Biomedical Sciences',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 4,
    description:
      'Focuses on the study of human biology, disease mechanisms, and laboratory techniques essential for medical research and diagnostics.',
    departmentIndex: { facultyIdx: 0, deptIdx: 2 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics'],
      aLevel: ['Biology', 'Chemistry'],
      oLevelPasses: 5,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Biomedical Scientist', 'Research Assistant', 'Lab Technician', 'Pharmaceutical Researcher'],
    keywords: ['biomedical', 'medical science', 'biology', 'lab', 'research'],
    tuition: 350000,
  },
  {
    code: 'BSC-PH-01',
    name: 'BSc in Public Health',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 4,
    description:
      'Addresses population health, disease prevention, health policy, and community health promotion.',
    departmentIndex: { facultyIdx: 0, deptIdx: 3 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Biology', 'Chemistry'],
      aLevel: ['Biology', 'Chemistry'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Public Health Officer', 'Epidemiologist', 'Health Educator', 'Community Health Manager'],
    keywords: ['public health', 'community health', 'epidemiology', 'health policy'],
    tuition: 300000,
  },
  {
    code: 'BSC-MLS-01',
    name: 'BSc in Medical Laboratory Science',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 4,
    description:
      'Trains students in laboratory diagnostics, clinical testing, and medical laboratory management.',
    departmentIndex: { facultyIdx: 0, deptIdx: 4 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics'],
      aLevel: ['Biology', 'Chemistry'],
      oLevelPasses: 5,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Medical Laboratory Scientist', 'Lab Manager', 'Diagnostic Technician', 'Research Scientist'],
    keywords: ['lab', 'laboratory', 'medical lab', 'diagnostics', 'clinical testing'],
    tuition: 350000,
  },

  // ---- FET - Engineering ----
  {
    code: 'BENG-CIV-01',
    name: 'BEng in Civil Engineering',
    degree: 'BENG',
    level: 'UNDERGRADUATE',
    duration: 4,
    description:
      'Covers structural engineering, construction, geotechnics, hydraulics, and transportation engineering.',
    departmentIndex: { facultyIdx: 1, deptIdx: 0 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Physics', 'Chemistry'],
      aLevel: ['Mathematics', 'Physics', 'Chemistry'],
      oLevelPasses: 4,
      aLevelPasses: 3,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Civil Engineer', 'Structural Engineer', 'Construction Manager', 'Transportation Engineer'],
    keywords: ['civil', 'construction', 'structural', 'building', 'infrastructure'],
    tuition: 400000,
  },
  {
    code: 'BENG-EEE-01',
    name: 'BEng in Electrical and Electronic Engineering',
    degree: 'BENG',
    level: 'UNDERGRADUATE',
    duration: 4,
    description:
      'Focuses on electrical power systems, electronics, control systems, and telecommunications.',
    departmentIndex: { facultyIdx: 1, deptIdx: 1 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Physics', 'Chemistry'],
      aLevel: ['Mathematics', 'Physics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Electrical Engineer', 'Electronics Engineer', 'Power Systems Engineer', 'Control Systems Engineer'],
    keywords: ['electrical', 'electronic', 'power', 'circuit', 'telecom'],
    tuition: 400000,
  },
  {
    code: 'BENG-MEC-01',
    name: 'BEng in Mechanical Engineering',
    degree: 'BENG',
    level: 'UNDERGRADUATE',
    duration: 4,
    description:
      'Covers thermodynamics, fluid mechanics, manufacturing, machine design, and automation.',
    departmentIndex: { facultyIdx: 1, deptIdx: 2 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Physics', 'Chemistry'],
      aLevel: ['Mathematics', 'Physics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Mechanical Engineer', 'Manufacturing Engineer', 'Automation Engineer', 'Design Engineer'],
    keywords: ['mechanical', 'manufacturing', 'automotive', 'machine', 'design'],
    tuition: 400000,
  },
  {
    code: 'BENG-CPE-01',
    name: 'BEng in Computer Engineering',
    degree: 'BENG',
    level: 'UNDERGRADUATE',
    duration: 4,
    description:
      'Integrates computer science and electrical engineering to develop computer systems and embedded devices.',
    departmentIndex: { facultyIdx: 1, deptIdx: 3 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Physics', 'Chemistry'],
      aLevel: ['Mathematics', 'Physics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Computer Engineer', 'Embedded Systems Engineer', 'Hardware Engineer', 'Systems Architect'],
    keywords: ['computer', 'hardware', 'embedded', 'iot', 'microcontroller'],
    tuition: 400000,
  },
  {
    code: 'BENG-TEL-01',
    name: 'BEng in Telecommunications Engineering',
    degree: 'BENG',
    level: 'UNDERGRADUATE',
    duration: 4,
    description:
      'Focuses on communication systems, signal processing, network infrastructure, and wireless technologies.',
    departmentIndex: { facultyIdx: 1, deptIdx: 4 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Physics', 'Chemistry'],
      aLevel: ['Mathematics', 'Physics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Telecom Engineer', 'Network Engineer', 'Signal Processing Engineer', 'RF Engineer'],
    keywords: ['telecom', 'communication', 'network', 'wireless', 'signal'],
    tuition: 400000,
  },

  // ---- FLP - Law & Political Science ----
  {
    code: 'LLB-01',
    name: 'Bachelor of Laws (LLB)',
    degree: 'LLB',
    level: 'UNDERGRADUATE',
    duration: 4,
    description:
      'Comprehensive law programme covering constitutional law, criminal law, contract law, property law, and legal practice.',
    departmentIndex: { facultyIdx: 2, deptIdx: 0 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Literature in English'],
      aLevel: ['Literature in English', 'History', 'Economics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Lawyer', 'Legal Advisor', 'Judge', 'Corporate Counsel', 'Prosecutor'],
    keywords: ['law', 'legal', 'lawyer', 'llb', 'justice', 'advocate'],
    tuition: 350000,
  },
  {
    code: 'BA-POL-01',
    name: 'BA in Political Science',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Studies political systems, governance, public policy, and political theory.',
    departmentIndex: { facultyIdx: 2, deptIdx: 1 },
    requirements: {
      oLevel: ['English Language', 'Mathematics'],
      aLevel: ['History', 'Economics', 'Literature in English'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Political Analyst', 'Policy Advisor', 'Civil Servant', 'Diplomat'],
    keywords: ['political science', 'politics', 'government', 'policy', 'governance'],
    tuition: 250000,
  },
  {
    code: 'BA-IR-01',
    name: 'BA in International Relations',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Explores international politics, diplomacy, global organizations, and foreign policy.',
    departmentIndex: { facultyIdx: 2, deptIdx: 2 },
    requirements: {
      oLevel: ['English Language', 'Mathematics'],
      aLevel: ['History', 'Economics', 'French Language', 'Literature in English'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Diplomat', 'International Relations Officer', 'Foreign Service Officer', 'NGO Specialist'],
    keywords: ['international relations', 'diplomacy', 'foreign affairs', 'global', 'un'],
    tuition: 250000,
  },

  // ---- FSE - Science ----
  {
    code: 'BSC-CS-01',
    name: 'BSc in Computer Science',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 4,
    description:
      'Covers programming, algorithms, data structures, software engineering, artificial intelligence, and database systems.',
    departmentIndex: { facultyIdx: 3, deptIdx: 0 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Physics'],
      aLevel: ['Mathematics', 'Physics', 'Computer Science'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Software Engineer', 'Data Scientist', 'Web Developer', 'Systems Analyst', 'AI Engineer'],
    keywords: [
      'computer',
      'programming',
      'software',
      'coding',
      'it',
      'information technology',
      'developer',
      'web',
      'data',
      'ai',
      'artificial intelligence',
    ],
    tuition: 350000,
  },
  {
    code: 'BSC-MATH-01',
    name: 'BSc in Mathematics',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Focuses on pure and applied mathematics, statistics, and mathematical modeling.',
    departmentIndex: { facultyIdx: 3, deptIdx: 1 },
    requirements: {
      oLevel: ['English Language', 'Mathematics'],
      aLevel: ['Mathematics', 'Further Mathematics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Mathematician', 'Statistician', 'Data Analyst', 'Actuary', 'Teacher'],
    keywords: ['math', 'mathematics', 'statistics', 'data analysis', 'actuarial'],
    tuition: 250000,
  },
  {
    code: 'BSC-PHY-01',
    name: 'BSc in Physics',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Covers classical and modern physics, quantum mechanics, thermodynamics, and experimental physics.',
    departmentIndex: { facultyIdx: 3, deptIdx: 2 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Physics'],
      aLevel: ['Mathematics', 'Physics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Physicist', 'Research Scientist', 'Lab Technician', 'Science Educator'],
    keywords: ['physics', 'quantum', 'mechanics', 'thermodynamics', 'experimental'],
    tuition: 250000,
  },
  {
    code: 'BSC-CHEM-01',
    name: 'BSc in Chemistry',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Studies organic, inorganic, physical, and analytical chemistry with laboratory practice.',
    departmentIndex: { facultyIdx: 3, deptIdx: 3 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Chemistry', 'Physics'],
      aLevel: ['Chemistry', 'Mathematics', 'Physics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Chemist', 'Lab Analyst', 'Chemical Engineer', 'Pharmaceutical Scientist', 'Quality Control'],
    keywords: ['chemistry', 'chemical', 'lab', 'analytical', 'organic'],
    tuition: 250000,
  },
  {
    code: 'BSC-BIO-01',
    name: 'BSc in Biology',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Explores molecular biology, ecology, genetics, microbiology, and biodiversity.',
    departmentIndex: { facultyIdx: 3, deptIdx: 4 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Biology', 'Chemistry'],
      aLevel: ['Biology', 'Chemistry'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Biologist', 'Environmental Consultant', 'Research Scientist', 'Science Educator'],
    keywords: ['biology', 'life science', 'ecology', 'genetics', 'microbiology'],
    tuition: 250000,
  },
  {
    code: 'BSC-GEO-01',
    name: 'BSc in Geology',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Studies earth materials, geological processes, mineral resources, and environmental geology.',
    departmentIndex: { facultyIdx: 3, deptIdx: 5 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Geography', 'Physics', 'Chemistry'],
      aLevel: ['Geography', 'Geology', 'Chemistry', 'Physics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Geologist', 'Mining Engineer', 'Environmental Consultant', 'Petroleum Geologist'],
    keywords: ['geology', 'earth science', 'mining', 'mineral', 'petroleum'],
    tuition: 250000,
  },
  {
    code: 'BSC-ENV-01',
    name: 'BSc in Environmental Science',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Interdisciplinary study of environmental systems, conservation, pollution control, and sustainability.',
    departmentIndex: { facultyIdx: 3, deptIdx: 6 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Biology', 'Chemistry', 'Geography'],
      aLevel: ['Biology', 'Chemistry', 'Geography'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Environmental Scientist', 'Conservation Officer', 'Sustainability Consultant', 'EIA Specialist'],
    keywords: ['environment', 'ecology', 'conservation', 'sustainability', 'climate'],
    tuition: 250000,
  },

  // ---- FALA - Arts ----
  {
    code: 'BA-ENG-01',
    name: 'BA in English',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Studies English literature, language, literary criticism, and creative writing.',
    departmentIndex: { facultyIdx: 4, deptIdx: 0 },
    requirements: {
      oLevel: ['English Language', 'Literature in English', 'Mathematics'],
      aLevel: ['Literature in English', 'English Language'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Writer', 'Editor', 'Teacher', 'Journalist', 'Content Creator'],
    keywords: ['english', 'literature', 'writing', 'creative', 'language'],
    tuition: 200000,
  },
  {
    code: 'BA-FREN-01',
    name: 'BA in French',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Studies French language, literature, francophone culture, and translation.',
    departmentIndex: { facultyIdx: 4, deptIdx: 1 },
    requirements: {
      oLevel: ['French Language', 'English Language', 'Literature in French'],
      aLevel: ['French Language', 'Literature in French'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['French Teacher', 'Translator', 'Interpreter', 'Diplomat', 'Linguist'],
    keywords: ['french', 'francais', 'language', 'translation', 'linguistics'],
    tuition: 200000,
  },
  {
    code: 'BA-HIST-01',
    name: 'BA in History',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Explores African, Cameroon, and world history, historiography, and historical research methods.',
    departmentIndex: { facultyIdx: 4, deptIdx: 2 },
    requirements: {
      oLevel: ['English Language', 'History', 'Mathematics'],
      aLevel: ['History', 'Literature in English', 'Economics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Historian', 'Teacher', 'Archivist', 'Museum Curator', 'Researcher'],
    keywords: ['history', 'historical', 'heritage', 'archive', 'civilization'],
    tuition: 200000,
  },
  {
    code: 'BA-GEOG-01',
    name: 'BA in Geography',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Studies human and physical geography, GIS, urban planning, and environmental management.',
    departmentIndex: { facultyIdx: 4, deptIdx: 3 },
    requirements: {
      oLevel: ['English Language', 'Geography', 'Mathematics'],
      aLevel: ['Geography', 'Economics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Geographer', 'Urban Planner', 'GIS Specialist', 'Environmental Manager'],
    keywords: ['geography', 'gis', 'urban', 'mapping', 'environmental'],
    tuition: 200000,
  },
  {
    code: 'BA-PHIL-01',
    name: 'BA in Philosophy',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Explores logic, ethics, metaphysics, epistemology, and history of philosophy.',
    departmentIndex: { facultyIdx: 4, deptIdx: 4 },
    requirements: {
      oLevel: ['English Language', 'Mathematics'],
      aLevel: ['Literature in English', 'History', 'Philosophy'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Philosopher', 'Teacher', 'Ethics Consultant', 'Writer', 'Researcher'],
    keywords: ['philosophy', 'ethics', 'logic', 'reasoning', 'critical thinking'],
    tuition: 200000,
  },
  {
    code: 'BA-SOC-01',
    name: 'BA in Sociology and Anthropology',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Studies social structures, cultural diversity, human behavior, and social research methods.',
    departmentIndex: { facultyIdx: 4, deptIdx: 5 },
    requirements: {
      oLevel: ['English Language', 'Mathematics'],
      aLevel: ['Sociology', 'Economics', 'History', 'Geography'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Sociologist', 'Social Worker', 'Researcher', 'NGO Coordinator', 'Policy Analyst'],
    keywords: ['sociology', 'anthropology', 'society', 'culture', 'social'],
    tuition: 200000,
  },
  {
    code: 'BA-ECON-01',
    name: 'BA in Economics',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Covers microeconomics, macroeconomics, econometrics, development economics, and international economics.',
    departmentIndex: { facultyIdx: 4, deptIdx: 6 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Economics'],
      aLevel: ['Economics', 'Mathematics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Economist', 'Financial Analyst', 'Policy Advisor', 'Banker', 'Data Analyst'],
    keywords: ['economics', 'economy', 'finance', 'development', 'policy'],
    tuition: 250000,
  },

  // ---- CBMS - Business ----
  {
    code: 'BSC-ACCT-01',
    name: 'BSc in Accounting',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Covers financial accounting, management accounting, auditing, taxation, and corporate finance.',
    departmentIndex: { facultyIdx: 8, deptIdx: 0 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Economics'],
      aLevel: ['Accounting', 'Economics', 'Mathematics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Accountant', 'Auditor', 'Tax Consultant', 'Financial Analyst', 'CFO'],
    keywords: ['accounting', 'accountant', 'audit', 'tax', 'finance', 'bookkeeping'],
    tuition: 300000,
  },
  {
    code: 'BSC-MGMT-01',
    name: 'BSc in Management',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Studies management principles, organizational behavior, human resources, and strategic management.',
    departmentIndex: { facultyIdx: 8, deptIdx: 1 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Economics'],
      aLevel: ['Economics', 'Accounting', 'Mathematics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Manager', 'HR Specialist', 'Consultant', 'Entrepreneur', 'Operations Manager'],
    keywords: ['management', 'business', 'hr', 'human resources', 'entrepreneurship'],
    tuition: 300000,
  },
  {
    code: 'BSC-MKT-01',
    name: 'BSc in Marketing',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Covers marketing principles, consumer behavior, digital marketing, brand management, and market research.',
    departmentIndex: { facultyIdx: 8, deptIdx: 2 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Economics'],
      aLevel: ['Economics', 'Commerce', 'Accounting'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Marketing Manager', 'Brand Manager', 'Digital Marketer', 'Sales Manager', 'Market Researcher'],
    keywords: ['marketing', 'brand', 'advertising', 'sales', 'digital marketing', 'social media'],
    tuition: 300000,
  },
  {
    code: 'BSC-BF-01',
    name: 'BSc in Banking and Finance',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Studies banking operations, financial markets, investment analysis, and risk management.',
    departmentIndex: { facultyIdx: 8, deptIdx: 3 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Economics'],
      aLevel: ['Economics', 'Mathematics', 'Accounting'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Banker', 'Financial Analyst', 'Investment Advisor', 'Risk Manager', 'Trader'],
    keywords: ['banking', 'finance', 'investment', 'financial', 'stock', 'trading'],
    tuition: 300000,
  },

  // ---- COLTECH - Technology ----
  {
    code: 'HND-ICT-01',
    name: 'HND in Information and Communication Technology',
    degree: 'HND',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Professional programme in ICT covering networking, web development, database management, and systems administration.',
    departmentIndex: { facultyIdx: 7, deptIdx: 0 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Physics'],
      aLevel: ['Mathematics', 'Computer Science', 'Physics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['IT Specialist', 'Network Administrator', 'Web Developer', 'Database Administrator', 'Systems Admin'],
    keywords: ['ict', 'information technology', 'networking', 'web', 'database', 'it'],
    tuition: 250000,
  },
  {
    code: 'HND-ELEC-01',
    name: 'HND in Electrical Engineering',
    degree: 'HND',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Professional programme covering electrical installation, power systems, and electrical maintenance.',
    departmentIndex: { facultyIdx: 7, deptIdx: 1 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Physics'],
      aLevel: ['Mathematics', 'Physics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Electrical Technician', 'Power Systems Technician', 'Electrical Supervisor'],
    keywords: ['electrical', 'power', 'installation', 'maintenance', 'technician'],
    tuition: 200000,
  },
  {
    code: 'HND-MECH-01',
    name: 'HND in Mechanical Engineering',
    degree: 'HND',
    level: 'UNDERGRADUATE',
    duration: 3,
    description:
      'Professional programme covering mechanical workshop, manufacturing, and maintenance.',
    departmentIndex: { facultyIdx: 7, deptIdx: 2 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Physics'],
      aLevel: ['Mathematics', 'Physics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Mechanical Technician', 'Workshop Supervisor', 'Manufacturing Technician'],
    keywords: ['mechanical', 'manufacturing', 'workshop', 'maintenance', 'technician'],
    tuition: 200000,
  },

  // ---- HTTTC Bambili ----
  {
    code: 'BED-SCI-01',
    name: 'BEd in Science Education',
    degree: 'BED',
    level: 'UNDERGRADUATE',
    duration: 4,
    description:
      'Trains secondary school science teachers in Biology, Chemistry, Physics, and Mathematics.',
    departmentIndex: { facultyIdx: 5, deptIdx: 0 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics'],
      aLevel: ['Biology', 'Chemistry', 'Physics', 'Mathematics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Science Teacher', 'Education Officer', 'Curriculum Developer', 'School Administrator'],
    keywords: ['education', 'teaching', 'teacher', 'science education', 'pedagogy'],
    tuition: 200000,
  },
  {
    code: 'BED-ART-01',
    name: 'BEd in Arts Education',
    degree: 'BED',
    level: 'UNDERGRADUATE',
    duration: 4,
    description:
      'Trains secondary school arts teachers in English, French, History, Geography, and related subjects.',
    departmentIndex: { facultyIdx: 5, deptIdx: 1 },
    requirements: {
      oLevel: ['English Language', 'Literature in English', 'French Language'],
      aLevel: ['Literature in English', 'French Language', 'History', 'Geography'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Arts Teacher', 'Education Officer', 'Curriculum Developer', 'Bilingual Educator'],
    keywords: ['education', 'teaching', 'arts', 'bilingual', 'teacher'],
    tuition: 200000,
  },
  {
    code: 'BED-BIL-01',
    name: 'BEd in Bilingual Studies',
    degree: 'BED',
    level: 'UNDERGRADUATE',
    duration: 4,
    description:
      'Trains teachers for bilingual education with proficiency in both English and French.',
    departmentIndex: { facultyIdx: 5, deptIdx: 2 },
    requirements: {
      oLevel: ['English Language', 'French Language', 'Literature in English', 'Literature in French'],
      aLevel: ['English Language', 'French Language', 'Literature in English', 'Literature in French'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Bilingual Teacher', 'Translator', 'Education Officer', 'Language Instructor'],
    keywords: ['bilingual', 'education', 'english', 'french', 'teaching', 'language'],
    tuition: 200000,
  },

  // ---- Masters Programmes ----
  {
    code: 'MSC-CS-01',
    name: 'MSc in Computer Science',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description:
      'Advanced study in algorithms, machine learning, data science, software architecture, and research methods.',
    departmentIndex: { facultyIdx: 3, deptIdx: 0 },
    requirements: {
      oLevel: ['English Language', 'Mathematics'],
      aLevel: ['Mathematics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Senior Software Engineer', 'Machine Learning Engineer', 'Research Scientist', 'CTO'],
    keywords: ['masters', 'computer science', 'advanced', 'machine learning', 'research'],
    tuition: 500000,
  },
  {
    code: 'MSC-ECON-01',
    name: 'MSc in Economics',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description:
      'Advanced economic theory, econometrics, development economics, and policy analysis.',
    departmentIndex: { facultyIdx: 4, deptIdx: 6 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Economics'],
      aLevel: ['Economics', 'Mathematics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Senior Economist', 'Policy Advisor', 'Researcher', 'University Lecturer'],
    keywords: ['masters', 'economics', 'advanced', 'econometrics', 'policy'],
    tuition: 500000,
  },
  {
    code: 'MSC-PH-01',
    name: 'Master of Public Health (MPH)',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description:
      'Advanced public health training in epidemiology, biostatistics, health policy, and global health.',
    departmentIndex: { facultyIdx: 0, deptIdx: 3 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Biology'],
      aLevel: ['Biology', 'Chemistry'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Public Health Director', 'Epidemiologist', 'Health Policy Advisor', 'Global Health Specialist'],
    keywords: ['masters', 'public health', 'mph', 'epidemiology', 'health policy'],
    tuition: 600000,
  },
  {
    code: 'MA-POL-01',
    name: 'MA in Political Science',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description:
      'Advanced study in political theory, comparative politics, international relations, and governance.',
    departmentIndex: { facultyIdx: 2, deptIdx: 1 },
    requirements: {
      oLevel: ['English Language', 'Mathematics'],
      aLevel: ['History', 'Economics', 'Literature in English'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['Political Analyst', 'Policy Advisor', 'University Lecturer', 'Researcher'],
    keywords: ['masters', 'political science', 'governance', 'policy', 'research'],
    tuition: 450000,
  },

  // ---- PhD Programmes ----
  {
    code: 'PHD-CS-01',
    name: 'PhD in Computer Science',
    degree: 'PHD',
    level: 'DOCTORATE',
    duration: 4,
    description:
      'Original research in computer science leading to a doctoral dissertation.',
    departmentIndex: { facultyIdx: 3, deptIdx: 0 },
    requirements: {
      oLevel: ['English Language', 'Mathematics'],
      aLevel: ['Mathematics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['University Professor', 'Research Scientist', 'Senior Researcher', 'Chief Scientist'],
    keywords: ['phd', 'doctorate', 'computer science', 'research', 'professor'],
    tuition: 800000,
  },
  {
    code: 'PHD-ECON-01',
    name: 'PhD in Economics',
    degree: 'PHD',
    level: 'DOCTORATE',
    duration: 4,
    description:
      'Advanced research in economic theory, development economics, or econometrics.',
    departmentIndex: { facultyIdx: 4, deptIdx: 6 },
    requirements: {
      oLevel: ['English Language', 'Mathematics', 'Economics'],
      aLevel: ['Economics', 'Mathematics'],
      oLevelPasses: 4,
      aLevelPasses: 2,
      minGrades: { oLevel: 'C6', aLevel: 'C' },
    },
    careers: ['University Professor', 'Senior Economist', 'Research Director', 'Policy Advisor'],
    keywords: ['phd', 'doctorate', 'economics', 'research', 'professor'],
    tuition: 800000,
  },
];

// ==========================================
// GENERAL ADMISSION RULES
// ==========================================

export const generalAdmissionRules = [
  {
    title: 'Minimum O Level Requirements',
    description:
      'All applicants must have at least four (4) O Level passes including English Language and Mathematics.',
  },
  {
    title: 'Minimum A Level Requirements',
    description:
      'All applicants must have at least two (2) A Level passes in subjects relevant to their chosen programme.',
  },
  {
    title: 'English Proficiency',
    description:
      'All applicants must demonstrate proficiency in English Language with at least a C6 at O Level.',
  },
  {
    title: 'Mathematics Remediation Policy',
    description:
      'Applicants who do not have a pass in Mathematics may be admitted conditionally with a requirement to take remedial mathematics.',
  },
  {
    title: 'Direct Entry Requirements',
    description:
      'Direct Entry applicants must hold a recognised diploma or HND in a related field with at least a Lower Credit.',
  },
  {
    title: 'Conversion Programme Rules',
    description:
      'Applicants for conversion programmes must have a first degree in a related discipline with at least a Second Class Lower.',
  },
];

// ==========================================
// COMMON SEARCH KEYWORDS (not programme-specific)
// ==========================================

export const commonKeywords = [
  'study',
  'admission',
  'undergraduate',
  'postgraduate',
  'degree',
  'program',
  'programme',
  'course',
  'school',
  'university',
  'education',
  'training',
  'bachelor',
  'master',
  'doctorate',
  'engineering',
  'science',
  'arts',
  'law',
  'business',
  'medicine',
  'nursing',
  'teaching',
  'technology',
  'health',
  'social sciences',
  'humanities',
];

