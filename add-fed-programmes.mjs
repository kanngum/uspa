// ============================================================
// Faculty of Education (FED) Programmes Seed Script
// ============================================================
// Run: node add-fed-programmes.mjs
// ============================================================

const API = 'http://localhost:3001/api';

// ============================================================
// FED Department IDs (from existing database)
// ============================================================
const DEPARTMENTS = {
  EFA: 'cmrxq8t6q002mtokcze8r3q63',  // Educational Foundation
  EPY: 'cmrxq8t6t002otokct1325arl',  // Educational Psychology
  CPY: 'cmrxq8t6k002jtokc6viehdp3',  // Counseling Psychology
  CUP: 'cmrxq8t6m002ktokcm1fkb0h1',  // Curriculum and Pedagogy
  EDL: 'cmrxq8t6s002ntokcvp4sl97k',  // Educational Leadership
  TED: 'cmrxq8t78002ttokcbyr5xe7x',  // Teacher Education
  PEA: 'cmrxq8t71002qtokc0jfkbvso',  // Physical Education and Animation
  SCC: 'cmrxq8t73002rtokcq5vf04u6',  // School Counseling
  BRC: 'cmrxq8t6i002itokc5keva0sc',  // Bereavement Counseling
  DED: 'cmrxq8t6o002ltokcfk0ray6h',  // Distance Education
  IPY: 'cmrxq8t6x002ptokc27ibe8ae',  // Industrial and Organizational Psychology
  SPTS: 'cmrxq8t76002stokczrjemhes', // Sports
};

