// Clean up test programme
const API = 'http://localhost:3001/api';

async function main() {
  // Login
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@uba.cm', password: 'admin123' }),
  });
  const data = await res.json();
  const token = data.data.token;
  
  // Delete test programme
  const del = await fetch(`${API}/admin/programmes/cmryo1jm20000ewkcz4o8iz0f`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const result = await del.json();
  console.log('Delete result:', result);
}

main().catch(console.error);
