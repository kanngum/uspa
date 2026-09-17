// Add Faculty of Economics and Management Sciences (FEMS) programmes
const API = 'http://localhost:3001/api';

const DEPARTMENTS = {
  ACC: 'cmrxq8t66002ctokciq75a1ow',
  BNF: 'cmrxq8t68002dtokchr0w8pua',
  ECN: 'cmrxq8t6b002ftokclr8fn7si',
  MGT: 'cmrxq8t6d002gtokcd4dhu3v3',
};

const programmes = [
  // Accounting
  { name: 'BSc. Accounting', code: 'ACC', degree: 'BSC', level: 'UNDERGRADUATE', duration: 3, description: 'Four (4) O/Level subjects including English and Mathematics. At least two A/Level subjects excluding Religious Knowledge with A/Level Economics or related disciplines as an advantage. Or BAC (A, B, C, D, G2, G2, G3) with pass in English Language at Probatoire. Fees: 50,000 FRS CFA.', departmentId: DEPARTMENTS.ACC },
  { name: 'Conversion MSc. Accounting', code: 'CACC', degree: 'MSC', level: 'POSTGRADUATE', duration: 1, description: 'Holders of Professional Master Degrees; MBA; DIPET II; DIPES II or any other Professional Master Degree in a related field. Must hold BSc in Accounting or related field. Registration: 50,000 FCFA. Programme Fee: 500,000 FCFA.', departmentId: DEPARTMENTS.ACC },
  { name: 'M.Sc. in Accounting', code: 'MACC', degree: 'MSC', level: 'POSTGRADUATE', duration: 2, description: 'At least 2nd Class Lower Division BSc in Accounting or equivalent. Fees: 50,000 FRS CFA.', departmentId: DEPARTMENTS.ACC },

  // Economics
  { name: 'BSc. Economics', code: 'ECN', degree: 'BSC', level: 'UNDERGRADUATE', duration: 3, description: 'GCE A Level in at least two papers excluding Religious Knowledge with A/Level Economics as advantage. Four O/Level subjects including English and Mathematics. Fees: 50,000 FRS CFA.', departmentId: DEPARTMENTS.ECN },
  { name: 'Conversion MSc. Economics', code: 'CECN', degree: 'MSC', level: 'POSTGRADUATE', duration: 1, description: 'Holders of Professional Master Degrees; MBA; DIPET II; DIPES II. Must hold BSc in related field. Pre-registration: 25,000 FCFA. Programme Fee: 500,000 FCFA.', departmentId: DEPARTMENTS.ECN },
  { name: 'Masters in Health Economics, Policy and Management', code: 'HEPM', degree: 'MSC', level: 'POSTGRADUATE', duration: 2, description: 'BA or BSc from any recognised institution. Registration: 25,000 FCFA. Programme Fee: 600,000 FCFA.', departmentId: DEPARTMENTS.ECN },
  { name: 'Masters in Environmental Economics, Policy and Management', code: 'MEEPM', degree: 'MSC', level: 'POSTGRADUATE', duration: 2, description: 'BA or BSc from any recognized institution. Registration: 25,000 FCFA. Programme Fee: 600,000 FCFA.', departmentId: DEPARTMENTS.ECN },
  { name: 'M.Sc. in Economics', code: 'MECN', degree: 'MSC', level: 'POSTGRADUATE', duration: 2, description: 'At least 2nd Class Lower Division BSc in Economics/Accounting. Pre-registration: 25,000 FRS. Fees: 50,000 FRS CFA.', departmentId: DEPARTMENTS.ECN },

  // Management and Marketing
  { name: 'BSc. Management', code: 'MGT-BA', degree: 'BSC', level: 'UNDERGRADUATE', duration: 3, description: 'GCE A Level in at least two papers with pass at O/L English and Mathematics. Fees: 50,000 FRS.', departmentId: DEPARTMENTS.MGT },
  { name: 'Conversion MSc. Management', code: 'CMGT', degree: 'MSC', level: 'POSTGRADUATE', duration: 1, description: 'Holders of MBA, DIPES II or DIPET II in Management. Pre-registration: 25,000 FRS. Programme Fee: 500,000 FCFA.', departmentId: DEPARTMENTS.MGT },
  { name: 'MSc. Marketing', code: 'MKT-MA', degree: 'MSC', level: 'POSTGRADUATE', duration: 2, description: 'First Degree in Management or related field. Pre-registration: 25,000 FRS. Fees: 50,000 FRS.', departmentId: DEPARTMENTS.MGT },
  { name: 'Masters in Human Resource Management', code: 'MHRM', degree: 'MSC', level: 'POSTGRADUATE', duration: 2, description: 'BSc, BBA, BTech, DIPES I, DIPET I from any recognized institution. Registration: 25,000 FCFA. Programme Fee: 600,000 FCFA.', departmentId: DEPARTMENTS.MGT },
  { name: 'BSc. Marketing', code: 'MKTG', degree: 'BSC', level: 'UNDERGRADUATE', duration: 3, description: 'GCE A/L in at least two subjects. GCE O/L in at least four subjects including English Language and Mathematics.', departmentId: DEPARTMENTS.MGT },
  { name: 'M.Sc. in Management', code: 'MMGT', degree: 'MSC', level: 'POSTGRADUATE', duration: 2, description: 'First Degree in Management or related field. Pre-registration: 25,000 FRS. Fees: 50,000 FRS.', departmentId: DEPARTMENTS.MGT },
  { name: 'Conversion M.Sc. In Marketing', code: 'CMKT', degree: 'MSC', level: 'POSTGRADUATE', duration: 1, description: 'First Degree in Marketing or related field. Pre-registration: 25,000 FRS. Fees: 500,000 FRS.', departmentId: DEPARTMENTS.MGT },
  { name: 'Masters in Finance and Investment', code: 'MFI', degree: 'MSC', level: 'POSTGRADUATE', duration: 2, description: 'BA or BSc with GPA of at least 2.5/4.0 in a related field. Registration: 25,000 FCFA. Programme Fee: 600,000 FCFA.', departmentId: DEPARTMENTS.MGT },

  // Banking and Finance
  { name: 'BSc. Banking and Finance', code: 'BNF', degree: 'BSC', level: 'UNDERGRADUATE', duration: 3, description: 'GCE A/L in at least two subjects. GCE O/L in at least four subjects including English and Mathematics. HND, B-Tech for Year III. Fees: 50,000 FRS.', departmentId: DEPARTMENTS.BNF },
  { name: 'MSc. Quantitative Finance', code: 'QF', degree: 'MSC', level: 'POSTGRADUATE', duration: 2, description: 'A Bachelors in any related field.', departmentId: DEPARTMENTS.BNF },
  { name: 'Bachelor of Science in Islamic Banking and Finance', code: 'IBF', degree: 'BSC', level: 'UNDERGRADUATE', duration: 3, description: 'At least 4 O/Level subjects including English and Mathematics/Statistics. At least 2 A/Level subjects excluding Religious Studies. Fees: 50,000 FRS.', departmentId: DEPARTMENTS.BNF },
  { name: 'Conversion MSc. Banking and Finance', code: 'CBAF', degree: 'MSC', level: 'POSTGRADUATE', duration: 1, description: 'Holders of Professional Master Degrees in MBA, DIPET II, DIPES II. Must hold BSc in Banking and Finance or related field. Registration: 25,000 FCFA. Programme Fee: 500,000 FCFA.', departmentId: DEPARTMENTS.BNF },
  { name: 'MSc. Banking and Finance', code: 'MBF', degree: 'MSC', level: 'POSTGRADUATE', duration: 2, description: 'At least 2nd Class Lower Division BSc in Economics/Accounting/Banking and Finance. Pre-registration: 25,000 FRS CFA. Fee: 50,000 FCFA per year.', departmentId: DEPARTMENTS.BNF },
];

async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ngumkan@gmail.com', password: 'kan2026' }),
  });
  const d = await res.json();
  if (!d.success) throw new Error('Login failed: ' + JSON.stringify(d));
  console.log('✅ Logged in');
  return d.data.token;
}

async function main() {
  const token = await login();
  console.log(`📋 Adding ${programmes.length} FEMS programmes...\n`);

  let added = 0, skipped = 0, errors = 0;
  for (const prog of programmes) {
    process.stdout.write(`  ${prog.code}... `);
    try {
      const res = await fetch(`${API}/admin/programmes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(prog),
      });
      const data = await res.json();
      if (data.success) {
        console.log(`✅`);
        added++;
      } else if (data.message && data.message.includes('already exists')) {
        console.log(`⚠️ exists`);
        skipped++;
      } else {
        console.log(`❌ ${data.message || JSON.stringify(data).slice(0,80)}`);
        errors++;
      }
    } catch (err) {
      console.log(`❌ ${err.message}`);
      errors++;
    }
  }
  console.log(`\n📊 Added: ${added}, Skipped: ${skipped}, Errors: ${errors}`);
}

main().catch(console.error);
