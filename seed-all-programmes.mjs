// ============================================================
// Consolidated Seed Script: All University Programmes
// ============================================================
// Run: node seed-all-programmes.mjs
// Adds all programmes across ALL faculties in one go.
// ============================================================

const API = 'http://localhost:3001/api';

// ============================================================
// DEPARTMENT IDs (from existing database)
// ============================================================
const COLTECH = {
  AGRITECH: 'cmrxq8t4a001itokcbym73zdi', // Agribusiness Technology
};

const FA = {
  CDS: 'cmrxq8t5i0020tokcmxn1z6ku',   // Communication and Development Studies
  ENG: 'cmrxq8t5m0022tokc9i0ytzcl',   // English
  ELDIC: 'cmrxq8t5o0023tokc42sne97p', // English, Literature and Digital Cultures
  GP: 'cmrxq8t5q0024tokczskqpw23',    // Geography and Planning
  HISA: 'cmrxq8t5s0025tokc0gp420ez',  // History, Heritage and International Studies
  LAL: 'cmrxq8t5u0026tokcn74rxqgm',   // Linguistics and African Languages
  PVA: 'cmrxq8t5w0027tokc7zp2pyyh',   // Performing and Visual Arts
  PHI: 'cmrxq8t5y0028tokcrae1uxys',   // Philosophy
  UBALAC: 'cmrxq8t62002atokchvckh5oo', // University of Bamenda Language Center
};

const FEMS = {
  ACC: 'cmrxq8t66002ctokciq75a1ow', // Accounting
  BNF: 'cmrxq8t68002dtokchr0w8pua', // Banking and Finance
  ECN: 'cmrxq8t6b002ftokclr8fn7si', // Economics
  MGT: 'cmrxq8t6d002gtokcd4dhu3v3', // Management
};

const FLPS = {
  CAPA: 'cmrxq8t7w0034tokcrcsijmcd', // Capacité en Droit
  EPL: 'cmrxq8t7y0035tokchtk5vtqh',  // English Private Law
  FPL: 'cmrxq8t800036tokcdsj4rjwc',  // French Private Law
  PUL: 'cmrxq8t840038tokczr86yy7b',  // Public Law
  POLS: 'cmrxq8t820037tokccmdybeij', // Political Science
};

