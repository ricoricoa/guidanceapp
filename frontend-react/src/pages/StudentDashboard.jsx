import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', address: ''});
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    api.get('/api/v1/student/dashboard')
      .then(res => {
        if (!mounted) return;
        const u = res.data.user ?? res.data.data?.user ?? res.data;
        setUser(u);
        setFormData({ name: u.name ?? '', email: u.email ?? '', address: u.address ?? '' });
      })
      .catch((err) => {
        if (!mounted) return;
        if (err.response && err.response.status === 403) {
          setUser(null);
          // mark forbidden state by setting a sentinel error
          setForbidden(true);
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  if (forbidden) return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Forbidden</h1>
      <p className="text-gray-600">You do not have permission to view the student dashboard.</p>
    </div>
  );
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      {user ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <p className="text-lg">Welcome, <strong>{user.name}</strong></p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Role: {user.role ?? 'student'}</p>
          <div className="mt-4">
            <p className="text-sm">This is a placeholder student dashboard. Add student-specific components here (appointments, resources, history).</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Unable to fetch user information.</p>
      )}

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
        {message && <p className="mb-3 text-green-600">{message}</p>}
        {!editing ? (
          <div>
            <p className="mb-1"><strong>Name:</strong> {user?.name}</p>
            <p className="mb-1"><strong>Email:</strong> {user?.email}</p>
            <p className="mb-1"><strong>Address:</strong> {user?.address ?? '—'}</p>
            <button onClick={() => setEditing(true)} className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded">Edit Profile</button>
          </div>
        ) : (
          <form onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true); setErrors({}); setMessage('');
            try {
              const res = await api.put('/api/v1/user/profile', formData);
              setUser(res.data.user);
              setFormData({ name: res.data.user.name ?? '', email: res.data.user.email ?? '', address: res.data.user.address ?? '' });
              setMessage('Profile updated successfully.');
              setEditing(false);
            } catch (err) {
              if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors || {});
              } else {
                setMessage('Failed to save profile.');
              }
            } finally { setSaving(false); }
          }}>
            <label className="block text-sm font-medium mt-2">Name</label>
            <input className="w-full border rounded px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            {errors.name && <p className="text-red-600 text-sm">{errors.name[0]}</p>}

            <label className="block text-sm font-medium mt-2">Email</label>
            <input className="w-full border rounded px-3 py-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            {errors.email && <p className="text-red-600 text-sm">{errors.email[0]}</p>}

            <label className="block text-sm font-medium mt-2">Address</label>
            <input className="w-full border rounded px-3 py-2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            {errors.address && <p className="text-red-600 text-sm">{errors.address[0]}</p>}

            <div className="mt-4">
              <button disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded mr-2">{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={() => { setEditing(false); setErrors({}); setMessage(''); }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
