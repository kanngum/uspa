// Debug auth - check admin user and login
const API = 'http://localhost:3001/api';

async function main() {
  // Try login with admin@uba.cm
  console.log('Trying login with admin@uba.cm...');
  let res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@uba.cm', password: 'admin123' }),
  });
  let data = await res.json();
  console.log('Login response:', JSON.stringify(data, null, 2));
  
  if (data.success) {
    const token = data.data.token;
    console.log('\nToken:', token.substring(0, 50) + '...');
    
    // Decode JWT payload
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    console.log('JWT Payload:', payload);
    
    // Try get profile
    res = await fetch(`${API}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const profile = await res.json();
    console.log('\nProfile:', JSON.stringify(profile, null, 2));
    
    // Try admin programmes
    res = await fetch(`${API}/admin/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const stats = await res.json();
    console.log('\nAdmin Stats:', JSON.stringify(stats, null, 2));
    
    // Try create a simple programme
    res = await fetch(`${API}/admin/programmes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        departmentId: 'cmrxq8t7y0035tokchtk5vtqh',
        code: 'TEST-PROG',
        name: 'Test Programme - Delete Me',
        degree: 'LLB',
        level: 'UNDERGRADUATE',
        duration: 3,
        description: 'Test programme for debugging'
      })
    });
    const createResult = await res.json();
    console.log('\nCreate test programme:', JSON.stringify(createResult, null, 2));
    
    // Try ngumkan@gmail.com
    console.log('\n\nTrying login with ngumkan@gmail.com...');
    res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ngumkan@gmail.com', password: 'kan2026' }),
    });
    data = await res.json();
    console.log('Login response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      const token2 = data.data.token;
      const parts2 = token2.split('.');
      const payload2 = JSON.parse(atob(parts2[1]));
      console.log('JWT Payload:', payload2);
    }
  }
}

main().catch(console.error);

