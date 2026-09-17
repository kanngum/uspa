// Verify FLPS programmes were added
const API = 'http://localhost:3001/api';

async function main() {
  // Check all programmes
  const res = await fetch(`${API}/programmes?limit=200`);
  const data = await res.json();
  
  const flpsProgrammes = data.data.filter(p => 
    p.department?.academicUnit?.abbreviation === 'FLPS'
  );
  
  console.log(`\n📋 FLPS Programmes (${flpsProgrammes.length} total):\n`);
  console.log('Code'.padEnd(12), 'Name'.padEnd(40), 'Degree'.padEnd(8), 'Level'.padEnd(16), 'Duration');
  console.log('-'.repeat(90));
  
  for (const p of flpsProgrammes) {
    console.log(
      p.code.padEnd(12),
      p.name.substring(0, 38).padEnd(40),
      p.degree.padEnd(8),
      p.level.padEnd(16),
      `${p.duration} yrs`
    );
  }
  
  console.log(`\n✅ Total programmes in DB: ${data.total}`);
}

main().catch(console.error);
