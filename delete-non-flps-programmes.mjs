// Delete all programmes EXCEPT those under Faculty of Law and Political Science (FLPS)
const API = 'http://localhost:3001/api';

async function login() {
  // The admin user seeded in the database
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ngumkan@gmail.com', password: 'kan2026' }),
  });
  const d = await res.json();
  if (!d.success) {
    // Fallback to other possible admin credentials
    console.log('❌ First login attempt failed, trying admin@uba.cm...');
    const res2 = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@uba.cm', password: 'admin123' }),
    });
    const d2 = await res2.json();
    if (!d2.success) throw new Error('Login failed with both credentials: ' + JSON.stringify(d2));
    console.log('✅ Logged in as admin (admin@uba.cm)');
    return d2.data.token;
  }
  console.log('✅ Logged in as admin (ngumkan@gmail.com)');
  return d.data.token;
}

async function getAllProgrammes(token) {
  const limit = 500;
  let page = 1;
  let allProgrammes = [];
  let total = 0;

  do {
    const res = await fetch(`${API}/admin/programmes?limit=${limit}&page=${page}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const d = await res.json();
    if (!d.success) throw new Error('Failed to fetch programmes: ' + JSON.stringify(d));
    
    const programmes = d.data || [];
    allProgrammes = allProgrammes.concat(programmes);
    total = d.total || programmes.length;
    page++;
  } while (allProgrammes.length < total);

  return allProgrammes;
}

async function deleteProgramme(token, id, code, name) {
  try {
    const res = await fetch(`${API}/admin/programmes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const d = await res.json();
    if (d.success) {
      console.log(`   🗑️  Deleted: ${code} - ${name}`);
      return true;
    } else {
      console.log(`   ❌ Failed: ${code} - ${d.message || d.error}`);
      return false;
    }
  } catch (err) {
    console.log(`   ❌ Error: ${code} - ${err.message}`);
    return false;
  }
}

async function main() {
  const token = await login();

  // Get all programmes
  console.log('\n📋 Fetching all programmes...');
  const programmes = await getAllProgrammes(token);
  console.log(`   Total programmes found: ${programmes.length}\n`);

  // Separate FLPS and non-FLPS programmes
  const flpsProgrammes = [];
  const nonFlpsProgrammes = [];

  for (const prog of programmes) {
    const facultyAbbr = prog.department?.academicUnit?.abbreviation || 
                        prog.department?.faculty?.abbreviation || 
                        'UNKNOWN';
    
    if (facultyAbbr === 'FLPS' || facultyAbbr === 'FLP') {
      flpsProgrammes.push(prog);
    } else {
      nonFlpsProgrammes.push(prog);
    }
  }

  console.log(`🔵 FLPS Programmes (${flpsProgrammes.length}):`);
  flpsProgrammes.forEach(p => console.log(`   ✅ KEEP: ${p.code} - ${p.name} (${p.department?.name || '?'})`));

  console.log(`\n🔴 Non-FLPS Programmes to DELETE (${nonFlpsProgrammes.length}):`);
  nonFlpsProgrammes.forEach(p => {
    const faculty = p.department?.academicUnit?.abbreviation || '?';
    const dept = p.department?.name || '?';
    console.log(`   ${p.code} - ${p.name} [${faculty} / ${dept}]`);
  });

  if (nonFlpsProgrammes.length === 0) {
    console.log('\n✅ No non-FLPS programmes to delete!');
    return;
  }

  console.log(`\n🗑️  Deleting ${nonFlpsProgrammes.length} non-FLPS programmes...\n`);
  let deleted = 0;
  let failed = 0;

  for (const prog of nonFlpsProgrammes) {
    const ok = await deleteProgramme(token, prog.id, prog.code, prog.name);
    if (ok) deleted++;
    else failed++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Deleted: ${deleted}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   🔵 Kept (FLPS): ${flpsProgrammes.length}`);
  console.log('\n✅ Done!');
}

main().catch(console.error);

