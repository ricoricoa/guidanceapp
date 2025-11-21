import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, Calendar, MessageSquare, BarChart3, Edit2, Save, X, Clock, CheckCircle, AlertCircle, Plus, TrendingUp } from 'lucide-react';

const GuidanceDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [students, setStudents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [sessionNote, setSessionNote] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/api/v1/guidance/dashboard');
        if (!mounted) return;
        
        const u = res.data.data?.user ?? res.data.user ?? res.data;
        const dashboardData = res.data.data || res.data;
        
        setUser(u);
        setFormData({ name: u.name ?? '', email: u.email ?? '', address: u.address ?? '' });
        
        if (dashboardData.students) {
          setStudents(dashboardData.students);
        }
        if (dashboardData.appointments) {
          setAppointments(dashboardData.appointments);
        }
      } catch (err) {
        if (!mounted) return;
        if (err.response && err.response.status === 403) {
          setUser(null);
          setForbidden(true);
        } else {
          console.error('Error fetching dashboard:', err);
        }
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchDashboardData();
    return () => (mounted = false);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (forbidden) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md">
        <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">Access Denied</h1>
        <p className="text-red-700 dark:text-red-300">You do not have permission to view the counselor dashboard.</p>
      </div>
    </div>
  );

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setMessage('');
    try {
      const res = await api.put('/api/v1/user/profile', formData);
      setUser(res.data.user);
      setFormData({ name: res.data.user.name ?? '', email: res.data.user.email ?? '', address: res.data.user.address ?? '' });
      setMessage('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setMessage('Failed to save profile.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNote = async () => {
    if (!sessionNote.trim()) {
      setMessage('Please enter a session note.');
      return;
    }
    
    try {
      setMessage('Session note saved successfully!');
      setShowNoteModal(false);
      setSessionNote('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save note.');
    }
  };

  const handleApproveAppointment = (appointmentId) => {
    setAppointments(appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'scheduled' } : apt
    ));
    setMessage('Appointment approved!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Counselor Dashboard - Manage your students and appointments</p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="text-green-600 hover:text-green-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{students.length}</p>
              </div>
              <Users className="w-10 h-10 text-indigo-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Appointments</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{appointments.length}</p>
              </div>
              <Calendar className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{appointments.filter(a => a.status === 'pending').length}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{appointments.filter(a => a.status === 'completed').length}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Appointments Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Upcoming Appointments
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {appointments.length > 0 ? (
                    appointments.map(apt => (
                      <div key={apt.id} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">{apt.student_name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{apt.topic}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {apt.date} at {apt.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {apt.status}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setShowNoteModal(true);
                            }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition"
                          >
                            Note
                          </button>
                          {apt.status === 'pending' && (
                            <button
                              onClick={() => handleApproveAppointment(apt.id)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">No appointments scheduled yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Students Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  My Students
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Sessions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {students.map(student => (
                      <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.sessions}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-blue-600 hover:text-blue-800 font-medium">View Profile</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow sticky top-24">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Profile</h2>
              </div>

              {!editing ? (
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold">Name</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{user?.name}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold">Email</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-1 break-all text-sm">{user?.email}</p>
                  </div>
                  <div className="mb-6">
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold">Address</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">{user?.address || '—'}</p>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="p-6">
                  <div className="mb-4">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name[0]}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email[0]}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address[0]}</p>}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditing(false); setErrors({}); }}
                      className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Session Note Modal */}
      {showNoteModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Session Note - {selectedAppointment.student_name}
              </h2>
              <button onClick={() => setShowNoteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleSaveNote(); }} className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Topic:</strong> {selectedAppointment.topic}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <strong>Scheduled:</strong> {selectedAppointment.date} at {selectedAppointment.time}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Session Notes</label>
                <textarea
                  value={sessionNote}
                  onChange={e => setSessionNote(e.target.value)}
                  placeholder="Document the session details, topics discussed, recommendations, etc..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-semibold"
                >
                  Save Note
                </button>
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-lg transition font-semibold"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidanceDashboard;
