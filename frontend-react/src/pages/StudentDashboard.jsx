import React, { useEffect, useState, Suspense, lazy } from 'react';
import api from '../api/axios';
import { 
  LogOut, Menu, X, Home, Calendar, FileText, MessageSquare, 
  User, Bell, Search, Clock, CheckCircle, AlertCircle, Flag, Moon, Sun, Plus, Award, Star, Lightbulb, Megaphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import StudentReportForm from '../components/StudentReportForm';
import { BookAppointmentModal } from '../components/BookAppointmentModal';
import CounselorReviewsForm from '../components/CounselorReviewsForm';
import TipsBot from '../components/TipsBot';
import StudentAnnouncementsTab from '../components/StudentAnnouncementsTab';
import DashboardNavbar from '../components/DashboardNavbar';

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
    program: '',
    tertiary_year: '',
    guardian_name: '',
    guardian_contact: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showTipsBot, setShowTipsBot] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fetch all dashboard data in a single call
  useEffect(() => {
    let mounted = true;
    const fetchDashboardData = async () => {
      try {
        // Single combined endpoint returns dashboard + appointments + certificates
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
          program: u.program ?? '',
          tertiary_year: u.tertiary_year ?? '',
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
        // Load certificate requests from combined response
        if (dashboardData.certificate_requests) {
          setCertificateRequests(dashboardData.certificate_requests);
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

  // Refresh appointments when requested
  useEffect(() => {
    let mounted = true;
    const doRefreshAppointments = async () => {
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

    // Only fetch on manual refresh, not initial load
    if (refreshAppointments > 0) {
      doRefreshAppointments();
    }
    return () => {
      mounted = false;
    };
  }, [refreshAppointments]);

  // Refresh certificates when requested
  useEffect(() => {
    let mounted = true;
    const doRefreshCerts = async () => {
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

    // Only fetch on manual refresh, not initial load
    if (refreshCertificates > 0) {
      doRefreshCerts();
    }
    return () => {
      mounted = false;
    };
  }, [refreshCertificates]);

  // Generate notifications based on student data
  useEffect(() => {
    const generatedNotifications = [];

    // Notification for pending appointments
    if (upcomingAppointments.filter(a => a.status === 'pending').length > 0) {
      generatedNotifications.push({
        id: 1,
        type: 'appointment',
        title: 'Pending Appointments',
        message: `You have ${upcomingAppointments.filter(a => a.status === 'pending').length} pending appointment(s) awaiting counselor approval`,
        icon: '📅',
        time: 'Just now',
        read: false
      });
    }

    // Notification for approved appointments
    if (upcomingAppointments.filter(a => a.status === 'approved').length > 0) {
      generatedNotifications.push({
        id: 2,
        type: 'appointment',
        title: 'Approved Appointments',
        message: `You have ${upcomingAppointments.filter(a => a.status === 'approved').length} approved appointment(s)`,
        icon: '✅',
        time: 'Recent',
        read: false
      });
    }

    // Notification for pending certificate requests
    if (certificateRequests.filter(r => r.status === 'pending').length > 0) {
      generatedNotifications.push({
        id: 3,
        type: 'certificate',
        title: 'Pending Certificates',
        message: `You have ${certificateRequests.filter(r => r.status === 'pending').length} certificate request(s) waiting for approval`,
        icon: '📄',
        time: 'Today',
        read: false
      });
    }

    // Notification for approved certificates
    if (certificateRequests.filter(r => r.status === 'approved').length > 0) {
      generatedNotifications.push({
        id: 4,
        type: 'certificate',
        title: 'Certificates Ready',
        message: `${certificateRequests.filter(r => r.status === 'approved').length} certificate(s) approved! Ready for pickup`,
        icon: '🎉',
        time: 'Recent',
        read: false
      });
    }

    setNotifications(generatedNotifications);
  }, [upcomingAppointments, certificateRequests]);

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
      if (formData.program && formData.program.trim()) {
        profileData.program = formData.program;
      }
      if (formData.tertiary_year && formData.tertiary_year.trim()) {
        profileData.tertiary_year = formData.tertiary_year;
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
        if (profileData.program) formDataToSend.append('program', profileData.program);
        if (profileData.tertiary_year) formDataToSend.append('tertiary_year', profileData.tertiary_year);
        
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
          program: updatedUser.program ?? '',
          tertiary_year: updatedUser.tertiary_year ?? '',
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
          program: updatedUser.program ?? '',
          tertiary_year: updatedUser.tertiary_year ?? '',
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
        // Refresh the certificate requests list
        setRefreshCertificates(prev => prev + 1);
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
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'reviews', label: 'Counselor Reviews', icon: Star },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'tips', label: 'Wellness Tips', icon: Lightbulb },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      <DashboardNavbar user={user} userRole="student" activeTab={activeTab} onTabChange={setActiveTab} notifications={notifications} unreadCount={notifications.filter(n => !n.read).length} />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-950 dark:via-green-950 dark:to-teal-950 flex animate-fade-in">
      {/* Sidebar with Enhanced Design */}
      <div className="w-64 bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/40 shadow-2xl fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r-2 border-green-300 dark:border-green-800">
        <div className="p-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-8">🌿 Student Menu</h2>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition transform duration-300 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow-lg scale-105 card-hover'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800/30'
              }`}
            >
              📊 Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition transform duration-300 ${
                activeTab === 'appointments'
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg scale-105 card-hover'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/30'
              }`}
            >
              📅 Appointments
            </button>
            
            <button
              onClick={() => setActiveTab('certificates')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                activeTab === 'certificates'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800/30'
              }`}
            >
              🎖️ Certificates
            </button>
            
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                activeTab === 'messages'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800/30'
              }`}
            >
              💬 Messages
            </button>
            
            <button
              onClick={() => setActiveTab('announcements')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === 'announcements'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800/30'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              Announcements
            </button>


 <button
              onClick={() => setActiveTab('tips')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                activeTab === 'tips'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800/30'
              }`}
            >
              👤 AI Chatbot
            </button>


            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800/30'
              }`}
            >
              ⭐ Reviews
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800/30'
              }`}
            >
              👤 Profile
            </button>
          </nav>
        </div>

        {/* Profile Section in Sidebar - Enhanced */}
        <div className="p-6 border-t-2 border-green-300 dark:border-green-800 mt-8 space-y-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/40 rounded-xl mx-2 mb-2">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                {user?.name?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold tracking-wide">Logged in as</p>
                <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">{user?.name}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => { setActiveTab('profile'); setEditing(true); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-sm font-medium transition transform hover:scale-105 shadow-md"
          >
            <User className="w-4 h-4" />
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-sm font-medium transition transform hover:scale-105 shadow-md"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 overflow-auto">
        <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse-soft {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-spin-slow {
          animation: spinSlow 3s linear infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out forwards;
        }

        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .stat-card {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .activity-item {
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          transform: translateX(4px);
          background-color: rgba(34, 197, 94, 0.05);
        }

        .tab-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }

        .tab-button::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }

        .tab-button.active::after {
          transform: scaleX(1);
          transform-origin: left;
        }
      `}</style>

        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="stat-card bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg p-6 border-2 border-green-200 dark:border-green-700 hover:shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 dark:text-green-400 text-sm font-semibold">Upcoming Sessions</p>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">{stats.upcoming_sessions}</p>
                    </div>
                    <Clock className="w-12 h-12 text-green-400 opacity-25" />
                  </div>
                </div>

                <div className="stat-card bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg p-6 border-2 border-emerald-200 dark:border-emerald-700 hover:shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">Completed Sessions</p>
                      <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-2">{stats.completed_sessions}</p>
                    </div>
                    <CheckCircle className="w-12 h-12 text-emerald-400 opacity-25" />
                  </div>
                </div>

                <div className="stat-card bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg p-6 border-2 border-teal-200 dark:border-teal-700 hover:shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-600 dark:text-teal-400 text-sm font-semibold">Total Sessions</p>
                      <p className="text-3xl font-bold text-teal-700 dark:text-teal-300 mt-2">{stats.total_sessions}</p>
                    </div>
                    <MessageSquare className="w-12 h-12 text-teal-400 opacity-25 animate-pulse-soft" />
                  </div>
                </div>

                <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 border-yellow-200 dark:border-yellow-700 hover:shadow-2xl" style={{animation: 'fadeInUp 0.6s ease-out 0.3s backwards'}}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 dark:text-yellow-400 text-sm font-semibold">Messages</p>
                      <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-200 mt-2 animate-float">{stats.messages}</p>
                    </div>
                    <MessageSquare className="w-12 h-12 text-yellow-500 opacity-20 animate-pulse-soft" />
                  </div>
                </div>

                <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 border-orange-200 dark:border-orange-700 hover:shadow-2xl" style={{animation: 'fadeInUp 0.6s ease-out 0.4s backwards'}}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 dark:text-orange-400 text-sm font-semibold">Resources</p>
                      <p className="text-3xl font-bold text-orange-900 dark:text-orange-200 mt-2 animate-float">{stats.resources}</p>
                    </div>
                    <FileText className="w-12 h-12 text-orange-500 opacity-20 animate-pulse-soft" />
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-green-200 dark:border-green-700 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Activities</h2>
                {recentActivities.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div 
                        key={activity.id || index} 
                        className="activity-item flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                      >
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white font-semibold">Session with {activity.counselor_name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{activity.topic}</p>
                        </div>
                        <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full font-medium capitalize whitespace-nowrap">
                          {activity.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8 text-sm">No recent activities yet</p>
                )}
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-6" style={{animation: 'fadeInUp 0.6s ease-out'}}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Appointments</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your counseling sessions</p>
                </div>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Book Appointment
                </button>
              </div>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((apt, index) => {
                    const statusColors = {
                      pending: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10 border-yellow-300 dark:border-yellow-700',
                      approved: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/10 border-green-300 dark:border-green-700',
                      rejected: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border-red-300 dark:border-red-700',
                      completed: 'bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/10 border-blue-300 dark:border-blue-700'
                    };
                    
                    const statusBadgeColors = {
                      pending: 'bg-yellow-300 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100',
                      approved: 'bg-green-300 dark:bg-green-700 text-green-900 dark:text-green-100',
                      rejected: 'bg-red-300 dark:bg-red-700 text-red-900 dark:text-red-100',
                      completed: 'bg-blue-300 dark:bg-blue-700 text-blue-900 dark:text-blue-100'
                    };

                    const currentStatus = apt.status || 'pending';
                    
                    return (
                      <div 
                        key={apt.id || index} 
                        className={`p-6 border-2 rounded-2xl ${statusColors[currentStatus]} shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-102`}
                        style={{animation: `slideInRight 0.5s ease-out ${0.2 + index * 0.1}s backwards`}}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 dark:text-white text-lg">{apt.topic || 'Appointment Request'}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">👨‍💼 Counselor: {apt.counselor_name}</p>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ml-2 ${statusBadgeColors[currentStatus]} shadow-md`}>
                            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                          </span>
                        </div>
                        
                        <div className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
                          {apt.requested_date && (
                            <p className="flex items-center gap-2">
                              <span className="text-lg">📅</span>
                              <span>Date: <span className="font-semibold text-gray-900 dark:text-white">{apt.requested_date}</span></span>
                            </p>
                          )}
                          {apt.requested_time && (
                            <p className="flex items-center gap-2">
                              <span className="text-lg">🕐</span>
                              <span>Time: <span className="font-semibold text-gray-900 dark:text-white">{apt.requested_time}</span></span>
                            </p>
                          )}
                          {apt.notes && (
                            <p className="flex items-center gap-2">
                              <span className="text-lg">📝</span>
                              <span>Notes: <span className="font-semibold text-gray-900 dark:text-white">{apt.notes}</span></span>
                            </p>
                          )}
                        </div>

                        {currentStatus === 'pending' && (
                          <div className="mt-4 p-3 bg-yellow-200/50 dark:bg-yellow-700/30 rounded-lg text-sm text-yellow-900 dark:text-yellow-200 font-medium flex items-center gap-2">
                            <span className="animate-spin">⏳</span> Waiting for counselor response...
                          </div>
                        )}
                        {currentStatus === 'approved' && (
                          <div className="mt-4 p-3 bg-green-200/50 dark:bg-green-700/30 rounded-lg text-sm text-green-900 dark:text-green-200 font-medium flex items-center gap-2">
                            <span>✅</span> Appointment approved! Check your messages for details.
                          </div>
                        )}
                        {currentStatus === 'rejected' && (
                          <div className="mt-4 p-3 bg-red-200/50 dark:bg-red-700/30 rounded-lg text-sm text-red-900 dark:text-red-200 font-medium flex items-center gap-2">
                            <span>❌</span> Appointment was rejected. Please try booking another time.
                          </div>
                        )}
                        {currentStatus === 'completed' && (
                          <div className="mt-4 p-3 bg-blue-200/50 dark:bg-blue-700/30 rounded-lg text-sm text-blue-900 dark:text-blue-200 font-medium flex items-center gap-2">
                            <span>✔️</span> Appointment completed.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">No appointments yet. Click "Book Appointment" to create one.</p>
                </div>
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

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <StudentAnnouncementsTab />
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
                        <option value="Tertiary">Tertiary</option>
                      </select>
                    </div>

                    {formData.grade_level === 'Tertiary' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Program</label>
                          <input
                            type="text"
                            value={formData.program || ''}
                            onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                            disabled={!editing}
                            placeholder="e.g., BS Computer Science"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                          <select
                            value={formData.tertiary_year || ''}
                            onChange={(e) => setFormData({ ...formData, tertiary_year: e.target.value })}
                            disabled={!editing}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 transition"
                          >
                            <option value="">Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                          </select>
                        </div>
                      </>
                    )}

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
    </>
  );
};

export default StudentDashboard;
