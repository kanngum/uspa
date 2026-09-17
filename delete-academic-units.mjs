// Delete academic units: HTTTC Kumba, FET, CBMS
const API = 'http://localhost:3001/api';

const TARGETS = [
  { name: 'Higher Teacher Training College Kumba', abbreviation: 'HTTTC Kumba' },
  { name: 'Faculty of Engineering and Technology', abbreviation: 'FET' },
  { name: 'College of Business and Management Sciences', abbreviation: 'CBMS' },
];

async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@uba.cm', password: 'admin123' }),
  });
  const d = await res.json();
  return d.data.token;
}

async function getAllFaculties(token) {
  const res = await fetch(`${API}/admin/departments?limit=500`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const d = await res.json();
  
  const res2 = await fetch(`${API}/faculties`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const d2 = await res2.json();
  return d2.data || [];
}

async function getFacultyDetail(token, id) {
  const res = await fetch(`${API}/faculties/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const d = await res.json();
  return d.data;
}

async function deleteDepartment(token, id) {
  const res = await fetch(`${API}/admin/departments/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const d = await res.json();
  return d;
}

async function deleteFaculty(token, id) {
  const res = await fetch(`${API}/admin/faculties/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const d = await res.json();
  return d;
}

async function main() {
  const token = await login();
  console.log('✅ Logged in as admin\n');
  
  // Get all faculties
  const faculties = await getAllFaculties(token);
  
  for (const target of TARGETS) {
    console.log(`\n🔍 Processing: ${target.name} (${target.abbreviation})`);
    
    const faculty = faculties.find(f => 
      f.abbreviation === target.abbreviation || f.name === target.name
    );
    
    if (!faculty) {
      console.log(`❌ Not found in database`);
      continue;
    }
    
    console.log(`   Found: ID=${faculty.id}, Departments=${faculty._count?.departments || '?'}`);
    
    // Get full detail to see departments
    const detail = await getFacultyDetail(token, faculty.id);
    
    if (detail.departments && detail.departments.length > 0) {
      console.log(`   📂 ${detail.departments.length} departments found. Deleting programmes first...`);
      
      // Delete all programmes in each department
      for (const dept of detail.departments) {
        if (dept._count?.programmes > 0) {
          // Get programmes under this department
          const progRes = await fetch(`${API}/admin/programmes?departmentId=${dept.id}&limit=100`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const progData = await progRes.json();
          const programmes = progData.data || [];
          
          for (const prog of programmes) {
            const delRes = await fetch(`${API}/admin/programmes/${prog.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const delData = await delRes.json();
            if (delData.success) {
              console.log(`     🗑️  Programme: ${prog.code} - ${prog.name}`);
            } else {
              console.log(`     ❌ Programme ${prog.code}: ${delData.message}`);
            }
          }
        }
        
        // Delete department
        const deptRes = await deleteDepartment(token, dept.id);
        if (deptRes.success) {
          console.log(`     🗑️  Department: ${dept.name}`);
        } else {
          console.log(`     ❌ Department ${dept.name}: ${deptRes.message}`);
        }
      }
    }
    
    // Delete the faculty/school itself
    const result = await deleteFaculty(token, faculty.id);
    if (result.success) {
      console.log(`   ✅ ${target.name} deleted successfully`);
    } else {
      console.log(`   ❌ ${target.name}: ${result.message}`);
    }
  }
  
  console.log('\n✅ Done!');
}

main().catch(console.error);
