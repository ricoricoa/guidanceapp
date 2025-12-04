import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, X, Phone, Video, MoreVertical, Clock, MessageSquare, Loader } from 'lucide-react';
import api from '../api/axios';

export const ChatWithCounselor = () => {
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCounselorList, setShowCounselorList] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch current user info
  useEffect(() => {
    let mounted = true;
    const fetchUserInfo = async () => {
      try {
        const res = await api.get('/api/v1/student/dashboard');
        if (mounted && res.data?.data?.user) {
          setCurrentUser(res.data.data.user);
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    fetchUserInfo();
    return () => { mounted = false; };
  }, []);

  // Fetch counselors - only once on mount
  useEffect(() => {
    let mounted = true;
    const fetchCounselors = async () => {
      setLoading(true);
      try {
        // Try the main endpoint first
        const res = await api.get('/api/v1/admin/counselors');
        console.log('Counselors from /api/v1/admin/counselors:', res.data);
        if (mounted) {
          let counselorList = res.data?.data || [];
          
          if (Array.isArray(counselorList) && counselorList.length > 0) {
            console.log('Using counselors from API:', counselorList);
            setCounselors(counselorList);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Error fetching from /api/v1/admin/counselors:', err);
      }

      // Fallback - try the student counselors endpoint
      try {
        const res2 = await api.get('/api/v1/counselors');
        console.log('Counselors from /api/v1/counselors:', res2.data);
        if (mounted) {
          let counselorList = res2.data?.counselors || res2.data?.data || [];
          
          if (Array.isArray(counselorList) && counselorList.length > 0) {
            console.log('Using counselors from /api/v1/counselors:', counselorList);
            setCounselors(counselorList);
            setLoading(false);
            return;
          }
        }
      } catch (err2) {
        console.error('Error fetching from /api/v1/counselors:', err2);
      }

      // If both fail, use mock data
      if (mounted) {
        const mockCounselors = [
          { id: 2, name: 'John Counselor', email: 'counselor@example.com', status: 'active' },
        ];
        console.log('Using mock counselors:', mockCounselors);
        setCounselors(mockCounselors);
      }
      
      // IMPORTANT: Always set loading to false at the end, regardless of path taken
      if (mounted) {
        setLoading(false);
      }
    };
    
    // Fetch only once on component mount
    fetchCounselors();
    
    return () => { 
      mounted = false;
    };
  }, []);

  // Load chat history when counselor selected
  useEffect(() => {
    if (selectedCounselor) {
      console.log('Loading chat history for counselor:', selectedCounselor);
      loadChatHistory();
    }
  }, [selectedCounselor]);

  // Auto-select first counselor when list loads
  useEffect(() => {
    if (counselors.length > 0 && !selectedCounselor) {
      console.log('Auto-selecting first counselor:', counselors[0]);
      setSelectedCounselor(counselors[0]);
    }
  }, [counselors]);

  const loadChatHistory = async () => {
    try {
      const studentId = currentUser?.id;
      const counselorId = selectedCounselor?.id;
      
      if (!studentId || !counselorId) {
        console.log('Cannot load messages - missing studentId or counselorId');
        return;
      }

      console.log(`Loading messages for student ${studentId} and counselor ${counselorId}`);
      
      // Fetch messages from backend API
      const response = await api.get(`/api/v1/messages/${studentId}/${counselorId}`);
      const apiMessages = response.data?.data || [];
      
      console.log('API Messages:', apiMessages);
      
      // Format messages for display
      const formattedMessages = apiMessages.map(msg => {
        let displayTime = msg.timestamp || '';
        if (msg.created_at) {
          try {
            const date = new Date(msg.created_at);
            displayTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } catch (e) {
            displayTime = msg.created_at;
          }
        }

        return {
          id: msg.id,
          sender: msg.sender,
          senderName: msg.sender === 'student' ? currentUser.name : selectedCounselor.name,
          text: msg.text || msg.message,
          timestamp: displayTime,
          read: msg.read
        };
      });

      console.log('Formatted messages:', formattedMessages);
      setMessages(formattedMessages);
    } catch (err) {
      console.error('Error loading chat history:', err);
      // If API fails, try localStorage as fallback
      try {
        const studentId = currentUser?.id;
        const counselorId = selectedCounselor?.id;
        const savedMessages = JSON.parse(localStorage.getItem(`chat_student_${studentId}_counselor_${counselorId}`) || '[]');
        setMessages(savedMessages);
      } catch (e) {
        setMessages([]);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCounselor || !currentUser) {
      console.log('Cannot send message - missing required data');
      return;
    }

    const studentId = currentUser.id;
    const counselorId = selectedCounselor.id;

    console.log(`Sending message from student ${studentId} to counselor ${counselorId}`);

    try {
      // Send message via backend API
      const response = await api.post('/api/v1/messages', {
        recipient_id: counselorId,
        message: newMessage
      });

      console.log('Message sent response:', response.data);

      if (response.data?.data) {
        // Add the message to the local state
        const messageObj = {
          id: response.data.data.id,
          sender: 'student',
          senderName: currentUser.name,
          text: response.data.data.text || response.data.data.message,
          timestamp: response.data.data.created_at ? new Date(response.data.data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'just now',
          read: false
        };

        const updatedMessages = [...messages, messageObj];
        setMessages(updatedMessages);
        setNewMessage('');

        // Scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      // Fallback to localStorage if API fails
      const messageObj = {
        id: messages.length + 1,
        sender: 'student',
        senderName: currentUser.name,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };

      const updatedMessages = [...messages, messageObj];
      setMessages(updatedMessages);
      setNewMessage('');

      localStorage.setItem(`chat_student_${studentId}_counselor_${counselorId}`, JSON.stringify(updatedMessages));

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Counselors List */}
      <div className={`${showCounselorList ? 'w-80' : 'w-0'} bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 overflow-hidden`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Counselors</h2>
              <button
                onClick={() => setShowCounselorList(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search counselors..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Counselors List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader className="w-8 h-8 text-indigo-600 mx-auto animate-spin" />
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Loading counselors...</p>
                </div>
              </div>
            ) : counselors.length > 0 ? (
              counselors.map(counselor => (
                <button
                  key={counselor.id}
                  onClick={() => {
                    setSelectedCounselor(counselor);
                    setShowCounselorList(false);
                  }}
                  className={`w-full p-4 text-left border-b border-gray-100 dark:border-gray-700 transition ${
                    selectedCounselor?.id === counselor.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">{counselor.avatar || counselor.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{counselor.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{counselor.specialization || counselor.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 dark:text-green-400">Available now</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600 dark:text-gray-400">No counselors available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        {selectedCounselor ? (
          <>
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowCounselorList(true)}
                  className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{selectedCounselor.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCounselor.specialization || 'Counselor'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length > 0 ? (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'student'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none shadow'
                      }`}
                    >
                      {msg.sender === 'counselor' && (
                        <p className="text-xs font-semibold mb-1 opacity-75">{msg.senderName}</p>
                      )}
                      <p className="break-words">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'student' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-white"
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg transition flex items-center gap-2 font-semibold ${
                    newMessage.trim()
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Conversation Selected</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Select a counselor to start chatting</p>
              <button
                onClick={() => setShowCounselorList(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                View Counselors
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
