// Check what faculties and departments exist in the database
const API = 'http://localhost:3001/api';

async function main() {
  console.log('🔍 CHECKING EXISTING FACULTIES & DEPARTMENTS IN DATABASE\n');
  
  // Fetch all faculties
  const res = await fetch(`${API}/faculties`);
  const data = await res.json();
  
  const faculties = data.data || data;
  
  console.log(`📊 Total academic units: ${faculties.length}\n`);
  
  for (const f of faculties) {
    console.log(`🏛️  ${f.name} (${f.abbreviation || 'N/A'}) — ID: ${f.id}`);
    console.log(`   Type: ${f.type}, Departments: ${f._count?.departments || 0}`);
    
    // Fetch departments for this faculty
    if (f.id) {
      const deptRes = await fetch(`${API}/faculties/${f.id}/departments`);
      const deptData = await deptRes.json();
      const departments = deptData.data || deptData;
      
      if (departments && departments.length > 0) {
        for (const d of departments) {
          console.log(`   📂 ${d.name} (${d.abbreviation || 'N/A'}) — ID: ${d.id} — ${d._count?.programmes || 0} programmes`);
        }
      }
    }
    console.log('');
  }
  
  console.log('='.repeat(60));
}

main().catch(console.error);

