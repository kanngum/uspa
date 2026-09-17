// ============================================================
// Faculty of Science (FS) Programmes Seed Script
// ============================================================
// Run: node add-fs-programmes.mjs
// ============================================================

const API = 'http://localhost:3001/api';

// ============================================================
// FS Department IDs (from existing database)
// ============================================================
const DEPARTMENTS = {
  BCH: 'cmrxq8t89003btokc0wj656u5',  // Biochemistry
  BS: 'cmrxq8t8b003ctokcotsnifiw',   // Biological Science
  CHM: 'cmrxq8t8c003dtokcuwvxv8xd',  // Chemistry
  BIO: 'cmrxnb0ze0023j4kc4mo27sam',  // Biology
  CHEM: 'cmrxnb0zc0022j4kcceyfe9vo', // Chemistry (dup)
  CS: 'cmrxnb0z8001zj4kc0dlpx56o',   // Computer Science
  ENV: 'cmrxnb0zi0025j4kcpvne7cuo',  // Environmental Science
  GEO: 'cmrxnb0zg0024j4kct3l2urtb',  // Geology
  MATH: 'cmrxnb0z90020j4kcdpam20n4', // Mathematics
  PHY: 'cmrxnb0zb0021j4kc3hcn4iw8',  // Physics
  GMES: 'cmrxq8t8e003etokcli21s30l', // Geology, Mining and Environmental Science
  MCS: 'cmrxq8t8f003ftokclxz7wuw1',  // Mathematics and Computer Science
  MICP: 'cmrxq8t8h003gtokc3ncfy14w', // Microbiology and Parasitology
  PHY2: 'cmrxq8t8i003htokc5ddmot4l', // Physics
  BOT: 'cmrxq8t8k003itokcmu3kdzyv',  // Plant Sciences (Botany)
  TEE: 'cmrxq8t8m003jtokcpj3uucu1',  // Thermal and Energy Engineering
  ZOO: 'cmrxq8t88003atokc3mofzfh8',  // Zoology
};

