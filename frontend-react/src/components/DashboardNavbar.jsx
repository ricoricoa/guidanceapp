import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  Settings,
  User,
  ChevronDown,
  MessageSquare,
  Calendar,
  FileText,
  Users,
  BarChart3,
  Home,
  LogIn
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DashboardNavbar = ({ user, userRole = 'counselor', activeTab = 'dashboard', onTabChange = () => {}, notifications: propNotifications = null, unreadCount: propUnread = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  // Notifications: use parent-provided notifications when available
  const [localNotifications] = useState([
    { id: 1, message: 'New appointment request', time: '5 minutes ago', read: false },
    { id: 2, message: 'Student submission received', time: '1 hour ago', read: false },
    { id: 3, message: 'Profile updated successfully', time: '2 hours ago', read: true },
  ]);

  const notifications = propNotifications ?? localNotifications;
  const unreadNotifications = (typeof propUnread === 'number') ? propUnread : notifications.filter(n => !n.read).length;

  // Navigation items based on role
  const getNavItems = () => {
    const commonItems = [
      { label: 'Dashboard', id: 'overview', icon: Home },
    ];

    const studentItems = [
      { label: 'Appointments', id: 'appointments', icon: Calendar },
      { label: 'Announcements', id: 'announcements', icon: Bell },
      { label: 'Messages', id: 'messages', icon: MessageSquare },
      { label: 'Request', id: 'certificates', icon: FileText },
    ];

    const counselorItems = [
      { label: 'Messages', id: 'messages', icon: MessageSquare },
      { label: 'Announcements', id: 'announcements', icon: Bell },
      { label: 'Appointments', id: 'appointments', icon: Calendar },
      { label: 'Requests', id: 'requests', icon: FileText },
      { label: 'Students', id: 'students', icon: Users },
    ];

    const adminItems = [
      { label: 'Users', id: 'users', icon: Users },
      { label: 'Reports', id: 'reports', icon: BarChart3 },
      { label: 'Settings', id: 'settings', icon: Settings },
    ];

    return userRole === 'student'
      ? [...commonItems, ...studentItems]
      : userRole === 'admin'
      ? [...commonItems, ...adminItems]
      : [...commonItems, ...counselorItems];
  };

  const navItems = getNavItems();

  const basePath = userRole === 'student' ? '/student/dashboard' : userRole === 'admin' ? '/admin/dashboard' : '/counselor/dashboard';

  const handleNavClick = (itemId) => {
    onTabChange(itemId);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const isActive = (itemId) => activeTab === itemId;

  return (
    <>
      <style>{`
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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes floatLeaf {
          0% {
            transform: translateY(-10px) translateX(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(10px) translateX(30px) rotate(45deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(20px) translateX(0) rotate(90deg);
            opacity: 0;
          }
        }

        @keyframes flyBird {
          0% {
            transform: translateX(-100px) translateY(0) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(-20px) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .floating-leaf {
          position: absolute;
          pointer-events: none;
        }

        .leaf-1 { animation: floatLeaf 4s ease-in infinite; opacity: 0.6; }
        .leaf-2 { animation: floatLeaf 5s ease-in infinite 1s; opacity: 0.5; }
        .leaf-3 { animation: floatLeaf 4.5s ease-in infinite 2s; opacity: 0.6; }

        .flying-bird {
          position: absolute;
          animation: flyBird 12s linear infinite;
          font-size: 1.5rem;
        }

        .bird-1 { animation: flyBird 12s linear infinite; top: 30px; }
        .bird-2 { animation: flyBird 15s linear infinite 5s; top: 50px; }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }

        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }

        .nav-item-hover {
          position: relative;
          overflow: hidden;
        }

        .nav-item-hover::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          transition: left 0.3s ease;
        }

        .nav-item-hover:hover::after {
          left: 0;
        }

        .notification-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          animation: pulse 2s ease-in-out infinite;
        }

        .dropdown-menu {
          animation: slideDown 0.2s ease-out forwards;
        }

        .mobile-menu {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>

      {/* Floating Leaves Background */}
      <div className="fixed top-0 left-0 right-0 h-20 pointer-events-none overflow-hidden">
        <div className="floating-leaf leaf-1" style={{left: '10%'}}>🍃</div>
        <div className="floating-leaf leaf-2" style={{left: '30%'}}>🍂</div>
        <div className="floating-leaf leaf-3" style={{left: '60%'}}>🍃</div>
        <div className="flying-bird bird-1">🕊️</div>
        <div className="flying-bird bird-2">🦅</div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900 dark:via-emerald-900 dark:to-teal-900 border-b-2 border-green-200 dark:border-green-800 shadow-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left Section - Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 flex items-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent hover:scale-110 transition-transform cursor-pointer" onClick={() => navigate('/dashboard')}>
                  🌿 Guidance
                </div>
              </div>
              <div className="hidden md:flex items-center">
                <span className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800/40 dark:to-emerald-800/40 text-green-700 dark:text-green-300 rounded-full">
                  {userRole === 'admin' ? '👨‍💼 Administrator' : userRole === 'student' ? '👨‍🎓 Student' : '👨‍🏫 Counselor'}
                </span>
              </div>
            </div>

            {/* Center Section - Navigation Items (Desktop) */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`nav-item-hover px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                      active
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800/30'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                  className="relative p-2 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800/30 rounded-lg transition-colors"
                >
                  <Bell size={20} />
                  {unreadNotifications > 0 && (
                    <div className="notification-badge">{unreadNotifications}</div>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationDropdownOpen && (
                  <div className="dropdown-menu absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-green-200 dark:border-green-800 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition ${
                              !notif.read ? 'bg-green-50 dark:bg-green-900/20' : ''
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          <p className="text-sm">No notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800/30 rounded-lg transition-colors"
                title={isDark ? 'Light mode' : 'Dark mode'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-700 dark:text-gray-300 transition-transform ${
                      profileDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-green-200 dark:border-green-800">
                    <div className="p-4 border-b border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          if (typeof onTabChange === 'function') onTabChange('profile');
                          navigate(basePath);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 transition"
                      >
                        <User size={16} />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          if (typeof onTabChange === 'function') onTabChange('settings');
                          navigate(basePath);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 transition"
                      >
                        <Settings size={16} />
                        Settings
                      </button>
                      <hr className="my-2 border-green-200 dark:border-green-800" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition font-medium"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                        active
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Notification Click Away Handler */}
      {(notificationDropdownOpen || profileDropdownOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setNotificationDropdownOpen(false);
            setProfileDropdownOpen(false);
          }}
        />
      )}
    </>
  );
};

export default DashboardNavbar;
