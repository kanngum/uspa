// Add tuition data for FLPS programmes
const API = 'http://localhost:3001/api';

async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@uba.cm', password: 'admin123' }),
  });
  const data = await res.json();
  return data.data.token;
}

async function fetchProgrammes(token) {
  const res = await fetch(`${API}/admin/programmes?limit=200`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  return data.data || [];
}

async function addTuition(token, programmeId, amount, academicYear = '2025/2026', currency = 'XAF') {
  const res = await fetch(`${API}/admin/tuition`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ programmeId, amount, academicYear, currency })
  });
  const data = await res.json();
  return data;
}

async function main() {
  const token = await login();
  console.log('✅ Logged in as admin\n');
  
  const programmes = await fetchProgrammes(token);
  
  // Tuition data for new FLPS programmes by code
  const tuitionMap = {
    'EPLW': 50000,    // English Private Law - 50,000 FRS
    'LLM-EPLW': 50000, // Masters in English Private Law - 50,000 CFA
    'EPLL': 500000,   // Conversion Masters - 500,000 FRS (plus 25,000 registration)
    'PUL': 50000,     // LL.B Public Law - 50,000 FRS
    'CAP': 150000,    // Capacité en Droit - 150,000 FRS
    'LLM-PULL': 50000, // LL.M. in Public Law - 50,000 CFA
    'POLS': 50000,    // BSc Political Science - 50,000 FRS
    'FPLW': 50000,    // French Private Law - 50,000 FRS
  };
  
  let added = 0;
  let skipped = 0;
  
  for (const prog of programmes) {
    const amount = tuitionMap[prog.code];
    if (!amount) continue;
    
    const result = await addTuition(token, prog.id, amount);
    if (result.success) {
      console.log(`✅ ${prog.code} — Tuition: ${amount.toLocaleString()} FRS`);
      added++;
    } else {
      console.log(`⚠️  ${prog.code} — ${result.message || 'Could not add tuition'}`);
      skipped++;
    }
  }
  
  console.log(`\n📊 Summary: ${added} added, ${skipped} skipped`);
}

main().catch(console.error);