// ============================================================
// FS PROGRAMMES
// ============================================================
const programmes = [
  // ---- Biochemistry (BCH) ----
  {
    name: 'BSc Biochemistry (Medical Laboratory Technology)',
    code: 'BCHS-BA',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Besides the general University admissions requirements, candidates must have passed at least 2 GCE Advanced Level subjects, one in Biology, Botany, Zoology or Human Biology, and the other in Chemistry. The Baccalaureate series C and D are also acceptable. A pass in at least the Ordinary Level Mathematics or equivalent is mandatory. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.BCH,
  },
  {
    name: 'BSc Biochemistry (Food and Nutritional Biochemistry)',
    code: 'BCHS-FNB',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Besides the general University admissions requirements, candidates must have passed at least 2 GCE Advanced Level subjects, one in Biology, Botany, Zoology or Human Biology, and the other in Chemistry. The Baccalaureate series C and D are also acceptable. A pass in at least the Ordinary Level Mathematics or equivalent is mandatory. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.BCH,
  },
  {
    name: 'MSc Biochemistry',
    code: 'BCHS-MSC',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Besides all criteria specified by the Postgraduate School, applicants must be holders of a Bachelor\'s degree (BSc) in Biochemistry or related disciplines with a minimum GPA of 2.5/4.0. Applications must be accompanied by at least two recommendation letters. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.BCH,
  },

  // ---- Chemistry (CHM) ----
  {
    name: 'BSc Chemistry',
    code: 'CHMS-BA',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Besides the general University admissions requirements, candidates must have pass grades in Mathematics, Physics and Chemistry at GCE O\' level. At GCE A\' level, they must possess good pass grades in at least two science subjects, one of which must be Chemistry (minimum D grade). Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.CHM,
  },
  {
    name: 'MSc Chemistry',
    code: 'CHMS-MSC',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Applicants must have a Bachelor\'s degree in Chemistry with at least a Second-class Honours (minimum GPA 2.50/4.00). Other backgrounds may be considered with remedial courses. Applications must include recommendation letters. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.CHM,
  },

  // ---- Geology / GMES ----
  {
    name: 'BSc Geology',
    code: 'GLYS',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Candidates must fulfil all general admissions requirements of UBa. Must have pass grades in at least 4 subjects including Mathematics at GCE O\' level. A pass in any two of these at A/L: Biology, Chemistry, Physics, Mathematics, Geology or Baccalaureat D. Fees: 50,000 FRS CFA.',
    departmentId: DEPARTMENTS.GMES,
  },
  {
    name: 'BSc Environmental Science',
    code: 'ENVS',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Candidates must fulfil all general admissions requirements of UBa. Must have pass grades in at least 4 subjects including Mathematics at GCE O\' level. A pass in any two of: Biology, Chemistry, Physics, Mathematics, Geology, Geography or Baccalaureat D. Fees: 50,000 FRS CFA.',
    departmentId: DEPARTMENTS.ENV,
  },
  {
    name: 'MSc Geoscience (Economic Geology and Mineral Exploration)',
    code: 'GSC',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Candidates must be holders of a Bachelor\'s degree in Geology, Petroleum Engineering, Physics, Mining and Environmental Sciences or related disciplines with a minimum GPA of 2.50. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.GMES,
  },
  {
    name: 'MSc Geoscience (Petroleum Geoscience)',
    code: 'MPG',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Candidates must be holders of a Bachelor\'s degree in Geology, Mining or Environmental Sciences or related disciplines with a minimum GPA of 2.5 on a scale of 4.',
    departmentId: DEPARTMENTS.GMES,
  },

  // ---- Mathematics / MCS ----
  {
    name: 'BSc Mathematics and Statistics',
    code: 'MAST',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Candidates must fulfil all general admissions requirements of UBa. D grade in Mathematics at GCE A\' Level (or equivalent) or a special recommendation of the Department. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.MCS,
  },
  {
    name: 'BSc Mathematics (with minor Computer Science)',
    code: 'MATS-BA',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Candidates must fulfil all general admissions requirements of UBa. D grade in Mathematics at GCE A\' Level (or equivalent) or a special recommendation of the Department. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.MCS,
  },
  {
    name: 'BSc Combined Mathematics and Computer Science',
    code: 'MACS',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 4,
    description: 'Candidates must fulfil all general admissions requirements of UBa. D grade in Mathematics at GCE A\' Level (or equivalent) or a special recommendation of the Department. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.MCS,
  },
  {
    name: 'BSc Pure Mathematics',
    code: 'PMAT',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Pass at GCE A/L. Pass in A/L Mathematics with at least a D grade. At least 3 A/L Points. Pass in GCE O/L including Mathematics and English Language. OR Probatoire Average 11/20.',
    departmentId: DEPARTMENTS.MCS,
  },
  {
    name: 'MSc Probability and Statistics',
    code: 'PSTAT',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'A Bachelor\'s Degree in Mathematics with GPA of at least 2.5/4.0 or a Bachelor\'s Degree in a Mathematical Science with a Minor in Statistics with GPA of at least 3.0. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.MCS,
  },
  {
    name: 'MSc Applied Mathematics',
    code: 'MATS-MSC',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Hold a Bachelor\'s Degree in Mathematics, or Physics with a minor in Mathematics. Second class honours (lower division) or equivalent. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.MCS,
  },

  // ---- Cybersecurity (via MCS) ----
  {
    name: 'BSc Cybersecurity and Cryptology',
    code: 'CYBS',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'GCE Advanced Level with passes in Mathematics and at least two Science subjects. Or Baccalaureate C, D, E, F or equivalent qualification recognized by the University of Bamenda.',
    departmentId: DEPARTMENTS.MCS,
  },

  // ---- Physics (PHY) ----
  {
    name: 'BSc Physics',
    code: 'PHYS',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Candidates must fulfil all general admissions requirements of UBa. Must have pass grades in Mathematics, Physics and Chemistry at GCE O\' level. A pass at GCE A\' level with good grades in at least two science subjects, one of which must be Physics (minimum D grade). Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.PHY2,
  },
  {
    name: 'MSc Physics (Theoretical Physics)',
    code: 'MPHY-TH',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Hold a Bachelor\'s Degree in Physics, Engineering, or Mathematics with a minor in Physics. Second class honours (lower division) or equivalent. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.PHY2,
  },
  {
    name: 'MSc Physics (Geophysics)',
    code: 'MPHY-GP',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Hold a Bachelor\'s Degree in Physics, Engineering, or Mathematics with a minor in Physics. Second class honours (lower division) or equivalent. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.PHY2,
  },

  // ---- Microbiology (MICP) ----
  {
    name: 'BSc Microbiology (Minor Medical Laboratory Technology)',
    code: 'MCBS-BA',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'A pass in any two of these at A\' levels: Biology, Chemistry, Physics, Mathematics, Geology, Geography, Food Science and Nutrition or Baccalaureate D. 4 GCE O/L subjects including Mathematics and English Language. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.MICP,
  },
  {
    name: 'MSc Microbiology',
    code: 'MCBS-MSC',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Admission open to graduates with at least Second Class Honours (Lower Division) in Biochemistry, Microbiology, Medical Laboratory Science, Zoology, Doctor of Medicine or related disciplines. Minimum 120 credits. Fees: 50,000 CFA.',
    departmentId: DEPARTMENTS.MICP,
  },

  // ---- Biological Science ----
  {
    name: 'BSc Biomedical Sciences',
    code: 'BMSS',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'At least five papers in GCE Ordinary level including English and Mathematics and two papers in GCE Advanced level passes with at least one in Biology. Fees: 50,000 CFA.',
    departmentId: DEPARTMENTS.BS,
  },

  // ---- Plant Sciences / Botany (BOT) ----
  {
    name: 'BSc Applied Botany',
    code: 'BOTS',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'A pass in any two of these at A\' levels: Biology, Chemistry, Physics, Mathematics, Geology, Geography or Baccalaureat D. 4 GCE O/L subjects including Mathematics and English Language. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.BOT,
  },
  {
    name: 'MSc Applied Botany',
    code: 'ABOT',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Holders of a Bachelor\'s degree in Applied Botany or related disciplines with a minimum GPA of 2.50. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.BOT,
  },
  {
    name: 'PhD Applied Botany',
    code: 'ABOTS',
    degree: 'PHD',
    level: 'DOCTORATE',
    duration: 3,
    description: 'Hold a good Master of Science Degree in Botany, Plant Science or any relevant discipline. Submit a PhD project proposal acceptable to the Departmental Scientific Board. Fees: 50,000 FRS.',
    departmentId: DEPARTMENTS.BOT,
  },

  // ---- Zoology (ZOO) ----
  {
    name: 'BSc Applied Zoology (Minor Medical Laboratory Technology)',
    code: 'ZOOS',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'A pass in any two of these at A\' levels: Biology, Chemistry, Physics, Mathematics, Geology, Geography or Baccalaureate D. 4 GCE O/L subjects including Mathematics and English Language. Fees: 50,000 FRS CFA.',
    departmentId: DEPARTMENTS.ZOO,
  },
  {
    name: 'BSc Applied Zoology (Minor Animal Production)',
    code: 'AZAP',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'A pass in any two of these at A\' levels: Biology, Chemistry, Physics, Mathematics, Geology, Geography or Baccalaureate D. 4 GCE O/L subjects including Mathematics and English Language. Fees: 50,000 FRS CFA.',
    departmentId: DEPARTMENTS.ZOO,
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
  console.log('  FACULTY OF SCIENCE (FS) PROGRAMMES SEED');
  console.log('═'.repeat(60));
  console.log(`\n📋 Total FS programmes to process: ${programmes.length}\n`);

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
  console.log(`  📊 Total:   ${programmes.length} FS programmes`);
  console.log('═'.repeat(60));
}

main().catch(console.error);