// ============================================================
// ALL PROGRAMMES
// ============================================================
const programmes = [
  // ==================== COLTECH (College of Technology) ====================
  {
    name: 'MSc Agribusiness Marketing Management',
    code: 'ABMM',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'B.Sc degree in Agriculture, Agricultural Economics, Agribusiness, Economics, Management, Marketing, Geography, or Mathematics. Fees: 50,000 XAF per year.',
    departmentId: COLTECH.AGRITECH,
  },
  {
    name: 'MSc Agribusiness Project Management',
    code: 'ABPM',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'B.Sc degree in Agriculture, Agricultural Economics, Agribusiness, Economics, Management, Marketing, Geography, or Mathematics. Fees: 50,000 XAF per year.',
    departmentId: COLTECH.AGRITECH,
  },
  {
    name: 'MSc Agribusiness, Food Systems and Policy',
    code: 'ABAP',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Bachelor of Science (B.Sc.) Degree with at least Second Class Lower in Agribusiness, Agricultural Sciences, Economics, Marketing, Management, Accounting, Development Studies, Communication, Geography, Political Science, or other closely related Social Science and Humanities disciplines. Fees: 50,000 XAF per year.',
    departmentId: COLTECH.AGRITECH,
  },

  // ==================== FACULTY OF ARTS (FA) ====================
  // Communication and Development Studies
  {
    name: 'B.Sc. Communication and Development Studies',
    code: 'CDS',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 4,
    description: 'GCE A/L in at least two (2) subjects obtained in one sitting or Baccalaureate or equivalent. GCE O/L in at least four (4) subjects including English Language or Probatoire with a pass in English. Candidates without O/L English may take the University English Proficiency Test. Fees: 50,000 XAF.',
    departmentId: FA.CDS,
  },

  // Geography and Planning
  {
    name: 'B.Sc. Geography and Planning',
    code: 'GP',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects obtained in one sitting or Baccalaureate or equivalent. GCE O/L in at least four (4) subjects including English Language or Probatoire with a pass in English. Candidates without O/L English may take the University English Proficiency Test. Fees: 50,000 XAF.',
    departmentId: FA.GP,
  },
  {
    name: 'M.Sc. Geography and Planning',
    code: 'MGP',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Good B.Sc. in Geography or related discipline (minimum Second Class Lower). Fees: 50,000 XAF.',
    departmentId: FA.GP,
  },

  // History, Heritage and International Studies
  {
    name: 'BA History and Archaeology',
    code: 'HARA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects or equivalent. GCE O/L in at least four (4) subjects including English. English Proficiency Test available where applicable. Fees: 50,000 XAF.',
    departmentId: FA.HISA,
  },
  {
    name: 'BA Economic and Social Development History',
    code: 'HESA-BA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Minimum of four O/L papers and two A/L papers. Fees: 50,000 XAF.',
    departmentId: FA.HISA,
  },
  {
    name: 'BA Heritage and Cultural History',
    code: 'HICA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Minimum of four O/L papers and two A/L papers. Fees: 50,000 XAF.',
    departmentId: FA.HISA,
  },
  {
    name: 'BA International Studies',
    code: 'HISA-BA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Minimum of four O/L papers and two A/L papers. Fees: 50,000 XAF.',
    departmentId: FA.HISA,
  },
  {
    name: 'MA Environmental History',
    code: 'HESA-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'BA (Hons) in History or related Humanities/Social Science discipline from a recognized university. Fees: 50,000 XAF.',
    departmentId: FA.HISA,
  },
  {
    name: 'MA Heritage and Cultural History',
    code: 'HEVA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'BA (Hons) in History or related Humanities/Social Science discipline from a recognized university. Fees: 50,000 XAF.',
    departmentId: FA.HISA,
  },
  {
    name: 'MA History and Public Policy (Decentralization and Local Governance)',
    code: 'HIPA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'BA (Hons) in History or related Humanities/Social Science discipline from a recognized university. Fees: 50,000 XAF.',
    departmentId: FA.HISA,
  },

  // English
  {
    name: 'BA English Language',
    code: 'ENG',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects or equivalent. GCE O/L in at least four (4) subjects including English. English Proficiency Test available where applicable. Fees: 50,000 XAF.',
    departmentId: FA.ENG,
  },
  {
    name: 'BA Literatures in English',
    code: 'LITA-BA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects or equivalent. GCE O/L in at least four (4) subjects including English. English Proficiency Test available where applicable. Fees: 50,000 XAF.',
    departmentId: FA.ENG,
  },
  {
    name: 'MA Literatures in English',
    code: 'LITA-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'At least Second Class Lower BA in Literature or equivalent. Fees: 50,000 XAF.',
    departmentId: FA.ENG,
  },
  {
    name: 'MA English Language and Literature Teaching',
    code: 'LLTA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 1,
    description: "Bachelor's degree in Education, Arts, Social Sciences or Humanities plus an Advanced/Post-Bachelor Diploma in Education (e.g. DIPES II). Fees: 520,000 XAF.",
    departmentId: FA.ENG,
  },

  // Linguistics and African Languages
  {
    name: 'BA Linguistics and African Languages',
    code: 'LANA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects or equivalent. GCE O/L in at least four (4) subjects including English. English Proficiency Test available where applicable. Fees: 50,000 XAF.',
    departmentId: FA.LAL,
  },
  {
    name: 'MA Applied Linguistics',
    code: 'APL',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'BA in Linguistics or Language-related field (minimum GPA 2.5). Knowledge of an African language is an advantage.',
    departmentId: FA.LAL,
  },

  // Performing and Visual Arts
  {
    name: 'BA Theatre, Television and Film Studies',
    code: 'TTFS-BA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects or equivalent. GCE O/L in at least four (4) subjects including English. English Proficiency Test available where applicable. Fees: 50,000 XAF.',
    departmentId: FA.PVA,
  },
  {
    name: 'BA Visual Arts and History of Arts',
    code: 'VAHA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects or equivalent. GCE O/L in at least four (4) subjects including English. English Proficiency Test available where applicable. Fees: 50,000 XAF.',
    departmentId: FA.PVA,
  },
  {
    name: 'MA Theatre, Television and Film Studies',
    code: 'TTFS-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Good undergraduate degree (minimum Second Class Lower) in Theatre, Television and Film Studies or related field.',
    departmentId: FA.PVA,
  },

  // Philosophy
  {
    name: 'MA Philosophy',
    code: 'PHI-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'BA or equivalent in Philosophy with at least Second Class Lower. Fees: 50,000 XAF.',
    departmentId: FA.PHI,
  },

  // University of Bamenda Language Center
  {
    name: 'BA Translation and Interpretation',
    code: 'LACTI',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Pass in A/L French, English Language or Literature in English (A1 Series) or BAC 4. Fees: 50,000 XAF (Cameroon/CEMAC); 300,000 XAF (Non-CEMAC).',
    departmentId: FA.UBALAC,
  },
  {
    name: 'BA Intercultural Communication and Mediation',
    code: 'LCIC',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L or BAC in any field. Language background not compulsory. Working experience is an advantage. Fees: 50,000 XAF (Cameroon/CEMAC); 300,000 XAF (Non-CEMAC).',
    departmentId: FA.UBALAC,
  },

  // English, Literature and Digital Cultures
  {
    name: 'BA English Language, Literature and Digital Cultures',
    code: 'ELDA-BA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects or equivalent. GCE O/L in at least four (4) subjects including English. English Proficiency Test available where applicable. Fees: 50,000 XAF.',
    departmentId: FA.ELDIC,
  },
  {
    name: 'MA English Language and Digital Cultures',
    code: 'ELDA-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'BA in English or Language-related field with at least Second Class Lower. Knowledge of an African language is an advantage.',
    departmentId: FA.ELDIC,
  },

  // ==================== FACULTY OF ECONOMICS & MANAGEMENT SCIENCES (FEMS) ====================
  // Accounting
  {
    name: 'B.Sc. Accounting',
    code: 'ACC',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Four O/L subjects including English and Mathematics; at least two A/L subjects (Economics preferred) or BAC equivalent. Direct Entry available for BBA, HND, DIPES I, DIPET I or equivalent. Fees: 50,000 XAF.',
    departmentId: FEMS.ACC,
  },
  {
    name: 'Conversion M.Sc. Accounting',
    code: 'CACC',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 1,
    description: "Professional Master's (MBA, DIPES II, DIPET II or equivalent) plus B.Sc. in Accounting or related field. Registration: 50,000 XAF; Programme Fee: 500,000 XAF.",
    departmentId: FEMS.ACC,
  },
  {
    name: 'M.Sc. Accounting',
    code: 'MACC',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Second Class Lower B.Sc. in Accounting or equivalent. Additional courses may be required. Fees: 50,000 XAF.',
    departmentId: FEMS.ACC,
  },

  // Economics
  {
    name: 'B.Sc. Economics',
    code: 'ECN',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Two A/L subjects (Economics preferred), four O/L subjects including English and Mathematics or BAC equivalent. Direct Entry available. English Proficiency Test available where applicable. Fees: 50,000 XAF.',
    departmentId: FEMS.ECN,
  },
  {
    name: 'Conversion M.Sc. Economics',
    code: 'CECN',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 1,
    description: "Professional Master's (MBA, DIPES II, DIPET II or equivalent) plus Bachelor's degree in related field. Registration: 25,000 XAF; Programme Fee: 500,000 XAF.",
    departmentId: FEMS.ECN,
  },
  {
    name: 'M.Sc. Economics',
    code: 'MECN',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Second Class Lower B.Sc. in Economics, Accounting or equivalent. Additional courses may be required. Registration: 25,000 XAF; Fees: 50,000 XAF.',
    departmentId: FEMS.ECN,
  },
  {
    name: 'Masters in Health Economics, Policy and Management',
    code: 'HEPM',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's degree in any recognized discipline. Additional undergraduate courses may be required. Registration: 25,000 XAF; Programme Fee: 600,000 XAF.",
    departmentId: FEMS.ECN,
  },
  {
    name: 'Masters in Environmental Economics, Policy and Management',
    code: 'MEEPM',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's degree in any recognized discipline. Additional undergraduate courses may be required. Registration: 25,000 XAF; Programme Fee: 600,000 XAF.",
    departmentId: FEMS.ECN,
  },

  // Management
  {
    name: 'B.Sc. Management',
    code: 'MGT-BA',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Two A/L subjects with O/L English and Mathematics or BAC equivalent. Direct Entry available for BBA, HND, DIPES I, DIPET I or equivalent. Fees: 50,000 XAF.',
    departmentId: FEMS.MGT,
  },
  {
    name: 'Conversion M.Sc. Management',
    code: 'CMGT',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 1,
    description: 'MBA, DIPES II, DIPET II or equivalent plus Bachelor\'s degree in Management or related field. Registration: 25,000 XAF; Programme Fee: 500,000 XAF.',
    departmentId: FEMS.MGT,
  },
  {
    name: 'M.Sc. Management',
    code: 'MMGT',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's degree in Management or related field. DIPES II/DIPET II holders with B.Sc. may register. Registration: 25,000 XAF; Fees: 50,000 XAF.",
    departmentId: FEMS.MGT,
  },
  {
    name: 'B.Sc. Marketing',
    code: 'MKTG',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Two A/L subjects or BAC equivalent. Four O/L subjects including English and Mathematics. English Proficiency Test available where applicable.',
    departmentId: FEMS.MGT,
  },
  {
    name: 'M.Sc. Marketing',
    code: 'MKT-MA',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's degree in Management or related field. DIPES II/DIPET II holders with B.Sc. may register. Registration: 25,000 XAF; Fees: 50,000 XAF.",
    departmentId: FEMS.MGT,
  },
  {
    name: 'Conversion M.Sc. Marketing',
    code: 'CMKT',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 1,
    description: "Bachelor's degree in Marketing or related field. Registration: 25,000 XAF; Programme Fee: 500,000 XAF.",
    departmentId: FEMS.MGT,
  },
  {
    name: 'Masters in Human Resource Management',
    code: 'MHRM',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'B.Sc., BBA, B.Tech., DIPES I, DIPET I or equivalent in any recognized discipline. Registration: 25,000 XAF; Programme Fee: 600,000 XAF.',
    departmentId: FEMS.MGT,
  },
  {
    name: 'Masters in Finance and Investment',
    code: 'MFI',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's degree with minimum GPA of 2.5 in a related field or equivalent. Registration: 25,000 XAF; Programme Fee: 600,000 XAF.",
    departmentId: FEMS.MGT,
  },

  // Banking and Finance
  {
    name: 'B.Sc. Banking and Finance',
    code: 'BNF',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Two A/L subjects or BAC equivalent. Four O/L subjects including English and Mathematics. Direct Entry for HND, B.Tech., BA, DIPET I or transfer students. Fees: 50,000 XAF.',
    departmentId: FEMS.BNF,
  },
  {
    name: 'M.Sc. Quantitative Finance',
    code: 'QF',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's degree in a related field.",
    departmentId: FEMS.BNF,
  },
  {
    name: 'Bachelor of Science in Islamic Banking and Finance',
    code: 'IBF',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Four O/L subjects including English and Mathematics/Statistics and two A/L subjects excluding Religious Studies. Fees: 50,000 XAF.',
    departmentId: FEMS.BNF,
  },
  {
    name: 'Conversion M.Sc. Banking and Finance',
    code: 'CBAF',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 1,
    description: 'MBA, DIPES II, DIPET II or equivalent plus Bachelor\'s degree in Banking and Finance or related field. Registration: 25,000 XAF; Programme Fee: 500,000 XAF.',
    departmentId: FEMS.BNF,
  },
  {
    name: 'M.Sc. Banking and Finance',
    code: 'MBF',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Second Class Lower B.Sc. in Banking and Finance, Economics, Accounting or equivalent. Additional courses may be required. Registration: 25,000 XAF; Fees: 50,000 XAF.',
    departmentId: FEMS.BNF,
  },

  // ==================== FACULTY OF LAW & POLITICAL SCIENCE (FLPS) ====================
  // English Private Law
  {
    name: 'English Private Law',
    code: 'EPLW',
    degree: 'LLB',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Four Ordinary Level papers excluding Religious Studies but including English Language. BEPC and Probatoire. Two Advanced Level subjects obtained in one sitting excluding Religious Studies or Baccalaureate. Capacité en Droit. Fees: 50,000 FRS.',
    departmentId: FLPS.EPL,
  },
  {
    name: 'Masters in English Private Law',
    code: 'LLM-EPLW',
    degree: 'LLB',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'LL.B (Hons) in Public Law (Second Class Lower). LL.B (Hons) in Private Law depending on the electives and minors of the candidate. Licence en Droit Public with at least an Assez-Bien. PGD in Law or Maîtrise in Law. Tuition Fee: 50,000 CFA per year.',
    departmentId: FLPS.EPL,
  },
  {
    name: 'Conversion Masters in English Private Law',
    code: 'EPLL',
    degree: 'LLB',
    level: 'POSTGRADUATE',
    duration: 1,
    description: "Professional Master's Degree in any field of Law, or equivalent qualification in a related field, or as may be specifically defined by the Department at the time of admission. Registration: 25,000 FRS. Tuition: 500,000 FRS.",
    departmentId: FLPS.EPL,
  },

  // Public Law
  {
    name: 'LL.B Public Law',
    code: 'PUL',
    degree: 'LLB',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Four Ordinary Level papers excluding Religious Studies but including English Language. BEPC and Probatoire with a pass in English Language. Two Advanced Level subjects obtained in one sitting excluding Religious Studies. Baccalaureate. Holders of a Capacité en Droit. Fees: 50,000 FRS.',
    departmentId: FLPS.PUL,
  },
  {
    name: 'LL.M. in Public Law',
    code: 'LLM-PULL',
    degree: 'LLB',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'LL.B (Hons) in Public Law (Second Class Lower). LL.B (Hons) in Private Law depending on the electives and minors of the candidate. Licence en Droit Public with at least an Assez-Bien. PGD in Law or Maîtrise in Law. Tuition Fee: 50,000 CFA per year.',
    departmentId: FLPS.PUL,
  },

  // Capacité en Droit
  {
    name: 'Capacité en Droit',
    code: 'CAP',
    degree: 'DIPLOMA',
    level: 'UNDERGRADUATE',
    duration: 2,
    description: 'GCE A/L in at least two (2) subjects obtained in one sitting or Baccalaureate or its equivalent. GCE O/L in at least five (5) subjects including English Language or Probatoire with a pass mark in English Language or its equivalent. Fees: 150,000 FRS.',
    departmentId: FLPS.CAPA,
  },

  // Political Science
  {
    name: 'BSc Political Science',
    code: 'POLS',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Holders of GCE A/L in at least two (2) papers obtained in one sitting, excluding Religious Studies, or BAC (A, B, C, D, G2, G3) with a pass in English Language at the Probatoire. Four Ordinary Level papers in one sitting excluding Religious Studies, including English Language. Capacité en Droit. Fees: 50,000 FRS.',
    departmentId: FLPS.POLS,
  },

  // French Private Law
  {
    name: 'French Private Law',
    code: 'FPLW',
    degree: 'LLB',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Four Ordinary Level papers excluding Religious Studies but including English Language. BEPC and Probatoire with a pass in English Language. Two Advanced Level subjects obtained in one sitting excluding Religious Studies. Baccalaureate. Holders of a Capacité en Droit. Fees: 50,000 FRS.',
    departmentId: FLPS.FPL,
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ngumkan@gmail.com', password: 'kan2026' }),
  });
  const data = await res.json();
  if (!data.success) throw new Error('Login failed: ' + JSON.stringify(data));
  console.log('✅ Logged in as admin\n');
  return data.data.token;
}

