import React, { useState, useEffect } from 'react';
import { 
  LogOut, Menu, X, Users, BarChart3, LogIn, AlertCircle, 
  FileText, Search, ChevronDown, Eye, Trash2, Edit, Plus,
  TrendingUp, UserCheck, Clock, Star, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import DashboardNavbar from '../components/DashboardNavbar';

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
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

        // Fetch counselor reviews
        try {
          const reviewsRes = await api.get('/api/v1/admin/reviews');
          console.log('Reviews response:', reviewsRes.data);
          if (mounted && reviewsRes.data?.data && reviewsRes.data.data.length > 0) {
            setReviews(reviewsRes.data.data);
            console.log('Reviews loaded:', reviewsRes.data.data.length);
          }
        } catch (err) {
          console.warn('Reviews fetch failed:', err.message);
        }

        // Fetch student reports
        try {
          const reportsRes = await api.get('/api/v1/reports');
          console.log('Raw Reports response:', reportsRes.data);
          if (mounted) {
            // Laravel paginated response structure: 
            // API returns { data: <PaginatedObject>, message: "..." }
            // PaginatedObject serializes to { data: [...], current_page, per_page, total, ... }
            // So we get: reportsRes.data = { data: { data: [...], ... }, message: "..." }
            
            let reportsData = [];
            
            // The actual array is at reportsRes.data.data.data
            if (reportsRes.data?.data?.data && Array.isArray(reportsRes.data.data.data)) {
              reportsData = reportsRes.data.data.data;
              console.log('✓ Extracted reports from reportsRes.data.data.data');
            }
            // Fallback: check if reportsRes.data.data is already an array (flat structure)
            else if (Array.isArray(reportsRes.data.data)) {
              reportsData = reportsRes.data.data;
              console.log('✓ Extracted reports from reportsRes.data.data');
            }
            // Fallback: check if reportsRes.data is directly an array
            else if (Array.isArray(reportsRes.data)) {
              reportsData = reportsRes.data;
              console.log('✓ Extracted reports from reportsRes.data');
            }
            
            setReports(reportsData);
            console.log(`✓ Reports loaded: ${reportsData.length} reports`);
          }
        } catch (err) {
          console.error('✗ Reports fetch failed:', err.message);
          if (mounted) setReports([]);
        }

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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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
    { id: 'reviews', label: 'Counselor Reviews', icon: Star },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <>
      <DashboardNavbar user={user} userRole="admin" activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 animate-fade-in">
      {/* Sidebar - Enhanced */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/40 shadow-2xl transition-all duration-300 fixed h-full z-40 flex flex-col overflow-y-auto border-r border-green-200 dark:border-green-900/50`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-green-200 dark:border-green-900/50 flex-shrink-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-sm">🌿</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Admin Panel</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition transform hover:scale-110 duration-300"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation - Enhanced */}
        <nav className="px-4 space-y-1 overflow-y-auto py-6">
          {sidebarItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition transform duration-300 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105 card-hover'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/20'
                }`}
                style={{
                  animation: `slideInFromLeft 0.4s ease-out ${idx * 0.05}s backwards`
                }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Profile Section at Bottom - Enhanced */}
        <div className="sticky bottom-0 p-4 border-t border-green-200 dark:border-green-900/50 space-y-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-t-2xl mx-2 mb-2">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transform hover:scale-110 transition-transform duration-300">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold tracking-wide">Logged in as</p>
                  <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">{user?.name}</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate px-1">{user?.email}</p>
            )}
          </div>
          {sidebarOpen && (
            <>
              <button
                onClick={() => {}}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-xs font-medium transition transform hover:scale-105 shadow-md"
              >
                <User className="w-3.5 h-3.5" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg text-xs font-medium transition transform hover:scale-105 shadow-md"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
        {/* Top Bar - Enhanced */}
        <div className="h-20 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg border-b-2 border-green-200 dark:border-green-900/50 flex items-center justify-between px-8 animate-slide-in-top">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center shadow-md transform hover:scale-110 transition-transform duration-300">
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize font-medium">Admin</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-teal-950">
          <div className="p-8">
            {/* Dashboard Tab - Enhanced */}
            {activeTab === 'dashboard' && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                  <span className="text-3xl">📊</span> Dashboard Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-item">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-7 border-l-4 border-green-600 card-hover animate-slide-in-bottom" style={{animationDelay: '0.1s'}}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">Total Users</p>
                        <p className="text-4xl font-bold text-green-600 mt-3">{allUsers.length}</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-900/50 rounded-full flex items-center justify-center text-2xl">
                        👥
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-7 border-l-4 border-emerald-600 card-hover animate-slide-in-bottom" style={{animationDelay: '0.2s'}}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">Counselors</p>
                        <p className="text-4xl font-bold text-emerald-600 mt-3">{counselors.length}</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-900/50 rounded-full flex items-center justify-center text-2xl">
                        💼
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-7 border-l-4 border-teal-600 card-hover animate-slide-in-bottom" style={{animationDelay: '0.3s'}}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">Students</p>
                        <p className="text-4xl font-bold text-teal-600 mt-3">{students.length}</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-900/50 rounded-full flex items-center justify-center text-2xl">
                        🎓
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-7 border-l-4 border-red-600 card-hover animate-slide-in-bottom" style={{animationDelay: '0.4s'}}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">Pending Reports</p>
                        <p className="text-4xl font-bold text-red-600 mt-3">{reports.filter(r => r.status === 'pending').length}</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-900/50 rounded-full flex items-center justify-center text-2xl">
                        ⚠️
                      </div>
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
                          <Search className="absolute left-3 top-3 w-5 h-5 text-green-400" />
                          <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border-2 border-green-200 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 dark:bg-gray-700 dark:text-white transition-all hover:border-green-300"
                          />
                        </div>
                      </div>
                      <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border-2 border-green-200 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 dark:bg-gray-700 dark:text-white transition-all hover:border-green-300"
                      >
                        <option value="all">All Roles</option>
                        <option value="student">Students</option>
                        <option value="counselor">Counselors</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-b-2 border-green-200 dark:border-green-700">
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
                              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium capitalize">
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
                              <button 
                                onClick={() => {
                                  setSelectedUser(u);
                                  setShowDetailModal(true);
                                }}
                                className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded text-green-600 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded text-emerald-600 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 transition-colors">
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
                          <button 
                            onClick={() => {
                              setSelectedUser(c);
                              setShowDetailModal(true);
                            }}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">View</button>
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
                            <button 
                              onClick={() => {
                                setSelectedUser(s);
                                setShowDetailModal(true);
                              }}
                              className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600">
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Student Reports & Feedback</h2>

                {reports && reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map(report => {
                      try {
                        return (
                          <div key={report?.id} className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded text-xs font-medium capitalize">
                                    {report.report_type}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{report.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                  <span>From: <strong>{report.user?.name || 'Unknown'}</strong></span>
                                  <span>Email: {report.user?.email || 'N/A'}</span>
                                  <span>Date: {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'N/A'}</span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(report.status)}`}>
                                  {report.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <select 
                                value={report.status}
                                onChange={(e) => {
                                  api.put(`/api/v1/reports/${report.id}/status`, { status: e.target.value })
                                    .then(() => {
                                      const updatedReports = reports.map(r => 
                                        r.id === report.id ? { ...r, status: e.target.value } : r
                                      );
                                      setReports(updatedReports);
                                    })
                                    .catch(err => {
                                      console.error('Failed to update status:', err);
                                      alert('Failed to update report status');
                                    });
                                }}
                                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm border border-gray-300 dark:border-gray-600"
                              >
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                              </select>
                            </div>
                          </div>
                        );
                      } catch (err) {
                        console.error('Error rendering report:', err);
                        return <div key={report?.id} className="bg-red-100 dark:bg-red-900/30 p-4 rounded text-red-800 dark:text-red-400">Error loading report</div>;
                      }
                    })}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No reports submitted yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Counselor Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Counselor Reviews</h2>

                {reviews.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                    <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {review.counselor_name}
                              </h3>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                {review.rating}/5
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              By: <strong>{review.student_name}</strong> ({review.student_email})
                            </p>
                            {review.comment && (
                              <p className="text-gray-700 dark:text-gray-300 mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                                "{review.comment}"
                              </p>
                            )}
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Submitted: {new Date(review.submitted_at).toLocaleDateString()} at {new Date(review.submitted_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Details</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedUser(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">{selectedUser.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Created Date</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{formatDate(selectedUser.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info if available */}
              {selectedUser.phone && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h3>
                  <p className="text-gray-900 dark:text-white">{selectedUser.phone}</p>
                </div>
              )}

              {selectedUser.address && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Address</h3>
                  <p className="text-gray-900 dark:text-white">{selectedUser.address}</p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default AdminDashboard;
