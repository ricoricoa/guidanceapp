import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Lightbulb } from 'lucide-react';
import { sendChatMessage } from '../api/chatService';

const CATEGORY_BUTTONS = {
  mental_health: [
    { label: 'Stress Management', query: 'stress' },
    { label: 'Sleep & Rest', query: 'sleep' },
    { label: 'Emotional Health', query: 'sad' },
    { label: 'Anxiety & Worry', query: 'panic' },
  ],
  academic_improvement: [
    { label: 'Study Techniques', query: 'study' },
    { label: 'Focus Tips', query: 'focus' },
    { label: 'Time Management', query: 'time' },
    { label: 'Exam Preparation', query: 'exam' },
  ],
  wellness: [
    { label: 'Physical Health', query: 'exercise' },
    { label: 'Social Connections', query: 'friend' },
    { label: 'Hobbies & Fun', query: 'hobby' },
    { label: 'Nutrition', query: 'food' },
  ],
};

const TipsBot = ({ isOpen, onClose, isFullPage }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hi there! 👋 I\'m your wellness AI companion powered by real AI. I can help you with tips about mental health, academic improvement, and overall wellness. What would you like to know about?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: userInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context (exclude the bot's greeting)
      const conversationHistory = messages
        .filter(msg => msg.id !== 1)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        }));

      // Call the AI API through backend
      const response = await sendChatMessage(userInput, conversationHistory);

      const botMessage = {
        id: messages.length + 2,
        text: response.message || '⚠️ I apologize, I could not generate a response. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: '⚠️ Sorry, I encountered an error. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = async (topic) => {
    const message = {
      id: messages.length + 1,
      text: `Tell me about ${topic}`,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setIsLoading(true);

    try {
      const conversationHistory = messages
        .filter(msg => msg.id !== 1)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        }));

      const response = await sendChatMessage(`Tell me about ${topic}`, conversationHistory);

      const botMessage = {
        id: messages.length + 2,
        text: response.message || '⚠️ I apologize, I could not generate a response.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: '⚠️ Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Full page mode
  if (isFullPage) {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Wellness AI Chatbot</h2>
              <p className="text-sm text-green-100">Powered by real AI - Ask me anything</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-700 p-2 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-lg text-sm leading-relaxed ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Common topics:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickQuestion('stress')}
                className="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 px-3 py-2 rounded-lg transition font-medium"
              >
                Stress Management
              </button>
              <button
                onClick={() => handleQuickQuestion('study tips')}
                className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 px-3 py-2 rounded-lg transition font-medium"
              >
                Study Tips
              </button>
              <button
                onClick={() => handleQuickQuestion('sleep')}
                className="text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 px-3 py-2 rounded-lg transition font-medium"
              >
                Sleep & Rest
              </button>
              <button
                onClick={() => handleQuickQuestion('focus')}
                className="text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 px-3 py-2 rounded-lg transition font-medium"
              >
                Focus Tips
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me anything about wellness..."
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 dark:placeholder-gray-400 font-medium"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition font-bold flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Modal mode
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-0" onClick={() => onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Wellness AI</h2>
              <p className="text-xs text-green-100">Powered by real AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-700 p-2 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-lg text-sm leading-relaxed ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Common topics:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickQuestion('stress')}
                className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 px-3 py-2 rounded-lg transition"
              >
                Stress Management
              </button>
              <button
                onClick={() => handleQuickQuestion('study tips')}
                className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 px-3 py-2 rounded-lg transition"
              >
                Study Tips
              </button>
              <button
                onClick={() => handleQuickQuestion('sleep')}
                className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 px-3 py-2 rounded-lg transition"
              >
                Sleep & Rest
              </button>
              <button
                onClick={() => handleQuickQuestion('focus')}
                className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 px-3 py-2 rounded-lg transition"
              >
                Focus Tips
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TipsBot;
