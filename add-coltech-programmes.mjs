// Add COLTECH programmes to database
const API = 'http://localhost:3001/api';

const programmes = [
  {
    name: 'MSc Agribusiness Marketing Management',
    code: 'ABMM',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'B.Sc degree in Agriculture, Agricultural Economics, Agribusiness, Economics, Management, marketing, Geography or Mathematics. Fees/Year: 50,000 FRS.',
    departmentId: 'cmrxq8t4a001itokcbym73zdi', // Agribusiness Technology (COLTECH)
  },
  {
    name: 'MSc Agribusiness Project Management',
    code: 'ABPM',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'B.Sc degree in Agriculture, Agricultural Economics, Agribusiness, Economics, Management, marketing, Geography or Mathematics. Fees: 50,000 FRS.',
    departmentId: 'cmrxq8t4a001itokcbym73zdi', // Agribusiness Technology (COLTECH)
  },
  {
    name: 'Agribusiness, Food Systems and Policy',
    code: 'ABAP',
    degree: 'MSC',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Bachelor of Science (BSc.) Degree 2nd class lower in Agribusiness or Agricultural Science related disciplines, Economics, Marketing, Management, Accounting, Development studies and Communication, Geography, Political Science and other closely related Social Sciences and Humanities fields. Fees: 50,000 FRS.',
    departmentId: 'cmrxq8t4a001itokcbym73zdi', // Agribusiness Technology (COLTECH)
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
  console.log(`📋 Adding ${programmes.length} COLTECH programmes...\n`);

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
        // Check if already exists
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

