import React, { useState, useEffect } from 'react';
import { 
  LogOut, Menu, X, Users, BarChart3, LogIn, AlertCircle, 
  FileText, Search, ChevronDown, Eye, Trash2, Edit, Plus,
  TrendingUp, UserCheck, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [allUsers, setAllUsers] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Fetch admin dashboard data
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        console.log('Fetching admin dashboard data...');

        // Fetch dashboard summary
        try {
          const summaryRes = await api.get('/api/v1/admin/dashboard-summary');
          if (mounted) {
            const u = summaryRes.data?.user ?? summaryRes.data;
            setUser(u);
            console.log('Dashboard summary:', u);
          }
        } catch (err) {
          console.warn('Dashboard summary failed:', err.message);
        }

        // Fetch all users
        try {
          const usersRes = await api.get('/api/v1/admin/users');
          console.log('All users response:', usersRes.data);
          if (mounted && usersRes.data?.data && usersRes.data.data.length > 0) {
            setAllUsers(usersRes.data.data);
            console.log('All users loaded:', usersRes.data.data.length);
          }
        } catch (err) {
          console.warn('Users fetch failed:', err.message);
        }

        // Fetch counselors
        try {
          const counselorsRes = await api.get('/api/v1/admin/counselors');
          console.log('Counselors response:', counselorsRes.data);
          if (mounted && counselorsRes.data?.data && counselorsRes.data.data.length > 0) {
            setCounselors(counselorsRes.data.data);
            console.log('Counselors loaded:', counselorsRes.data.data.length);
          }
        } catch (err) {
          console.warn('Counselors fetch failed:', err.message);
        }

        // Fetch students
        try {
          const studentsRes = await api.get('/api/v1/admin/students');
          console.log('Students response:', studentsRes.data);
          if (mounted && studentsRes.data?.data && studentsRes.data.data.length > 0) {
            setStudents(studentsRes.data.data);
            console.log('Students loaded:', studentsRes.data.data.length);
          }
        } catch (err) {
          console.warn('Students fetch failed:', err.message);
        }

        // Fetch login history with real data from backend
        try {
          const historyRes = await api.get('/api/v1/admin/login-history');
          console.log('Login history response:', historyRes.data);
          if (mounted && historyRes.data?.data && historyRes.data.data.length > 0) {
            setLoginHistory(historyRes.data.data);
            console.log('Login history loaded:', historyRes.data.data.length);
          }
        } catch (err) {
          console.warn('Login history fetch failed:', err.message);
        }

        // Mock reports for now
        setReports([
          { id: 1, user_name: 'Juan Dela Cruz', report_type: 'System Issue', title: 'Chat feature not loading', description: 'When I click messages, the counselor list does not appear', created_at: new Date(Date.now() - 86400000), status: 'open', priority: 'high' },
          { id: 2, user_name: 'Maria Santos Jr', report_type: 'Suggestion', title: 'Add file sharing', description: 'Would be great to share documents with counselor', created_at: new Date(Date.now() - 172800000), status: 'in-progress', priority: 'medium' },
        ]);

      } catch (err) {
        console.error('Unexpected error fetching dashboard:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    // Auto-refresh every 5 seconds to get updated login history
    const interval = setInterval(fetchData, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
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

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = dateObj.toDateString() === today.toDateString();
    const isYesterday = dateObj.toDateString() === yesterday.toDateString();
    
    const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    if (isToday) {
      return `Today ${time}`;
    } else if (isYesterday) {
      return `Yesterday ${time}`;
    } else {
      return `${dateStr} ${time}`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'open':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 font-semibold';
      case 'medium':
        return 'text-yellow-600 font-semibold';
      case 'low':
        return 'text-green-600 font-semibold';
      default:
        return 'text-gray-600';
    }
  };

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'users', label: 'All Users', icon: Users },
    { id: 'counselors', label: 'Counselors', icon: UserCheck },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'login-history', label: 'Login History', icon: LogIn },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
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
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">Admin</span>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">Admin</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{allUsers.length}</p>
                      </div>
                      <Users className="w-10 h-10 text-blue-500 opacity-20" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Counselors</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{counselors.length}</p>
                      </div>
                      <UserCheck className="w-10 h-10 text-green-500 opacity-20" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Students</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{students.length}</p>
                      </div>
                      <Users className="w-10 h-10 text-purple-500 opacity-20" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Open Reports</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{reports.filter(r => r.status === 'open').length}</p>
                      </div>
                      <AlertCircle className="w-10 h-10 text-red-500 opacity-20" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* All Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Users</h2>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                      <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="all">All Roles</option>
                        <option value="student">Students</option>
                        <option value="counselor">Counselors</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Created</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(u => (
                          <tr key={u.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{u.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-xs font-medium capitalize">
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(u.created_at)}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(u.status)}`}>
                                {u.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm flex gap-2">
                              <button className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded text-yellow-600">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Counselors Tab */}
            {activeTab === 'counselors' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Counselors Management</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <Plus className="w-5 h-5" />
                    Add Counselor
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {counselors && counselors.length > 0 ? (
                    counselors.map(c => (
                      <div key={c.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{c.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{c.specialization || c.role}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{c.email}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">Created: {formatDate(c.created_at)}</p>
                        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{c.students || '-'}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Students assigned</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">View</button>
                          <button className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 text-sm">Edit</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                      <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No counselors found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Students Management</h2>
                </div>

                {students && students.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Created</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => (
                        <tr key={s.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{s.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{s.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(s.created_at)}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(s.status)}`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm flex gap-2">
                            <button className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded text-yellow-600">
                              <Edit className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No students found</p>
                  </div>
                )}
              </div>
            )}

            {/* Login History Tab */}
            {activeTab === 'login-history' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Login History</h2>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">User Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Login Time</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Logout Time</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loginHistory.map(log => {
                        const duration = log.logout_time 
                          ? Math.round((new Date(log.logout_time) - new Date(log.login_time)) / 60000) + ' min'
                          : 'Still online';
                        return (
                          <tr key={log.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{log.user_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{log.email}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-xs font-medium capitalize">
                                {log.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(log.login_time)}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{log.logout_time ? formatDate(log.logout_time) : '-'}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{duration}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Reports & Feedback</h2>

                <div className="space-y-4">
                  {reports.map(report => (
                    <div key={report.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded text-xs font-medium">
                              {report.report_type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{report.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>From: <strong>{report.user_name}</strong></span>
                            <span>Date: {new Date(report.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(report.priority)}`}>
                            {report.priority} Priority
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">View Details</button>
                        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Mark Resolved</button>
                        <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm">Change Priority</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
