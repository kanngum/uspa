// Verify all seeded programmes across faculties
const API = 'http://localhost:3001/api';

async function main() {
  console.log('🔍 VERIFYING ALL SEEDED PROGRAMMES\n');

  // 1. Fetch all programmes
  const res = await fetch(`${API}/programmes?limit=200`);
  const data = await res.json();

  if (!data.success) {
    console.error('❌ Failed to fetch programmes:', data.message);
    return;
  }

  const allProgrammes = data.data;
  console.log(`📊 Total programmes in DB: ${data.total}\n`);

  // 2. Group by faculty
  const byFaculty = {};
  for (const p of allProgrammes) {
    const faculty = p.department?.academicUnit?.name || 'UNKNOWN';
    if (!byFaculty[faculty]) byFaculty[faculty] = [];
    byFaculty[faculty].push(p);
  }

  // 3. Display per-faculty breakdown
  const expected = {
    'College of Technology': ['ABMM', 'ABPM', 'ABAP'],
    'Faculty of Arts': ['CDS', 'GP', 'MGP', 'HARA', 'HESA-BA', 'HICA', 'HISA-BA', 'HESA-MA', 'HEVA', 'HIPA', 'ENG', 'LITA-BA', 'LITA-MA', 'LLTA', 'LANA', 'APL', 'TTFS-BA', 'VAHA', 'TTFS-MA', 'PHI-MA', 'LACTI', 'LCIC', 'ELDA-BA', 'ELDA-MA'],
    'Faculty of Economics and Management Sciences': ['ACC', 'CACC', 'MACC', 'ECN', 'CECN', 'MECN', 'HEPM', 'MEEPM', 'MGT-BA', 'CMGT', 'MMGT', 'MKTG', 'MKT-MA', 'CMKT', 'MHRM', 'MFI', 'BNF', 'QF', 'IBF', 'CBAF', 'MBF'],
    'Faculty of Law and Political Science': ['EPLW', 'LLM-EPLW', 'EPLL', 'PUL', 'LLM-PULL', 'CAP', 'POLS', 'FPLW'],
    'Faculty of Education': ['SOC-BA', 'EED', 'NTED', 'ENV', 'HIS-MA', 'SOC-MA', 'EPY-BA', 'ADP', 'EPY-MA', 'CEPS', 'ADP-CONV', 'CPD-BA', 'PED', 'IED', 'BSL', 'EME-CONV', 'EME-MA', 'CPD-MA', 'MCPE', 'SDD', 'MEIE', 'CPS-BA', 'SOW-BA', 'CPS-MSC', 'CPS-CONV', 'CPY-CONV', 'HPY', 'CLC', 'SOW-MSC', 'SEED', 'STEM', 'TED-MA', 'STE', 'TED-CONV', 'EDL', 'ELBE', 'ELDE', 'ELE', 'PEA', 'BRLS', 'MPEA', 'SCC', 'SCC-LATE'],
  };

  let totalOk = 0;
  let totalMissing = 0;

  for (const [facultyName, expectedCodes] of Object.entries(expected)) {
    const actual = byFaculty[facultyName] || [];
    const actualCodes = actual.map(p => p.code);
    
    console.log(`📚 ${facultyName}:`);
    console.log(`   Expected: ${expectedCodes.length} programmes`);
    console.log(`   Found:    ${actual.length} programmes`);

    const missing = expectedCodes.filter(c => !actualCodes.includes(c));
    const extra = actualCodes.filter(c => !expectedCodes.includes(c));

    if (missing.length === 0 && extra.length === 0) {
      console.log(`   ✅ ALL PROGRAMMES PRESENT\n`);
      totalOk += expectedCodes.length;
    } else {
      if (missing.length > 0) {
        console.log(`   ❌ MISSING: ${missing.join(', ')}`);
        totalMissing += missing.length;
      }
      if (extra.length > 0) {
        console.log(`   ⚠️  EXTRA (not in seed): ${extra.join(', ')}`);
      }
      console.log('');
    }

    // Print details
    for (const p of actual) {
      console.log(`      ${p.code.padEnd(12)} ${p.name.substring(0, 55).padEnd(57)} ${p.degree.padEnd(6)} ${p.level.padEnd(14)} ${p.duration}yr`);
    }
    console.log('');
  }

  // Check for unknown facultiess
  const knownFaculties = Object.keys(expected);
  for (const [faculty, progs] of Object.entries(byFaculty)) {
    if (!knownFaculties.includes(faculty)) {
      console.log(`⚠️  Programmes in unknown faculty "${faculty}": ${progs.map(p => p.code).join(', ')}`);
    }
  }

  console.log('='.repeat(60));
  console.log('  VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`  ✅ Programmes correctly seeded: ${totalOk}`);
  console.log(`  ❌ Missing programmes:          ${totalMissing}`);
  console.log(`  📊 Total in database:           ${data.total}`);
  
  if (totalMissing === 0) {
    console.log('\n  ✅ ALL CHECKS PASSED - Seeding successful!');
  } else {
    console.log('\n  ⚠️  Some programmes are missing - may need re-run');
  }
  console.log('='.repeat(60));
}

main().catch(console.error);

