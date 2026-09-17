// Script to add Faculty of Law and Political Science (FLPS) programmes
// Run: node add-flps-programmes.mjs

const API = 'http://localhost:3001/api';

// FLPS Faculty ID
const FLPS_ID = 'cmrxnb0yx001uj4kcv54qvdiz';

// FLPS Department IDs
const DEPARTMENTS = {
  'Capacité en Droit': { id: 'cmrxq8t7w0034tokcrcsijmcd', abb: 'CAPA' },
  'Department of Law': { id: 'cmrxnb0z0001vj4kcgkwhnpfg', abb: 'LAW' },
  'English Private Law': { id: 'cmrxq8t7y0035tokchtk5vtqh', abb: 'EPL' },
  'French Private Law': { id: 'cmrxq8t800036tokcdsj4rjwc', abb: 'FPL' },
  'Public Law': { id: 'cmrxq8t840038tokczr86yy7b', abb: 'PUL' },
  'Department of Political Science': { id: 'cmrxnb0z2001wj4kckyg837ws', abb: 'POL' },
  'Political Science': { id: 'cmrxq8t820037tokccmdybeij', abb: 'POS' },
};

// Login as admin
async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@uba.cm', password: 'admin123' }),
  });
  const data = await res.json();
  if (!data.success) throw new Error('Login failed: ' + JSON.stringify(data));
  console.log('✅ Logged in as admin');
  return data.data.token;
}

// Helper to call admin API
async function adminPost(token, endpoint, body) {
  const res = await fetch(`${API}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.success) {
    console.error(`❌ Failed POST ${endpoint}:`, data.message || data);
    return null;
  }
  return data.data;
}

async function main() {
  const token = await login();

  const programmes = [
    {
      name: 'English Private Law',
      code: 'EPLW',
      degree: 'LLB',
      level: 'UNDERGRADUATE',
      duration: 3,
      description: 'Bachelor Degree in English Private Law. Requires: Four O/L papers excluding Religious Studies but including English Language. BEPC and Probatoire. Two A/L subjects obtained in one sitting excluding Religious Studies or Baccalaureate. Capacité en Droit. Fees: 50,000 FRS.',
      departmentId: DEPARTMENTS['English Private Law'].id,
    },
    {
      name: 'Masters in English Private Law',
      code: 'LLM-EPLW',
      degree: 'LLB',
      level: 'POSTGRADUATE',
      duration: 2,
      description: 'Master Degree in English Private Law. Requires: LL.B (Hons) in Public Law (Second Class Lower). LL.B (Hons) in Private Law depending on electives. Licence en Droit Public with at least Assez-Bien. PGD in Law or Maîtrise in Law. Tuition: 50,000 CFA/year.',
      departmentId: DEPARTMENTS['English Private Law'].id,
    },
    {
      name: 'Conversion Masters in English Private Law',
      code: 'EPLL',
      degree: 'LLB',
      level: 'POSTGRADUATE',
      duration: 1,
      description: 'Conversion Master Degree in English Private Law. Requires: Professional Master\'s Degree in any field of Law or equivalent. Registration: 25,000 FRS. Tuition: 500,000 FRS.',
      departmentId: DEPARTMENTS['English Private Law'].id,
    },
    {
      name: 'LL.B Public Law',
      code: 'PUL',
      degree: 'LLB',
      level: 'UNDERGRADUATE',
      duration: 3,
      description: 'Bachelor Degree in Public Law. Requires: Four O/L papers excluding Religious Studies but including English Language. BEPC and Probatoire with pass in English Language. Two A/L subjects in one sitting excluding Religious Studies. Baccalaureate. Capacité en Droit. Fees: 50,000 FRS.',
      departmentId: DEPARTMENTS['Public Law'].id,
    },
    {
      name: 'Capacité en Droit',
      code: 'CAP',
      degree: 'DIPLOMA',
      level: 'UNDERGRADUATE',
      duration: 2,
      description: 'Diploma in Legal Capacity. Requires: GCE A/L in at least two (2) subjects in one sitting or Baccalaureate or equivalent. GCE O/L in at least five (5) subjects including English Language or Probatoire with pass in English Language. Fees: 150,000 FRS.',
      departmentId: DEPARTMENTS['Capacité en Droit'].id,
    },
    {
      name: 'LL.M. in Public Law',
      code: 'LLM-PULL',
      degree: 'LLB',
      level: 'POSTGRADUATE',
      duration: 2,
      description: 'Master Degree in Public Law. Requires: LL.B (Hons) in Public Law (Second Class Lower). LL.B (Hons) in Private Law depending on electives. Licence en Droit Public with at least Assez-Bien. PGD in Law or Maîtrise in Law. Tuition: 50,000 CFA/year.',
      departmentId: DEPARTMENTS['Public Law'].id,
    },
    {
      name: 'BSc Political Science',
      code: 'POLS',
      degree: 'BSC',
      level: 'UNDERGRADUATE',
      duration: 3,
      description: 'Bachelor Degree in Political Science. Requires: GCE A/L in at least two (2) papers in one sitting excluding Religious Studies, or BAC (A, B, C, D, G2, G3) with pass in English Language at Probatoire. Four O/L papers in one sitting excluding Religious Studies including English Language. Capacité en Droit. Fees: 50,000 FRS.',
      departmentId: DEPARTMENTS['Political Science'].id,
    },
    {
      name: 'French Private Law',
      code: 'FPLW',
      degree: 'LLB',
      level: 'UNDERGRADUATE',
      duration: 3,
      description: 'Bachelor Degree in French Private Law. Requires: Four O/L papers excluding Religious Studies but including English Language. BEPC and Probatoire with pass in English Language. Two A/L subjects in one sitting excluding Religious Studies. Baccalaureate. Capacité en Droit. Fees: 50,000 FRS.',
      departmentId: DEPARTMENTS['French Private Law'].id,
    },
  ];

  console.log(`\n📋 Adding ${programmes.length} programmes to FLPS...\n`);

  for (const prog of programmes) {
    console.log(`  ➡️  Adding: ${prog.name} (${prog.code})...`);
    const result = await adminPost(token, '/admin/programmes', prog);
    if (result) {
      console.log(`  ✅ ${prog.name} — ID: ${result.id}`);
    } else {
      // Try checking if already exists
      console.log(`  ⚠️  Could not add ${prog.code} (may already exist)`);
    }
  }

  console.log('\n✅ Done! All programmes processed.');
}

main().catch(console.error);