function getFacultyByDepartment(departmentId) {
  const all = { ...COLTECH, ...FA, ...FEMS, ...FLPS };
  const entry = Object.entries(all).find(([, id]) => id === departmentId);
  if (!entry) return 'UNKNOWN';
  // Map department abbreviations to faculty names
  const facultyMap = {
    AGRITECH: 'COLTECH',
    CDS: 'FA', ENG: 'FA', ELDIC: 'FA', GP: 'FA', HISA: 'FA',
    LAL: 'FA', PVA: 'FA', PHI: 'FA', UBALAC: 'FA',
    ACC: 'FEMS', BNF: 'FEMS', ECN: 'FEMS', MGT: 'FEMS',
    CAPA: 'FLPS', EPL: 'FLPS', FPL: 'FLPS', PUL: 'FLPS', POLS: 'FLPS',
  };
  return facultyMap[entry[0]] || 'UNKNOWN';
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  const token = await login();

  console.log('═'.repeat(60));
  console.log('  UNIVERSITY PROGRAMMES SEED SCRIPT');
  console.log('═'.repeat(60));
  console.log(`\n📋 Total programmes to process: ${programmes.length}\n`);

  // Group by faculty for summary
  const facultyGroups = {};
  for (const prog of programmes) {
    const faculty = getFacultyByDepartment(prog.departmentId);
    if (!facultyGroups[faculty]) facultyGroups[faculty] = [];
    facultyGroups[faculty].push(prog);
  }

  console.log('Faculty breakdown:');
  for (const [faculty, progs] of Object.entries(facultyGroups)) {
    console.log(`  📚 ${faculty}: ${progs.length} programmes`);
  }
  console.log('');

  const results = { added: 0, skipped: 0, errors: 0 };

  for (let i = 0; i < programmes.length; i++) {
    const prog = programmes[i];
    const faculty = getFacultyByDepartment(prog.departmentId);
    const prefix = `[${faculty}]`;

process.stdout.write(`  ${i + 1}/${programmes.length} ${prefix} ${prog.code} - ${prog.name.substring(0, 50)}... `);

    try {
      const res = await fetch(`${API}/admin/programmes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(prog),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text }; }

      if (res.ok && data.success) {
        console.log(`✅ ID: ${data.data.id}`);
        results.added++;
      } else if (res.status === 500 || (data.message && data.message.includes('already exists'))) {
        // 500 with plain Error means duplicate (NestJS throws generic Error for uniqueness)
        console.log(`⚠️  Already exists`);
        results.skipped++;
      } else {
        console.log(`❌ ${data.message || text.substring(0, 80)}`);
        results.errors++;
      }
    } catch (err) {
      console.log(`❌ Network error: ${err.message}`);
      results.errors++;
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('  SUMMARY');
  console.log('═'.repeat(60));
  console.log(`  ✅ Added:   ${results.added}`);
  console.log(`  ⚠️  Skipped: ${results.skipped} (already exist)`);
  console.log(`  ❌ Errors:  ${results.errors}`);
  console.log(`  📊 Total:   ${programmes.length} programmes`);
  console.log('═'.repeat(60));
}

main().catch(console.error);

