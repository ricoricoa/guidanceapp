// Quick test - check what structure we're receiving
// Run this in browser console on admin dashboard
fetch('http://localhost:8001/api/v1/reports', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Accept': 'application/json'
  }
})
.then(res => res.json())
.then(data => {
  console.log('=== Full Response ===', data);
  console.log('data.data type:', typeof data.data);
  console.log('data.data is array:', Array.isArray(data.data));
  console.log('data.data.data exists:', !!data.data?.data);
  console.log('data.data.data type:', typeof data.data?.data);
  console.log('data.data.data is array:', Array.isArray(data.data?.data));
  console.log('data.data.data length:', data.data?.data?.length);
  console.log('First item:', data.data?.data?.[0]);
})
.catch(err => console.error('Error:', err));