// ============================================================
// FED PROGRAMMES
// ============================================================
const programmes = [
  // ---- Educational Foundation (EFA) ----
  {
    name: 'Sociology of Education',
    code: 'SOC-BA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Two A/L subjects or BAC. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.EFA,
  },
  {
    name: 'B.Ed Environmental Education',
    code: 'EED',
    degree: 'BED',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Two A/L subjects or BAC. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.EFA,
  },
  {
    name: 'B.Ed in Nomadic Teacher Education',
    code: 'NTED',
    degree: 'BED',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Two A/L subjects or BAC. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.EFA,
  },
  {
    name: 'MEd, Environmental Education',
    code: 'ENV',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's Degree in Environmental Education, Sociology of Education, Geography, History, Philosophy, Psychology, Biology, Science of Education or a Bachelor degree in any of the Social Science disciplines. Tuition: 50,000 FRS per Year.",
    departmentId: DEPARTMENTS.EFA,
  },
  {
    name: 'MEd, History of Education',
    code: 'HIS-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's Degree in Environmental Education, Sociology of Education, Geography, History, Philosophy, Psychology, Science of Education or a Bachelor degree in any of the Social Science disciplines. Tuition: 50,000 FRS per Year.",
    departmentId: DEPARTMENTS.EFA,
  },
  {
    name: 'MEd, Sociology of Education',
    code: 'SOC-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's Degree in Environmental Education, Sociology of Education, Geography, History, Philosophy, Psychology, Science of Education or a Bachelor degree in any of the Social Science disciplines. Tuition: 50,000 FRS per Year.",
    departmentId: DEPARTMENTS.EFA,
  },

  // ---- Educational Psychology (EPY) ----
  {
    name: 'Educational Psychology',
    code: 'EPY-BA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'A pass in 4 GCE O/L subjects and two (02) GCE A/L subjects for admission into year 1. Teachers Grade 1 plus 1 GCE A/L with at least a D grade for admission into Year II. HTTC/HTTTC graduates for year III. Fees: 50,000 FRS per Year.',
    departmentId: DEPARTMENTS.EPY,
  },
  {
    name: 'MSc. Applied Developmental Psychology',
    code: 'ADP',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 3,
    description: "Bachelor's Degree in Educational Psychology, Counseling/Psychology/Education or equivalent. Graduates of the second Cycle of HTTC and HTTTC. Teachers Grade 1 plus 1 GCE A/L with at least a D grade. Tuition: 50,000 FRS per year.",
    departmentId: DEPARTMENTS.EPY,
  },
  {
    name: 'M.Ed Educational Psychology',
    code: 'EPY-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'B.Ed in Educational Psychology/Education. Tuition: 50,000 FRS per Year.',
    departmentId: DEPARTMENTS.EPY,
  },
  {
    name: 'Conversion M.Ed. Educational Psychology',
    code: 'CEPS',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 1,
    description: "Bachelor's Degree in Psychology, Education or related fields. Postgraduate Diploma or Professional Masters in Psychology, Counselling, Early Childhood Education and other Related fields. Registration: 50,000 FRS. Tuition: 250,000 FRS. Caution: 10,000 FRS. Medical: 8,700 FRS.",
    departmentId: DEPARTMENTS.EPY,
  },
  {
    name: 'Conversion MSc. Applied Developmental Psychology',
    code: 'ADP-CONV',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 1,
    description: "Bachelor's Degree in Psychology, Education or related fields. Postgraduate Diploma or Professional Masters in Psychology, Counselling, Early Childhood Education and other Related fields. Registration: 50,000 FRS. Tuition: 250,000 FRS. Caution: 10,000 FRS. Medical: 8,700 FRS.",
    departmentId: DEPARTMENTS.EPY,
  },

  // ---- Curriculum and Pedagogy (CUP) ----
  {
    name: 'Curriculum Planning and Design',
    code: 'CPD-BA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'A pass in 4 GCE O/L subjects and two (02) GCE A/L subjects. Teachers Grade 1 plus 1 GCE A/L. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.CUP,
  },
  {
    name: 'Curriculum Pedagogy',
    code: 'PED',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'A pass in 4 GCE O/L subjects and two (02) GCE A/L subjects. Teachers Grade 1 plus 1 GCE A/L. Fees: 50,000 FRS per year.',
    departmentId: DEPARTMENTS.CUP,
  },
  {
    name: 'Inclusive Education',
    code: 'IED',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Two Advanced Level papers excluding religion, Baccalaureate and a pass in ordinary level English. Tuition: 50,000 CFA per year.',
    departmentId: DEPARTMENTS.CUP,
  },
  {
    name: 'Braille and Sign Language',
    code: 'BSL',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 1,
    description: 'Holders of B-Tech in Education, HND, DIPES I, DIPET I and related fields. Tuition: 100,000 FRS. Registration: 50,000 FRS.',
    departmentId: DEPARTMENTS.CUP,
  },
  {
    name: 'Conversion M.Ed. Educational Measurement and Evaluation',
    code: 'EME-CONV',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 1,
    description: "Bachelor's Degree in Education or related fields. Postgraduate Diploma or Professional Masters in Measurement and Evaluation. Registration: 50,000 FRS. Tuition: 250,000 FRS.",
    departmentId: DEPARTMENTS.CUP,
  },
  {
    name: 'MEd, Educational Measurement and Evaluation',
    code: 'EME-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's Degree in Education or equivalent. Graduates of the second Cycle of HTTC and HTTTC. Tuition: 50,000 CFA per year.",
    departmentId: DEPARTMENTS.CUP,
  },
  {
    name: 'MEd, Curriculum Planning and Design',
    code: 'CPD-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's Degree in Education or equivalent. Graduates of the second Cycle of HTTC and HTTTC. Tuition: 50,000 CFA per year.",
    departmentId: DEPARTMENTS.CUP,
  },
  {
    name: 'M.Ed in Pedagogy',
    code: 'MCPE',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's Degree in Education or equivalent. Graduates of the second Cycle of HTTC and HTTTC. Fee: 50,000 CFA per year.",
    departmentId: DEPARTMENTS.CUP,
  },
  {
    name: 'MEd, Subject Didactics',
    code: 'SDD',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Masters programme in Subject Didactics.',
    departmentId: DEPARTMENTS.CUP,
  },
  {
    name: 'Masters of Education in Inclusive Education',
    code: 'MEIE',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Bachelors Degree in related field. Tuition: 50,000 FRS.',
    departmentId: DEPARTMENTS.CUP,
  },

  // ---- Counseling Psychology (CPY) ----
  {
    name: 'Community Psychology',
    code: 'CPS-BA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'A pass in 4 GCE O/L subjects and two (02) GCE A/L subjects. Teachers Grade 1 plus 1 GCE A/L. Tuition: 50,000 FRS.',
    departmentId: DEPARTMENTS.CPY,
  },
  {
    name: 'Social Work',
    code: 'SOW-BA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE Advanced Level, Teachers grade I certificate with a pass in one Advanced Level paper. Registration: 50,000 FRS.',
    departmentId: DEPARTMENTS.CPY,
  },
  {
    name: 'MSc, Community Psychology',
    code: 'CPS-MSC',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's Degree in Educational Psychology, Counselling/Psychology/Education or equivalent. Graduates of HTTC and HTTTC. Tuition: 50,000 FRS per Year.",
    departmentId: DEPARTMENTS.CPY,
  },
  {
    name: 'Conversion MSc. Community Psychology',
    code: 'CPS-CONV',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 1,
    description: "Bachelor's Degree in Psychology, Education or related fields. Postgraduate Diploma or Professional Masters in Psychology, Counselling. Registration: 50,000 FRS. Tuition: 250,000 FRS.",
    departmentId: DEPARTMENTS.CPY,
  },
  {
    name: 'Conversion Masters in Counselling',
    code: 'CPY-CONV',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 1,
    description: "Bachelor's Degree in Psychology, Education or related fields. Postgraduate Diploma or Professional Masters in Psychology, Counselling. Fees: 350,000 FRS.",
    departmentId: DEPARTMENTS.CPY,
  },
  {
    name: 'MSc, Health Psychology',
    code: 'HPY',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'B.Ed / BSc Counseling / Psychology. Tuition: 500,000 FRS per year.',
    departmentId: DEPARTMENTS.CPY,
  },
  {
    name: 'MSc, Clinical Counseling',
    code: 'CLC',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's Degree in Education or equivalent. Graduates of HTTC and HTTTC. Tuition: 50,000 FRS per year.",
    departmentId: DEPARTMENTS.CPY,
  },
  {
    name: 'M.SC. in Social Work',
    code: 'SOW-MSC',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's Degree in Education or equivalent. Graduates of HTTC and HTTTC. Fees: 50,000 FRS.",
    departmentId: DEPARTMENTS.CPY,
  },

  // ---- Teacher Education (TED) ----
  {
    name: 'Secondary Education (Teaching Subjects: History, Geography, Economics, Law, Accounting, Management, English Language, Literature in English)',
    code: 'SEED',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Two A/Level subjects or BAC in Sciences.',
    departmentId: DEPARTMENTS.TED,
  },
  {
    name: 'Teaching Science, Technology, Engineering and Mathematics (STEM)',
    code: 'STEM',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'A pass in 4 GCE O/L science subjects and two (02) GCE A/L science subjects. Teachers Grade 1 plus 1 GCE A/L. Tuition: 50,000 FRS.',
    departmentId: DEPARTMENTS.TED,
  },
  {
    name: 'MEd, Teacher Education',
    code: 'TED-MA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's Degree in Education and related fields or equivalent. Tuition: 50,000 FRS per year.",
    departmentId: DEPARTMENTS.TED,
  },
  {
    name: 'Masters of Education (M.Ed) in STEM Education',
    code: 'STE',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'A Bachelor Degree in STEM Education or a B.Sc. or its equivalence in a Science-related discipline with a diploma in education and a GPA of at least 2.5/4.',
    departmentId: DEPARTMENTS.TED,
  },
  {
    name: 'Conversion Masters in Teacher Education',
    code: 'TED-CONV',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 1,
    description: 'A Bachelor Degree in Education or a B.Sc. in related social science discipline with a GPA of at least 2.5/4 or DIPES II, DIPET II. Fees: 350,000 FRS.',
    departmentId: DEPARTMENTS.TED,
  },

  // ---- Educational Leadership (EDL) ----
  {
    name: 'Educational Leadership',
    code: 'EDL',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'A pass in 4 GCE O/L subjects and two (02) GCE A/L subjects. Teachers Grade 1 plus 1 GCE A/L. Tuition: 50,000 FRS.',
    departmentId: DEPARTMENTS.EDL,
  },
  {
    name: 'Educational Leadership in Basic Education',
    code: 'ELBE',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Bachelor programme in Educational Leadership in Basic Education.',
    departmentId: DEPARTMENTS.EDL,
  },
  {
    name: 'Educational Leadership in Secondary Education',
    code: 'ELDE',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'A pass in 4 GCE O/L subjects and two (02) GCE A/L subjects. Teachers Grade 1 plus 1 GCE A/L. Tuition: 50,000 FRS per year.',
    departmentId: DEPARTMENTS.EDL,
  },
  {
    name: 'M.Ed in Educational Leadership and Management',
    code: 'ELE',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "B.Ed. in Educational Leadership/Administration. B.Ed. in Curriculum Studies & Teaching or B.Sc. in related Social Science disciplines. Applicants without Education degree need 3 years relevant experience. Tuition: 50,000 CFA per year.",
    departmentId: DEPARTMENTS.EDL,
  },

  // ---- Physical Education and Animation (PEA) ----
  {
    name: 'Physical Education and Animation',
    code: 'PEA',
    degree: 'BA',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'A pass in 4 GCE O/L subjects and two (02) GCE A/L subjects. Teachers Grade 1 plus 1 GCE A/L. Tuition: 50,000 FRS per year.',
    departmentId: DEPARTMENTS.PEA,
  },
  {
    name: 'B.Ed in Recreation and Leisure Studies',
    code: 'BRLS',
    degree: 'BED',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Two A/Level subjects or BAC, CJA, IJPA or equivalent. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.PEA,
  },
  {
    name: 'M.Ed, Physical Education and Animation',
    code: 'MPEA',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's Degree in Educational Psychology, Counseling/Psychology/Education or equivalent. Tuition: 50,000 FRS per year.",
    departmentId: DEPARTMENTS.PEA,
  },

  // ---- School Counseling (SCC) ----
  {
    name: 'MEd, School Counseling',
    code: 'SCC',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'A Bachelor Degree in Counseling, Psychology of education or other equivalences. Graduate of Second Cycle of HTTC and HTTTC. Tuition: 50,000 FRS per year.',
    departmentId: DEPARTMENTS.SCC,
  },
  {
    name: 'MEd, School Counseling (Late Registration)',
    code: 'SCC-LATE',
    degree: 'MA',
    level: 'POSTGRADUATE',
    duration: 2,
    description: "Bachelor's Degree in Education or equivalent. Tuition: 500,000 FRS per year.",
    departmentId: DEPARTMENTS.SCC,
  },
];

// ============================================================
// MAIN
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

async function main() {
  const token = await login();

  console.log('═'.repeat(60));
  console.log('  FACULTY OF EDUCATION (FED) PROGRAMMES SEED');
  console.log('═'.repeat(60));
  console.log(`\n📋 Total FED programmes to process: ${programmes.length}\n`);

  const results = { added: 0, skipped: 0, errors: 0 };

  for (let i = 0; i < programmes.length; i++) {
    const prog = programmes[i];
    process.stdout.write(`  ${i + 1}/${programmes.length} ${prog.code} - ${prog.name.substring(0, 55)}... `);

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
        console.log(`✅`);
        results.added++;
      } else if (data.message && data.message.includes('already exists')) {
        console.log(`⚠️  Exists`);
        results.skipped++;
      } else {
        console.log(`❌ ${data.message || JSON.stringify(data).substring(0, 80)}`);
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
  console.log(`  📊 Total:   ${programmes.length} FED programmes`);
  console.log('═'.repeat(60));
}

main().catch(console.error);

