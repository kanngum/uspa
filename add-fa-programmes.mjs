// Add Faculty of Arts (FA) programmes to database
const API = 'http://localhost:3001/api';

// Department IDs for Faculty of Arts
const DEPARTMENTS = {
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

const programmes = [
  // Communication and Development Studies
  {
    name: 'B.Sc. Communication and Development Studies',
    code: 'CDS',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 4,
    description: 'GCE A/L in at least two (2) subjects obtained in one sitting or Baccalaureate or its Equivalence. GCE O/L in at least four (4) subjects including English Language or Probatoire with a pass mark in English Language or its Equivalence. NB: Candidates without a pass in English Language at the Ordinary Level or Probatoire are allowed to apply and take an English Language Proficiency Test that will be organised by The University of Bamenda. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.CDS,
  },
  // Geography and Planning
  {
    name: 'BSc. Geography and Planning',
    code: 'GP',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects obtained in one sitting or Baccalaureate or its Equivalence. GCE O/L in at least four (4) subjects including English Language or Probatoire with a pass mark in English Language or its Equivalence. NB: Candidates without a pass in English Language at the Ordinary Level or Probatoire are allowed to apply and take an English Language Proficiency Test that will be organised by The University of Bamenda. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.GP,
  },
  {
    name: 'MSc. Geography and Planning',
    code: 'MGP',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Admission into the MSc Geography and Planning is open to candidates with a good BSc degree in Geography and other related disciplines (minimum of Second Class Honours Lower Division). Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.GP,
  },
  // History, Heritage and International Studies
  {
    name: 'BA. History and Archaeology',
    code: 'HARA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects obtained in one sitting or Baccalaureate or its Equivalence. GCE O/L in at least four (4) subjects including English Language or Probatoire with a pass mark in English Language or its Equivalence. NB: Candidates without a pass in English Language at the Ordinary Level or Probatoire are allowed to apply and take an English Language Proficiency Test. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.HISA,
  },
  {
    name: 'BA. Economic and Social Development History',
    code: 'HESA-BA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Minimum of Four Ordinary Level and Two Advanced Level Papers. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.HISA,
  },
  {
    name: 'BA. Heritage and Cultural History',
    code: 'HICA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Minimum of Four Ordinary Level and Two Advanced Level Papers. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.HISA,
  },
  {
    name: 'BA. International Studies',
    code: 'HISA-BA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Minimum of Four Ordinary Level and Two Advanced Level Papers. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.HISA,
  },
  {
    name: 'MA. Environmental History',
    code: 'HESA-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Candidates for this degree should fulfill the following requirements: a) BA (Hons) Degree in History or any related discipline in the Humanities (Law, Political Science, Anthropology, Sociology, Philosophy, Geography) and Social Sciences (Education and Management Sciences) or its equivalent from any recognized university. Fees: 50,000 FRS CFA.',
    departmentId: DEPARTMENTS.HISA,
  },
  {
    name: 'MA. Heritage and Cultural History',
    code: 'HEVA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Candidates for this degree should fulfill the following requirements: a) BA (Hons) Degree in History or any related discipline in the Humanities (Law, Political Science, Anthropology, Sociology, Philosophy, Geography) and Social Sciences (Education and Management Sciences) or its equivalent from any recognized university. Fees: 50,000 FRS CFA.',
    departmentId: DEPARTMENTS.HISA,
  },
  {
    name: 'MA. History and Public Policy: Option - Decentralization and Local Governance',
    code: 'HIPA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Candidates for this degree should fulfill the following requirements: a) BA (Hons) Degree in History or any related discipline in the Humanities (Law, Political Science, Anthropology, Sociology, Philosophy, Geography) and Social Sciences (Education and Management Sciences) or its equivalent from any recognized university. Fees: 50,000 FRS CFA.',
    departmentId: DEPARTMENTS.HISA,
  },
  // English
  {
    name: 'BA. English Language',
    code: 'ENG',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects obtained in one sitting or Baccalaureate or its Equivalence. GCE O/L in at least four (4) subjects including English Language or Probatoire with a pass mark in English Language or its Equivalence. NB: Candidates without a pass in English Language at the Ordinary Level or Probatoire are allowed to apply and take an English Language Proficiency Test. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.ENG,
  },
  {
    name: 'BA. Literatures in English',
    code: 'LITA-BA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects obtained in one sitting or Baccalaureate or its Equivalence. GCE O/L in at least four (4) subjects including English Language or Probatoire with a pass mark in English Language or its Equivalence. NB: Candidates without a pass in English Language at the Ordinary Level or Probatoire are allowed to apply and take an English Language Proficiency Test. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.ENG,
  },
  {
    name: 'MA. Literatures in English',
    code: 'LITA-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Applicants for this degree should fulfil the following requirements: a) hold at least a Second Class Lower Division in Arts in Literature or its equivalence in the area of specialization from any recognized University. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.ENG,
  },
  {
    name: 'MA. English Language and Literature Teaching',
    code: 'LLTA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 1,
    description: '1. A Bachelor in any area of education, arts, social sciences and humanities. 2. An advanced or post bachelor diploma in education like the DIPES II. Fees: 520,000 FRS.',
    departmentId: DEPARTMENTS.ENG,
  },
  // Linguistics and African Languages
  {
    name: 'BA. Linguistics and African Languages',
    code: 'LANA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects obtained in one sitting or Baccalaureate or its Equivalence. GCE O/L in at least four (4) subjects including English Language or Probatoire with a pass mark in English Language or its Equivalence. NB: Candidates without a pass in English Language at the Ordinary Level or Probatoire are allowed to apply and take an English Language Proficiency Test. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.LAL,
  },
  {
    name: 'MA. Applied Linguistics',
    code: 'APL',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'A BA in a Language or Linguistics related area. For the MA Degree in Applied Linguistics, a BA Degree in Linguistics or any Language is a pre-requisite with at least a 2.5. For all the MA Degree programmes, additional knowledge of an African Language will be an advantage.',
    departmentId: DEPARTMENTS.LAL,
  },
  // Performing and Visual Arts
  {
    name: 'BA. Theatre, Television and Film Studies',
    code: 'TTFS-BA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects obtained in one sitting or Baccalaureate or its Equivalence. GCE O/L in at least four (4) subjects including English Language or Probatoire with a pass mark in English Language or its Equivalence. NB: Candidates without a pass in English Language at the Ordinary Level or Probatoire are allowed to apply and take an English Language Proficiency Test. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.PVA,
  },
  {
    name: 'BA. Visual Arts and History of Arts',
    code: 'VAHA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects obtained in one sitting or Baccalaureate or its Equivalence. GCE O/L in at least four (4) subjects including English Language or Probatoire with a pass mark in English Language or its Equivalence. NB: Candidates without a pass in English Language at the Ordinary Level or Probatoire are allowed to apply and take an English Language Proficiency Test. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.PVA,
  },
  {
    name: 'MA. Theatre, Television and Film Studies',
    code: 'TTFS-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'A good undergraduate Degree (Second Class Lower [2.2] or Mention Assez-Bien) in Theatre, Television and Film Studies or any related area.',
    departmentId: DEPARTMENTS.PVA,
  },
  // Philosophy
  {
    name: 'MA. Philosophy',
    code: 'PHI-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Candidates admitted for the Master\'s program in Philosophy must have obtained a BA (or equivalent) in Philosophy with a grade of at least Second Class Lower (14/20, Good, Bene Probatus). Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.PHI,
  },
  // University of Bamenda Language Center
  {
    name: 'BA. Translation and Interpretation',
    code: 'LACTI',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'A pass in A/L French, English Language or English Literature/Literature in English. (A1 Series) or BAC 4. Fees: CFA FRS 50,000 FRS for Cameroon and CEMAC students. CFA FRS 300,000 FRS for non-CEMAC zone students.',
    departmentId: DEPARTMENTS.UBALAC,
  },
  {
    name: 'BA. Intercultural Communication and Mediation',
    code: 'LCIC',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Candidates must be holders of the GCE Advanced Level or the BAC, in any field of studies. Candidates without a language background will be taught English, French and any third language within the programme. Working experience is also an added advantage. Fees: CFA FRS 50,000 FRS for Cameroon and CEMAC students. CFA FRS 300,000 FRS for non-CEMAC students.',
    departmentId: DEPARTMENTS.UBALAC,
  },
  // English, Literature and Digital Cultures
  {
    name: 'English Language, Literature and Digital Cultures',
    code: 'ELDA-BA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE A/L in at least two (2) subjects obtained in one sitting or Baccalaureate or its Equivalence. GCE O/L in at least four (4) subjects including English Language or Probatoire with a pass mark in English Language or its Equivalence. NB: Candidates without a pass in English Language at the Ordinary Level or Probatoire are allowed to apply and take an English Language Proficiency Test. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.ELDIC,
  },
  {
    name: 'English Language and Digital Cultures',
    code: 'ELDA-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'BA in a Language or Linguistics related area. For the MA Degree in English Language and Digital Cultures, a BA Degree in English or any Language is a pre-requisite with at least a Second Class Lower Division Degree, additional knowledge of an African Language will be an advantage.',
    departmentId: DEPARTMENTS.ELDIC,
  },
];

async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ngumkan@gmail.com', password: 'kan2026' }),
  });
  const d = await res.json();
  if (!d.success) throw new Error('Login failed: ' + JSON.stringify(d));
  return d.data.token;
}

async function main() {
  const token = await login();
  console.log('✅ Logged in as admin\n');
  console.log(`📋 Adding ${programmes.length} Faculty of Arts programmes...\n`);

  let added = 0;
  let skipped = 0;

  for (const prog of programmes) {
    console.log(`  ➡️  Adding: ${prog.name} (${prog.code})...`);
    try {
      const res = await fetch(`${API}/admin/programmes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(prog),
      });
      const data = await res.json();
      if (data.success) {
        console.log(`  ✅ ${prog.code} — ID: ${data.data.id}`);
        added++;
      } else {
        if (data.message && data.message.includes('already exists')) {
          console.log(`  ⚠️  ${prog.code} — Already exists`);
          skipped++;
        } else {
          console.log(`  ❌ ${prog.code} — ${data.message || JSON.stringify(data)}`);
          skipped++;
        }
      }
    } catch (err) {
      console.log(`  ❌ ${prog.code} — Network error: ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n📊 Summary: ${added} added, ${skipped} skipped`);
}

main().catch(console.error);
