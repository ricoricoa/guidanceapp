import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Plus, Send, X, Search } from 'lucide-react';
import { MessageCard, InputField } from './StudentDashboardPartials';

/**
 * ChatWithCounselorTab Component
 * Direct messaging interface with counselors
 */
export const ChatWithCounselorTab = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      counselor: 'Ms. Sarah Johnson',
      lastMessage: 'Thank you for reaching out. I can help you with that.',
      lastMessageTime: '2025-11-20T14:30:00',
      unread: 0,
      messages: [
        {
          id: 1,
          sender: 'Ms. Sarah Johnson',
          message: 'Hi! How can I help you today?',
          timestamp: '2025-11-20T10:00:00',
          isOwn: false,
        },
        {
          id: 2,
          sender: 'You',
          message: 'I need help with my career path',
          timestamp: '2025-11-20T10:15:00',
          isOwn: true,
        },
        {
          id: 3,
          sender: 'Ms. Sarah Johnson',
          message: 'Thank you for reaching out. I can help you with that.',
          timestamp: '2025-11-20T14:30:00',
          isOwn: false,
        },
      ],
    },
    {
      id: 2,
      counselor: 'Mr. Michael Chen',
      lastMessage: 'Looking forward to meeting with you next week.',
      lastMessageTime: '2025-11-19T16:45:00',
      unread: 1,
      messages: [
        {
          id: 1,
          sender: 'You',
          message: 'Hi, I wanted to follow up on our appointment',
          timestamp: '2025-11-19T15:00:00',
          isOwn: true,
        },
        {
          id: 2,
          sender: 'Mr. Michael Chen',
          message: 'Looking forward to meeting with you next week.',
          timestamp: '2025-11-19T16:45:00',
          isOwn: false,
        },
      ],
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageText, setMessageText] = useState('');
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  const counselors = [
    { id: 1, name: 'Ms. Sarah Johnson' },
    { id: 2, name: 'Mr. Michael Chen' },
    { id: 3, name: 'Mrs. Emily Rodriguez' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage = {
      id: selectedConversation.messages.length + 1,
      sender: 'You',
      message: messageText,
      timestamp: new Date().toISOString(),
      isOwn: true,
    };

    // Update the selected conversation
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
      lastMessage: messageText,
      lastMessageTime: new Date().toISOString(),
    };

    // Update conversations list
    setConversations(
      conversations.map(conv =>
        conv.id === selectedConversation.id ? updatedConversation : conv
      )
    );

    setSelectedConversation(updatedConversation);
    setMessageText('');

    // Simulate counselor response
    setTimeout(() => {
      const response = {
        id: updatedConversation.messages.length + 1,
        sender: updatedConversation.counselor,
        message: 'Thank you for your message. I will review this and get back to you shortly.',
        timestamp: new Date(Date.now() + 5000).toISOString(),
        isOwn: false,
      };

      const updatedWithResponse = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, response],
      };

      setConversations(
        conversations.map(conv =>
          conv.id === selectedConversation.id ? updatedWithResponse : conv
        )
      );

      setSelectedConversation(updatedWithResponse);
    }, 2000);
  };

  const handleNewConversation = (counselor) => {
    const existingConv = conversations.find(
      c => c.counselor === counselor.name
    );
    if (existingConv) {
      setSelectedConversation(existingConv);
    } else {
      const newConv = {
        id: Math.max(...conversations.map(c => c.id)) + 1,
        counselor: counselor.name,
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
        unread: 0,
        messages: [
          {
            id: 1,
            sender: counselor.name,
            message: `Hi! I'm ${counselor.name}. How can I help you?`,
            timestamp: new Date().toISOString(),
            isOwn: false,
          },
        ],
      };
      setConversations([...conversations, newConv]);
      setSelectedConversation(newConv);
    }
    setShowNewConversationModal(false);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.counselor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-green-600" />
          Chat with Counselor
        </h2>
        <button
          onClick={() => setShowNewConversationModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          New Message
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96 lg:h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                    selectedConversation?.id === conv.id
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {conv.counselor}
                    </p>
                    {conv.unread > 0 && (
                      <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {conv.lastMessage}
                  </p>
                </button>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation && (
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {selectedConversation.counselor}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Counselor at School Guidance Office
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {selectedConversation.messages.map(msg => (
                <MessageCard
                  key={msg.id}
                  message={msg.message}
                  sender={msg.sender}
                  timestamp={msg.timestamp}
                  isOwn={msg.isOwn}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConversationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Start New Conversation
              </h2>
              <button
                onClick={() => setShowNewConversationModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select a counselor to start a new conversation:
              </p>
              <div className="space-y-2">
                {counselors.map(counselor => (
                  <button
                    key={counselor.id}
                    onClick={() => handleNewConversation(counselor)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 transition"
                  >
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {counselor.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Click to chat
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWithCounselorTab;
