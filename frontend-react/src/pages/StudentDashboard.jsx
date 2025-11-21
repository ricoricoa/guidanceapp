import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  LogOut, Menu, X, Home, Calendar, FileText, MessageSquare, 
  User, Settings, Bell, Search, ChevronDown, Award, Clock, 
  CheckCircle, AlertCircle, Edit2, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [stats, setStats] = useState({ upcoming_sessions: 0, completed_sessions: 0, total_sessions: 0, messages: 0, resources: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/api/v1/student/dashboard');
        if (!mounted) return;
        
        const u = res.data.data?.user ?? res.data.user ?? res.data;
        const dashboardData = res.data.data || res.data;
        
        setUser(u);
        setFormData({ name: u.name ?? '', email: u.email ?? '', address: u.address ?? '' });
        
        if (dashboardData.stats) {
          setStats(dashboardData.stats);
        }
        if (dashboardData.recent_activities) {
          setRecentActivities(dashboardData.recent_activities);
        }
        if (dashboardData.upcoming_appointments) {
          setUpcomingAppointments(dashboardData.upcoming_appointments);
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

  const handleLogout = async () => {
    try {
      await api.post('/api/logout');
      localStorage.removeItem('authToken');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setMessage('');
    try {
      const res = await api.put('/api/v1/user/profile', formData);
      const updatedUser = res.data.user ?? res.data.data?.user;
      setUser(updatedUser);
      setFormData({ name: updatedUser.name ?? '', email: updatedUser.email ?? '', address: updatedUser.address ?? '' });
      setMessageType('success');
      setMessage('Profile updated successfully.');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setMessageType('error');
        setMessage('Failed to save profile.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You do not have permission to access the student dashboard.</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 fixed h-full z-40`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">Guidance</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-2">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
        {/* Top Bar */}
        <div className="h-20 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 ml-8">
            {/* Notifications */}
            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Notification Dropdown */}
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notif => (
                    <div key={notif.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{notif.title}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{notif.description}</p>
                      <p className="text-gray-500 text-xs mt-2">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Student</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Here's your dashboard overview</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Upcoming Sessions</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.upcoming_sessions}</p>
                      </div>
                      <Calendar className="w-10 h-10 text-blue-500 opacity-20" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Completed Sessions</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.completed_sessions}</p>
                      </div>
                      <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Total Sessions</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total_sessions}</p>
                      </div>
                      <MessageSquare className="w-10 h-10 text-purple-500 opacity-20" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Resources</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.resources}</p>
                      </div>
                      <FileText className="w-10 h-10 text-orange-500 opacity-20" />
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activities</h2>
                  {recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={activity.id || index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 dark:text-white font-medium">Session with {activity.counselor_name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{activity.topic}</p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full capitalize">
                            {activity.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">No recent activities yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Profile Settings</h1>

                {message && (
                  <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
                    messageType === 'success'
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                  }`}>
                    {messageType === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span>{message}</span>
                  </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
                  {!editing ? (
                    <div>
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                          <span className="text-3xl text-indigo-600 dark:text-indigo-400 font-bold">
                            {user?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</p>
                          <p className="text-gray-600 dark:text-gray-400">Student Account</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Email Address</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">{user?.email}</p>
                        </div>
                        <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">{user?.address || 'Not provided'}</p>
                        </div>
                        <div className="pb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white mt-1 capitalize">{user?.role}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setEditing(true)}
                        className="mt-8 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProfile}>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
                          />
                          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name[0]}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
                          />
                          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email[0]}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Address
                          </label>
                          <input
                            type="text"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
                          />
                          {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address[0]}</p>}
                        </div>
                      </div>

                      <div className="flex gap-4 mt-8">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(false);
                            setErrors({});
                            setFormData({ name: user?.name ?? '', email: user?.email ?? '', address: user?.address ?? '' });
                          }}
                          className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Other Tabs Placeholder */}
            {activeTab !== 'overview' && activeTab !== 'profile' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 capitalize">
                  {activeTab}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  The {activeTab} section is coming soon. Stay tuned!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
