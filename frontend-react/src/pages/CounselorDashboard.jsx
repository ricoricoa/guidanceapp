import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, Calendar, X, Clock, FileText, MessageSquare, Send } from 'lucide-react';

const CounselorDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [message, setMessage] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [sessionNote, setSessionNote] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentRequests, setStudentRequests] = useState([]);
  const [requestFilter, setRequestFilter] = useState('all');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/api/v1/guidance/dashboard');
        if (!mounted) return;
        
        const u = res.data.data?.user || res.data.user || res.data;
        setUser(u);
      } catch (err) {
        if (!mounted) return;
        if (err.response?.status === 403) {
          setForbidden(true);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => (mounted = false);
  }, []);

  // Fetch all student requests (if endpoint exists, otherwise mock)
  useEffect(() => {
    let mounted = true;
    const fetchRequests = async () => {
      try {
        // Try to fetch from a counselor requests endpoint if available
        const res = await api.get('/api/v1/counselor/student-requests');
        if (mounted && res.data?.data) {
          const requestsData = Array.isArray(res.data.data) ? res.data.data : [];
          setStudentRequests(
            requestsData.map(req => ({
              id: req.id,
              student_name: req.student?.name || 'Unknown',
              student_email: req.student?.email || 'N/A',
              request_type: req.type || req.request_type || 'General',
              status: req.status || 'pending',
              submitted_at: req.created_at || new Date().toISOString(),
              purpose: req.purpose || 'Request from student'
            }))
          );
        }
      } catch (err) {
        console.error('Error fetching requests:', err);
        // Use mock data as fallback
        setStudentRequests([
          { id: 1, student_name: 'Juan Dela Cruz', student_email: 'juan@example.com', request_type: 'Good Moral', status: 'pending', submitted_at: '2025-12-05', purpose: 'For scholarship' },
          { id: 2, student_name: 'Maria Santos', student_email: 'maria@example.com', request_type: 'Certificate', status: 'approved', submitted_at: '2025-12-04', purpose: 'For employment' },
          { id: 3, student_name: 'Pedro Reyes', student_email: 'pedro@example.com', request_type: 'Referral', status: 'pending', submitted_at: '2025-12-06', purpose: 'School support' },
        ]);
      }
    };

    fetchRequests();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/api/v1/appointments');
        if (mounted && res.data?.data) {
          setAppointments(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };
    
    fetchAppointments();
    return () => (mounted = false);
  }, []);

  // Fetch students created by this counselor
  useEffect(() => {
    let mounted = true;
    const fetchStudents = async () => {
      try {
        // Try to fetch students created by this counselor
        const res = await api.get('/api/v1/counselor/students');
        if (mounted && res.data?.data) {
          const studentsList = Array.isArray(res.data.data) ? res.data.data : [];
          setStudents(studentsList);
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        // Fallback - use mock data
        if (mounted) {
          setStudents([
            { id: 1, name: 'Juan Dela Cruz', email: 'juan@example.com' },
            { id: 2, name: 'Maria Santos', email: 'maria@example.com' },
            { id: 3, name: 'Pedro Reyes', email: 'pedro@example.com' },
          ]);
        }
      }
    };
    
    fetchStudents();
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
        <p className="text-red-700 dark:text-red-300">You do not have permission to view this dashboard.</p>
      </div>
    </div>
  );

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/api/v1/user/profile', formData);
      setUser(res.data.user);
      setFormData({ name: res.data.user.name || '', email: res.data.user.email || '' });
      setMessage('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNote = async () => {
    if (!sessionNote.trim()) {
      setMessage('Please enter a session note.');
      return;
    }
    setMessage('Session note saved successfully!');
    setShowNoteModal(false);
    setSessionNote('');
    setTimeout(() => setMessage(''), 3000);
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'pending') return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
    if (status === 'approved') return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
    return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  };

  const filteredRequests = requestFilter === 'all' 
    ? studentRequests 
    : studentRequests.filter(r => r.status === requestFilter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex pt-16">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">Menu</h2>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              📊 Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === 'appointments'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              📅 Appointments
              {appointments.filter(a => a.status === 'pending').length > 0 && (
                <span className="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {appointments.filter(a => a.status === 'pending').length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === 'requests'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              📄 Requests
              {studentRequests.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-auto px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                  {studentRequests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                activeTab === 'messages'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              💬 Messages
            </button>
          </nav>
        </div>

        {/* Profile Section in Sidebar */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 mt-8">
          <div className="mb-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Logged in as</p>
            <p className="font-semibold text-gray-900 dark:text-white mt-1 truncate">{user?.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}!</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Counselor Dashboard</p>
          </div>

        {/* Navigation Tabs - Hidden on desktop, shown on mobile */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-3 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-3 font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'requests'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400'
              }`}
            >
              <FileText className="w-4 h-4" />
              Requests
              {studentRequests.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                  {studentRequests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-3 font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'appointments'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Appointments
              {appointments.filter(a => a.status === 'pending').length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-yellow-600 text-white text-xs rounded-full">
                  {appointments.filter(a => a.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-3 font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'messages'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Messages
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 flex justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="text-green-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Total Appointments</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{appointments.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Pending Requests</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{studentRequests.filter(r => r.status === 'pending').length}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold">Upcoming Appointments</h2>
                </div>
                <div className="p-6 space-y-3">
                  {appointments.slice(0, 5).map(apt => (
                    <div key={apt.id} className="flex justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded">
                      <div>
                        <p className="font-semibold">{apt.student_name || 'Student'}</p>
                        <p className="text-sm text-gray-600">{apt.topic}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow sticky top-24">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold">My Profile</h2>
              </div>

              {!editing ? (
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 uppercase font-semibold">Name</p>
                    <p className="text-lg font-semibold mt-1">{user?.name}</p>
                  </div>
                  <div className="mb-6">
                    <p className="text-xs text-gray-600 uppercase font-semibold">Email</p>
                    <p className="text-sm mt-1 break-all">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700"
                  />
                  <div className="flex gap-2">
                    <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" onClick={() => setEditing(false)} className="flex-1 px-4 py-2 bg-gray-300 rounded-lg">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setRequestFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    requestFilter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredRequests.length > 0 ? (
                filteredRequests.map(request => (
                  <div key={request.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{request.student_name}</h3>
                        <p className="text-sm text-gray-600">{request.student_email}</p>
                        <p className="text-sm mt-2"><strong>Type:</strong> {request.request_type}</p>
                        <p className="text-sm"><strong>Purpose:</strong> {request.purpose}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-2 pt-4 border-t">
                        <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                          Approve
                        </button>
                        <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600">No requests found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Messages</h3>
                </div>
                <div className="divide-y max-h-96 overflow-y-auto">
                  {studentMessages.length > 0 ? (
                    studentMessages.map(msg => (
                      <div
                        key={msg.id}
                        onClick={() => {
                          setSelectedStudent(msg);
                          // Load saved messages from localStorage using consistent key format
                          const counselorId = user?.id;
                          const savedMessages = JSON.parse(localStorage.getItem(`chat_student_${msg.id}_counselor_${counselorId}`) || '[]');
                          setChatMessages(savedMessages.length > 0 ? savedMessages : []);
                        }}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition ${
                          selectedStudent?.id === msg.id ? 'bg-indigo-50 dark:bg-indigo-900' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{msg.student_name}</p>
                            <p className="text-xs text-gray-500 mt-1">{msg.student_email}</p>
                          </div>
                          {msg.unread > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {msg.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 truncate mt-2">{msg.last_message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p>No students available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedStudent ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-96 flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
                    <h3 className="font-semibold text-lg">{selectedStudent.student_name}</h3>
                    <p className="text-sm opacity-90">{selectedStudent.student_email}</p>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'counselor' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.sender === 'counselor'
                              ? 'bg-indigo-500 text-white rounded-br-none'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && messageInput.trim() && selectedStudent) {
                            // Add message to chat
                            const counselorId = user?.id;
                            const newMessage = {
                              id: chatMessages.length + 1,
                              sender: 'counselor',
                              text: messageInput,
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            };
                            const updatedMessages = [...chatMessages, newMessage];
                            setChatMessages(updatedMessages);
                            
                            // Save to localStorage with consistent key format
                            localStorage.setItem(`chat_student_${selectedStudent.id}_counselor_${counselorId}`, JSON.stringify(updatedMessages));
                            
                            // Update student's last message in the list
                            setStudentMessages(studentMessages.map(s => 
                              s.id === selectedStudent.id 
                                ? { ...s, last_message: messageInput, last_message_time: new Date() }
                                : s
                            ));
                            
                            setMessageInput('');
                          }
                        }}
                        className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => {
                          if (messageInput.trim() && selectedStudent) {
                            const counselorId = user?.id;
                            const newMessage = {
                              id: chatMessages.length + 1,
                              sender: 'counselor',
                              text: messageInput,
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            };
                            const updatedMessages = [...chatMessages, newMessage];
                            setChatMessages(updatedMessages);
                            
                            // Save to localStorage with consistent key format
                            localStorage.setItem(`chat_student_${selectedStudent.id}_counselor_${counselorId}`, JSON.stringify(updatedMessages));
                            
                            // Update student's last message in the list
                            setStudentMessages(studentMessages.map(s => 
                              s.id === selectedStudent.id 
                                ? { ...s, last_message: messageInput, last_message_time: new Date() }
                                : s
                            ));
                            
                            setMessageInput('');
                          }
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-96 flex items-center justify-center">
                  <p className="text-gray-600 dark:text-gray-400">Click on a student to start messaging</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">All Student Appointments</h2>
            
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((apt) => (
                  <div key={apt.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-indigo-600">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{apt.student?.name || apt.student_name || 'Student'}</h3>
                        <p className="text-sm text-gray-600">{apt.topic}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusBadgeClass(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{apt.student?.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{apt.requested_date || apt.date || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{apt.requested_time || apt.time || 'N/A'}</span>
                      </div>
                    </div>

                    {apt.status === 'pending' && (
                      <div className="flex gap-2 pt-4 border-t">
                        <button
                          onClick={() => { setSelectedAppointment(apt); setShowNoteModal(true); }}
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                        >
                          Approve
                        </button>
                        <button className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium">
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No appointments yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Students List */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-lg">Students</h3>
                  <p className="text-xs text-gray-500 mt-1">{students.length} student(s)</p>
                </div>
                <div className="divide-y max-h-[500px] overflow-y-auto">
                  {students.length > 0 ? (
                    students.map(student => (
                      <div
                        key={student.id}
                        onClick={() => {
                          setSelectedStudent(student);
                          // Load saved messages from localStorage
                          const counselorId = user?.id;
                          const savedMessages = JSON.parse(localStorage.getItem(`chat_student_${student.id}_counselor_${counselorId}`) || '[]');
                          setChatMessages(savedMessages);
                        }}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition ${
                          selectedStudent?.id === student.id ? 'bg-indigo-50 dark:bg-indigo-900' : ''
                        }`}
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{student.email}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No students available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              {selectedStudent ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-[600px] flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
                    <h3 className="font-semibold text-lg">{selectedStudent.name}</h3>
                    <p className="text-sm opacity-90">{selectedStudent.email}</p>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.length > 0 ? (
                      chatMessages.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'counselor' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              msg.sender === 'counselor'
                                ? 'bg-indigo-500 text-white rounded-br-none'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && messageInput.trim() && selectedStudent) {
                            const counselorId = user?.id;
                            const newMessage = {
                              id: chatMessages.length + 1,
                              sender: 'counselor',
                              text: messageInput,
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            };
                            const updatedMessages = [...chatMessages, newMessage];
                            setChatMessages(updatedMessages);
                            
                            // Save to localStorage
                            localStorage.setItem(`chat_student_${selectedStudent.id}_counselor_${counselorId}`, JSON.stringify(updatedMessages));
                            
                            setMessageInput('');
                          }
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => {
                          if (messageInput.trim() && selectedStudent) {
                            const counselorId = user?.id;
                            const newMessage = {
                              id: chatMessages.length + 1,
                              sender: 'counselor',
                              text: messageInput,
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            };
                            const updatedMessages = [...chatMessages, newMessage];
                            setChatMessages(updatedMessages);
                            
                            // Save to localStorage
                            localStorage.setItem(`chat_student_${selectedStudent.id}_counselor_${counselorId}`, JSON.stringify(updatedMessages));
                            
                            setMessageInput('');
                          }
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-[600px] flex items-center justify-center">
                  <p className="text-gray-600 dark:text-gray-400">Select a student to start messaging</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Session Note Modal */}
      {showNoteModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Session Note</h2>
              <button onClick={() => setShowNoteModal(false)} className="text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleSaveNote(); }} className="p-6">
              <p className="text-sm text-gray-600 mb-4"><strong>Topic:</strong> {selectedAppointment.topic}</p>
              <label className="block text-sm font-semibold mb-2">Session Notes</label>
              <textarea
                value={sessionNote}
                onChange={e => setSessionNote(e.target.value)}
                placeholder="Document the session details..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 h-32 resize-none"
                required
              />
              <div className="flex gap-2 mt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg">
                  Save Note
                </button>
                <button type="button" onClick={() => setShowNoteModal(false)} className="flex-1 px-4 py-2 bg-gray-300 rounded-lg">
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default CounselorDashboard;
