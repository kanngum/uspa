const API = 'http://localhost:3001/api';

async function main() {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@uba.cm', password: 'admin123' }),
  });
  const d = await res.json();
  const t = d.data.token;

  // Check stats
  const statsRes = await fetch(`${API}/admin/dashboard/stats`, {
    headers: { 'Authorization': `Bearer ${t}` }
  });
  const stats = await statsRes.json();
  console.log('📊 Database Stats:', JSON.stringify(stats.data || stats, null, 2));

  // Check faculties
  const facRes = await fetch(`${API}/faculties`);
  const facs = await facRes.json();
  const faculties = facs.data || [];
  console.log(`\n🏫 Faculties remaining (${faculties.length}):`);
  faculties.forEach(f => console.log(`   - ${f.name} (${f.abbreviation}) [${f._count?.departments || 0} depts]`));
  
  // Check programmes count
  const progRes = await fetch(`${API}/admin/programmes?limit=1`, {
    headers: { 'Authorization': `Bearer ${t}` }
  });
  const progs = await progRes.json();
  console.log(`\n📚 Programmes remaining: ${progs.total || 0}`);

  // Check remaining departments
  const deptRes = await fetch(`${API}/admin/departments?limit=1`, {
    headers: { 'Authorization': `Bearer ${t}` }
  });
  const depts = await deptRes.json();
  console.log(`📂 Departments remaining: ${depts.total || 0}`);

  // Subjects
  const subjRes = await fetch(`${API}/admin/subjects?limit=1`, {
    headers: { 'Authorization': `Bearer ${t}` }
  });
  const subs = await subjRes.json();
  console.log(`📝 Subjects remaining: ${subs.total || 0}`);
}

main().catch(console.error);
