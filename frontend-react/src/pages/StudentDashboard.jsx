import React, { useEffect, useState, Suspense, lazy } from 'react';
import api from '../api/axios';
import { 
  LogOut, Menu, X, Home, Calendar, FileText, MessageSquare, 
  User, Bell, Search, Clock, CheckCircle, AlertCircle, Flag, Moon, Sun, Plus, Award, Star, Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import StudentReportForm from '../components/StudentReportForm';
import { BookAppointmentModal } from '../components/BookAppointmentModal';
import CounselorReviewsForm from '../components/CounselorReviewsForm';
import TipsBot from '../components/TipsBot';

// Lazy load ChatWithCounselor to avoid hook conflicts
const ChatWithCounselor = lazy(() => import('../components/ChatWithCounselor').then(m => ({ default: m.ChatWithCounselor })));

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ 
    upcoming_sessions: 0, 
    completed_sessions: 0, 
    total_sessions: 0, 
    messages: 0, 
    resources: 0 
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [refreshAppointments, setRefreshAppointments] = useState(0);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateRequestLoading, setCertificateRequestLoading] = useState(false);
  const [certificateFormData, setCertificateFormData] = useState({
    certificate_type: 'Good Moral',
    purpose: '',
    notes: ''
  });
  const [certificateRequests, setCertificateRequests] = useState([]);
  const [refreshCertificates, setRefreshCertificates] = useState(0);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    address: '',
    phone: '',
    date_of_birth: '',
    grade_level: '',
    guardian_name: '',
    guardian_contact: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showTipsBot, setShowTipsBot] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    let mounted = true;
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/api/v1/student/dashboard');
        if (!mounted) return;
        
        const u = res.data.data?.user ?? res.data.user ?? res.data;
        const dashboardData = res.data.data || res.data;
        
        setUser(u);
        setFormData({ 
          name: u.name ?? '', 
          email: u.email ?? '', 
          address: u.address ?? '',
          phone: u.phone ?? '',
          date_of_birth: u.date_of_birth ?? '',
          grade_level: u.grade_level ?? '',
          guardian_name: u.guardian_name ?? '',
          guardian_contact: u.guardian_contact ?? ''
        });
        if (u.profile_picture) {
          setProfilePicturePreview(u.profile_picture);
        }
        
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
        if (err.response?.status === 403) {
          setForbidden(true);
        } else {
          console.error('Error fetching dashboard:', err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => (mounted = false);
  }, []);

  // Fetch student appointments
  useEffect(() => {
    let mounted = true;
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/api/v1/student/appointments');
        if (!mounted) return;
        
        if (res.data?.data) {
          const appointmentsData = Array.isArray(res.data.data) 
            ? res.data.data.map(apt => ({
                id: apt.id,
                counselor_name: apt.counselor?.name || apt.counselor_name || 'Pending Counselor',
                topic: apt.topic,
                status: apt.status || 'pending',
                requested_date: apt.date || apt.requested_date,
                requested_time: apt.time || apt.requested_time,
                notes: apt.notes || ''
              }))
            : [];
          setUpcomingAppointments(appointmentsData);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };

    fetchAppointments();
    // Auto-refresh every 5 seconds to check for counselor responses
    const interval = setInterval(fetchAppointments, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [refreshAppointments]);

  // Fetch student certificate requests
  useEffect(() => {
    let mounted = true;
    const fetchCertificateRequests = async () => {
      try {
        const res = await api.get('/api/v1/student/certificate-requests');
        if (!mounted) return;
        
        if (res.data?.data) {
          const requestsData = Array.isArray(res.data.data) 
            ? res.data.data.map(req => ({
                id: req.id,
                certificate_type: req.certificate_type,
                purpose: req.purpose,
                status: req.status || 'pending',
                notes: req.notes,
                submitted_at: req.submitted_at || req.created_at,
                counselor_remarks: req.counselor_remarks
              }))
            : [];
          setCertificateRequests(requestsData);
        }
      } catch (err) {
        console.error('Error fetching certificate requests:', err);
      }
    };

    fetchCertificateRequests();
    // Auto-refresh every 5 seconds to check for counselor response
    const interval = setInterval(fetchCertificateRequests, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [refreshCertificates]);

  // Apply theme
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogout = async () => {
    try {
      await api.post('/api/v1/logout');
      localStorage.removeItem('authToken');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let requestConfig = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const profileData = {
        name: formData.name || '',
        email: formData.email || ''
      };

      // Only add optional fields if they have values
      if (formData.address && formData.address.trim()) {
        profileData.address = formData.address;
      }
      if (formData.phone && formData.phone.trim()) {
        profileData.phone = formData.phone;
      }
      if (formData.date_of_birth && formData.date_of_birth.trim()) {
        profileData.date_of_birth = formData.date_of_birth;
      }
      if (formData.grade_level && formData.grade_level.trim()) {
        profileData.grade_level = formData.grade_level;
      }
      if (formData.guardian_name && formData.guardian_name.trim()) {
        profileData.guardian_name = formData.guardian_name;
      }
      if (formData.guardian_contact && formData.guardian_contact.trim()) {
        profileData.guardian_contact = formData.guardian_contact;
      }

      // If there's a profile picture, use FormData instead
      if (profilePicture) {
        console.log('Profile picture found, using FormData');
        const formDataToSend = new FormData();
        formDataToSend.append('name', profileData.name);
        formDataToSend.append('email', profileData.email);
        
        if (profileData.address) formDataToSend.append('address', profileData.address);
        if (profileData.phone) formDataToSend.append('phone', profileData.phone);
        if (profileData.date_of_birth) formDataToSend.append('date_of_birth', profileData.date_of_birth);
        if (profileData.grade_level) formDataToSend.append('grade_level', profileData.grade_level);
        if (profileData.guardian_name) formDataToSend.append('guardian_name', profileData.guardian_name);
        if (profileData.guardian_contact) formDataToSend.append('guardian_contact', profileData.guardian_contact);
        
        formDataToSend.append('profile_picture', profilePicture);
        
        requestConfig.headers = {};
        const res = await api.put('/api/v1/user/profile', formDataToSend, requestConfig);
        const updatedUser = res.data.user ?? res.data.data?.user;
        
        setUser(updatedUser);
        setFormData({
          name: updatedUser.name ?? '',
          email: updatedUser.email ?? '',
          address: updatedUser.address ?? '',
          phone: updatedUser.phone ?? '',
          date_of_birth: updatedUser.date_of_birth ?? '',
          grade_level: updatedUser.grade_level ?? '',
          guardian_name: updatedUser.guardian_name ?? '',
          guardian_contact: updatedUser.guardian_contact ?? ''
        });
        
        // Update profile picture preview if server returned it
        if (updatedUser.profile_picture) {
          setProfilePicturePreview(updatedUser.profile_picture);
        }
        
        setProfilePicture(null);
      } else {
        // Use JSON when no file upload
        console.log('Sending JSON to /api/v1/user/profile:', profileData);
        const res = await api.put('/api/v1/user/profile', profileData, requestConfig);
        console.log('API Response:', res.data);
        const updatedUser = res.data.user ?? res.data.data?.user;
        
        setUser(updatedUser);
        setFormData({
          name: updatedUser.name ?? '',
          email: updatedUser.email ?? '',
          address: updatedUser.address ?? '',
          phone: updatedUser.phone ?? '',
          date_of_birth: updatedUser.date_of_birth ?? '',
          grade_level: updatedUser.grade_level ?? '',
          guardian_name: updatedUser.guardian_name ?? '',
          guardian_contact: updatedUser.guardian_contact ?? ''
        });
      }
      
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile. ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertificateRequest = async (certificateType) => {
    setCertificateRequestLoading(true);
    try {
      const res = await api.post('/api/v1/student/certificate-request', {
        certificate_type: certificateType,
        purpose: certificateFormData.purpose,
        notes: certificateFormData.notes,
        student_id: user?.id,
        student_name: user?.name,
        student_email: user?.email
      });
      
      if (res.status === 200 || res.status === 201) {
        alert(`${certificateType} Certificate request submitted successfully!`);
        setCertificateFormData({ certificate_type: 'Good Moral', purpose: '', notes: '' });
        setShowCertificateModal(false);
      }
    } catch (err) {
      console.error('Error submitting certificate request:', err);
      alert('Failed to submit certificate request. Please try again.');
    } finally {
      setCertificateRequestLoading(false);
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

  if (forbidden || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {forbidden ? 'Access Denied' : 'No User Data'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {forbidden ? 'You do not have permission to access the student dashboard.' : 'Unable to load user information. Please try logging in again.'}
          </p>
          <button 
            onClick={() => navigate('/login')} 
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'reviews', label: 'Counselor Reviews', icon: Star },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'tips', label: 'Wellness Tips', icon: Lightbulb },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-teal-900">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 fixed h-full z-40 flex flex-col border-r-2 border-green-200 dark:border-green-700`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b-2 border-green-200 dark:border-green-700 flex-shrink-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">🌿</span>
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">Guidance</span>
                <p className="text-xs text-green-600">MSU Bongabong</p>
              </div>
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
        <nav className="mt-8 px-4 space-y-2 flex-1 overflow-y-auto">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t-2 border-green-200 dark:border-green-700 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 rounded-lg transition font-bold hover:scale-105 shadow-md"
            title="Logout from your account"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
        {/* Top Bar */}
        <div className="h-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-700 dark:to-teal-700 shadow-lg border-b-2 border-green-500 flex items-center justify-between px-8">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-green-200" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border-2 border-green-300 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white bg-white/90 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 ml-8">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 border border-white/30 font-bold"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Send Report Button */}
            <button
              onClick={() => setShowReportForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 dark:text-green-700 rounded-lg hover:bg-green-50 transition-all duration-300 font-bold hover:shadow-lg"
              title="Send Report or Feedback"
            >
              <Flag className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Send Report</span>
            </button>

            {/* Wellness Tips Button */}
            <button
              onClick={() => setActiveTab('tips')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 dark:text-green-700 rounded-lg hover:bg-green-50 transition-all duration-300 font-bold hover:shadow-lg"
              title="Wellness Tips"
            >
              <Lightbulb className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Tips</span>
            </button>

            {/* Request Certificates Button */}
            <button
              onClick={() => setShowCertificateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              title="Request Certificates"
            >
              <Award className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Request</span>
            </button>

            {/* Notifications */}
            <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative cursor-pointer">
              <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-6 border-l-2 border-white/30">
              <div className="w-10 h-10 bg-white/20 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'S'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-white">{user?.name || 'Student'}</p>
                <p className="text-xs text-green-100">{user?.email || ''}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg p-6 border-2 border-green-200 dark:border-green-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 dark:text-green-400 text-sm font-semibold">Upcoming Sessions</p>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">{stats.upcoming_sessions}</p>
                    </div>
                    <Clock className="w-10 h-10 text-green-400 opacity-30" />
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg p-6 border-2 border-emerald-200 dark:border-emerald-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">Completed Sessions</p>
                      <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-2">{stats.completed_sessions}</p>
                    </div>
                    <CheckCircle className="w-10 h-10 text-emerald-400 opacity-30" />
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg p-6 border-2 border-teal-200 dark:border-teal-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-600 dark:text-teal-400 text-sm font-semibold">Total Sessions</p>
                      <p className="text-3xl font-bold text-teal-700 dark:text-teal-300 mt-2">{stats.total_sessions}</p>
                    </div>
                    <MessageSquare className="w-10 h-10 text-teal-400 opacity-30" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Messages</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.messages}</p>
                    </div>
                    <MessageSquare className="w-10 h-10 text-yellow-500 opacity-20" />
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

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Appointments</h1>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Book Appointment
                </button>
              </div>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((apt, index) => {
                    const statusColors = {
                      pending: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700',
                      approved: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700',
                      rejected: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700',
                      completed: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                    };
                    
                    const statusBadgeColors = {
                      pending: 'bg-yellow-200 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-200',
                      approved: 'bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-200',
                      rejected: 'bg-red-200 dark:bg-red-700 text-red-900 dark:text-red-200',
                      completed: 'bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-200'
                    };

                    const currentStatus = apt.status || 'pending';
                    
                    return (
                      <div key={apt.id || index} className={`p-4 border-2 rounded-lg ${statusColors[currentStatus]}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white text-lg">{apt.topic || 'Appointment Request'}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Counselor: {apt.counselor_name}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2 ${statusBadgeColors[currentStatus]}`}>
                            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          {apt.requested_date && (
                            <p className="text-gray-600 dark:text-gray-400">
                              📅 Date: <span className="font-medium">{apt.requested_date}</span>
                            </p>
                          )}
                          {apt.requested_time && (
                            <p className="text-gray-600 dark:text-gray-400">
                              🕐 Time: <span className="font-medium">{apt.requested_time}</span>
                            </p>
                          )}
                          {apt.notes && (
                            <p className="text-gray-600 dark:text-gray-400">
                              📝 Notes: <span className="font-medium">{apt.notes}</span>
                            </p>
                          )}
                        </div>

                        {currentStatus === 'pending' && (
                          <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-xs text-yellow-800 dark:text-yellow-200">
                            ⏳ Waiting for counselor response...
                          </div>
                        )}
                        {currentStatus === 'approved' && (
                          <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-800 dark:text-green-200">
                            ✅ Appointment approved! Check your messages for details.
                          </div>
                        )}
                        {currentStatus === 'rejected' && (
                          <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 rounded text-xs text-red-800 dark:text-red-200">
                            ❌ Appointment was rejected. Please try booking another time.
                          </div>
                        )}
                        {currentStatus === 'completed' && (
                          <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-800 dark:text-blue-200">
                            ✔️ Appointment completed.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">No appointments yet. Click "Book Appointment" to create one.</p>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h2>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Book Appointment
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                <Suspense fallback={<div className="p-6 text-center text-gray-600 dark:text-gray-400">Loading chat...</div>}>
                  <ChatWithCounselor />
                </Suspense>
              </div>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-8">
              {/* New Request Section */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Request Certificates</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Click on a certificate type below to request it.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  {/* Good Moral Certificate */}
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="p-6 border-2 border-green-200 dark:border-green-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition text-left"
                  >
                    <Award className="w-12 h-12 text-green-600 mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Good Moral Certificate</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Request a certificate of good moral character</p>
                  </button>

                  {/* Referral Certificate */}
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="p-6 border-2 border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-left"
                  >
                    <FileText className="w-12 h-12 text-blue-600 mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Referral Certificate</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Request a referral certificate</p>
                  </button>
                </div>
              </div>

              {/* My Requests Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Requests</h2>
                
                {certificateRequests.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No certificate requests yet. Start by clicking "Request Certificates" above.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {certificateRequests.map((request) => {
                      // Determine status styling
                      let statusColor = 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
                      let statusTextColor = 'text-yellow-700 dark:text-yellow-300';
                      let statusIcon = '⏳';
                      let statusMessage = 'Waiting for counselor approval...';

                      if (request.status === 'approved') {
                        statusColor = 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
                        statusTextColor = 'text-green-700 dark:text-green-300';
                        statusIcon = '✅';
                        statusMessage = 'Certificate approved! Collect from office.';
                      } else if (request.status === 'rejected') {
                        statusColor = 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
                        statusTextColor = 'text-red-700 dark:text-red-300';
                        statusIcon = '❌';
                        statusMessage = 'Certificate request rejected.';
                      } else if (request.status === 'completed') {
                        statusColor = 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
                        statusTextColor = 'text-blue-700 dark:text-blue-300';
                        statusIcon = '✔️';
                        statusMessage = 'Certificate ready for pickup.';
                      }

                      return (
                        <div
                          key={request.id}
                          className={`p-5 border-2 rounded-lg ${statusColor} transition`}
                        >
                          {/* Header with Type and Date */}
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {request.certificate_type === 'Good Moral' || request.certificate_type === 'good_moral'
                                  ? 'Good Moral Certificate' 
                                  : 'Referral Certificate'}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Submitted: {new Date(request.submitted_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full font-semibold text-sm capitalize ${statusTextColor}`}>
                              {request.status}
                            </span>
                          </div>

                          {/* Purpose */}
                          {request.purpose && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Purpose:</strong> {request.purpose}</p>
                            </div>
                          )}

                          {/* Status Message */}
                          <div className={`text-sm font-medium ${statusTextColor} flex items-center gap-2`}>
                            <span>{statusIcon}</span>
                            {statusMessage}
                          </div>

                          {/* Counselor Remarks */}
                          {request.counselor_remarks && (
                            <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded text-sm text-gray-700 dark:text-gray-300">
                              <strong>Counselor's Note:</strong> {request.counselor_remarks}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Counselor Reviews Tab */}
          {activeTab === 'reviews' && (
            <CounselorReviewsForm />
          )}

          {/* Wellness Tips Tab */}
          {activeTab === 'tips' && (
            <TipsBot isOpen={true} onClose={() => setActiveTab('home')} isFullPage={true} />
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 max-w-4xl">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Profile Settings</h1>
              
              <form onSubmit={handleSaveProfile} className="space-y-8">
                {/* Profile Picture Section */}
                <div className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col items-center">
                    {/* Profile Picture */}
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-900/50 flex items-center justify-center overflow-hidden mb-4 border-4 border-indigo-600">
                      {profilePicturePreview ? (
                        <img 
                          src={profilePicturePreview} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-indigo-600" />
                      )}
                    </div>
                    
                    {editing && (
                      <label className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
                        Change Picture
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name || ''} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 transition"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input 
                        type="email" 
                        value={formData.email || ''} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                      <input 
                        type="tel" 
                        value={formData.phone || ''} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                      <input 
                        type="date" 
                        value={formData.date_of_birth || ''} 
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grade Level</label>
                      <select 
                        value={formData.grade_level || ''} 
                        onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 transition"
                      >
                        <option value="">Select Grade Level</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                      <textarea 
                        value={formData.address || ''} 
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={!editing}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 transition resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Guardian Information */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Guardian Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Guardian Name</label>
                      <input 
                        type="text" 
                        value={formData.guardian_name || ''} 
                        onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Guardian Contact</label>
                      <input 
                        type="tel" 
                        value={formData.guardian_contact || ''} 
                        onChange={(e) => setFormData({ ...formData, guardian_contact: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                  {!editing ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditing(true);
                      }}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditing(false);
                          setProfilePicture(null);
                          setFormData({ 
                            name: user?.name ?? '', 
                            email: user?.email ?? '', 
                            address: user?.address ?? '',
                            phone: user?.phone ?? '',
                            date_of_birth: user?.date_of_birth ?? '',
                            grade_level: user?.grade_level ?? '',
                            guardian_name: user?.guardian_name ?? '',
                            guardian_contact: user?.guardian_contact ?? ''
                          });
                          setProfilePicturePreview(user?.profile_picture ?? null);
                        }}
                        className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Report Form Modal */}
      {showReportForm && (
        <StudentReportForm 
          onClose={() => setShowReportForm(false)}
          onReportSent={() => setShowReportForm(false)}
        />
      )}

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onBookingSuccess={() => {
          setShowBookingModal(false);
          setActiveTab('appointments'); // Switch to appointments tab
          setRefreshAppointments(prev => prev + 1); // Trigger refresh
        }}
      />

      {/* Certificate Request Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Request Certificate</h2>
              <button
                onClick={() => {
                  setShowCertificateModal(false);
                  setCertificateFormData({ certificate_type: 'Good Moral', purpose: '', notes: '' });
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleCertificateRequest(certificateFormData.certificate_type);
            }} className="space-y-4">
              {/* Certificate Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certificate Type
                </label>
                <select
                  value={certificateFormData.certificate_type}
                  onChange={(e) => setCertificateFormData({ ...certificateFormData, certificate_type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Good Moral">Good Moral Certificate</option>
                  <option value="Referral">Referral Certificate</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {certificateFormData.certificate_type === 'Good Moral' 
                    ? 'Certificate of good moral character for official use' 
                    : 'Certificate for counseling referral purposes'}
                </p>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g., For scholarship, Employment, etc."
                  value={certificateFormData.purpose}
                  onChange={(e) => setCertificateFormData({ ...certificateFormData, purpose: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  placeholder="Add any additional information..."
                  value={certificateFormData.notes}
                  onChange={(e) => setCertificateFormData({ ...certificateFormData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={certificateRequestLoading}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {certificateRequestLoading ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCertificateModal(false);
                    setCertificateFormData({ certificate_type: 'Good Moral', purpose: '', notes: '' });
                  }}
                  className="flex-1 px-4 py-3 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tips Bot Modal */}
      <TipsBot isOpen={showTipsBot} onClose={() => setShowTipsBot(false)} />
    </div>
  );
};

export default StudentDashboard;
