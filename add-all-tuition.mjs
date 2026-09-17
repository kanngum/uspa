// ============================================================
// Add Tuition Records for ALL Programmes
// ============================================================
// Run: node add-all-tuition.mjs
// ============================================================

const API = 'http://localhost:3001/api';

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

// Tuition amounts by programme code pattern
function getTuitionAmount(prog) {
  const desc = (prog.description || '').toLowerCase();
  const name = prog.name.toLowerCase();

  // Check for specific fee mentions in description
  const feePatterns = [
    // Programme fee 600,000
    { match: /600[\s,]*000|600000/, amount: 600000 },
    // Programme fee 520,000 (LLTA)
    { match: /520[\s,]*000|520000/, amount: 520000 },
    // Programme fee 500,000
    { match: /500[\s,]*000|500000/, amount: 500000 },
    // Programme fee 300,000 (Non-CEMAC)
    { match: /300[\s,]*000|300000/, amount: 300000 },
    // Registration 50,000 + programme 500,000 = conversion programmes
    { match: /registration.*50[\s,]*000.*programme.*500[\s,]*000/, amount: 550000 },
    // Programme fee 150,000 (Capacité en Droit)
    { match: /150[\s,]*000|150000/, amount: 150000 },
  ];

  for (const pattern of feePatterns) {
    if (pattern.match.test(desc) || pattern.match.test(name)) {
      return pattern.amount;
    }
  }

  // By programme code or name patterns
  if (prog.code.startsWith('C') && prog.level === 'POSTGRADUATE') {
    // Conversion programmes: 25,000 registration + 500,000 fee
    return 525000;
  }

  // Conversion Masters in English Private Law
  if (prog.code === 'EPLL') return 525000;

  // Specific known amounts
  const amountMap = {
    'LLTA': 520000,       // MA English Language and Literature Teaching
    'CAP': 150000,        // Capacité en Droit
    'LACTI': 50000,       // BA Translation (Cameroon rate)
    'LCIC': 50000,        // BA Intercultural Communication
    'HEPM': 600000,       // Health Economics
    'MEEPM': 600000,      // Environmental Economics
    'MHRM': 600000,       // Human Resource Management
    'MFI': 600000,        // Finance and Investment
  };

  if (amountMap[prog.code]) return amountMap[prog.code];

  // Default: 50,000 XAF for standard programmes
  return 50000;
}

async function main() {
  const token = await login();

  console.log('═'.repeat(60));
  console.log('  ADD TUITION RECORDS FOR ALL PROGRAMMES');
  console.log('═'.repeat(60));

  // Fetch all programmes
  const res = await fetch(`${API}/admin/programmes?limit=300`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  const programmes = data.data || [];

  console.log(`\n📋 Found ${programmes.length} programmes in database\n`);

  const results = { added: 0, skipped: 0, errors: 0 };

  for (const prog of programmes) {
    const amount = getTuitionAmount(prog);
    process.stdout.write(`  ${prog.code} - ${prog.name.substring(0, 45).padEnd(47)} ${amount.toLocaleString()} XAF... `);

    try {
      const tuiRes = await fetch(`${API}/admin/tuition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          programmeId: prog.id,
          academicYear: '2025/2026',
          amount,
          currency: 'XAF',
        }),
      });
      const tuiData = await tuiRes.json();

      if (tuiData.success) {
        console.log(`✅`);
        results.added++;
      } else if (tuiData.message && tuiData.message.includes('already exists')) {
        console.log(`⚠️  Exists`);
        results.skipped++;
      } else {
        console.log(`❌ ${tuiData.message || 'Failed'}`);
        results.errors++;
      }
    } catch (err) {
      console.log(`❌ ${err.message}`);
      results.errors++;
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('  SUMMARY');
  console.log('═'.repeat(60));
  console.log(`  ✅ Tuition added:   ${results.added}`);
  console.log(`  ⚠️  Already exists:  ${results.skipped}`);
  console.log(`  ❌ Errors:          ${results.errors}`);
  console.log(`  📊 Total processed:  ${programmes.length} programmes`);
  console.log('═'.repeat(60));
}

main().catch(console.error);

