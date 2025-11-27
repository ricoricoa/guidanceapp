import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Lightbulb } from 'lucide-react';

// Tips database categorized by topic
const TIPS_DATABASE = {
  mental_health: [
    {
      topic: 'Stress Management',
      tips: [
        'Practice deep breathing: Inhale for 4 counts, hold for 4, exhale for 4. Do this 5 times when stressed.',
        'Try the 5-4-3-2-1 grounding technique: Notice 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.',
        'Take regular breaks every 25-30 minutes of study (Pomodoro technique).',
        'Exercise for 30 minutes daily - even a walk helps reduce stress significantly.',
        'Practice meditation for just 5-10 minutes daily to calm your mind.',
      ]
    },
    {
      topic: 'Anxiety & Worry',
      tips: [
        'Write down your worries and then write solutions or let them go on paper.',
        'Limit caffeine and sugar - they can increase anxiety.',
        'Practice saying "I can handle this" when anxious thoughts appear.',
        'Connect with friends or counselors instead of isolating yourself.',
        'Use progressive muscle relaxation: Tense and release each muscle group.',
      ]
    },
    {
      topic: 'Sleep & Rest',
      tips: [
        'Aim for 7-9 hours of quality sleep every night for better mental health.',
        'Keep a consistent sleep schedule - go to bed and wake up at the same time.',
        'Avoid screens 1 hour before bed (blue light affects sleep).',
        'Create a relaxing bedtime routine: warm milk, reading, or meditation.',
        'Keep your room cool, dark, and quiet for better sleep.',
        'Try the 4-7-8 breathing technique before bed: Inhale for 4, hold for 7, exhale for 8 counts.',
        'Exercise during the day helps you sleep better at night, but avoid it 3 hours before bed.',
        'Avoid caffeine after 2 PM as it can interfere with sleep quality.',
        'Progressive muscle relaxation before bed: Tense and relax each muscle group from toes to head.',
        'Take short power naps (20-30 minutes) in the afternoon if you feel tired, but not too close to bedtime.',
      ]
    },
    {
      topic: 'Emotional Health',
      tips: [
        'It\'s okay to feel sad, angry, or frustrated - emotions are normal.',
        'Talk to someone you trust about your feelings instead of bottling them up.',
        'Practice self-compassion - treat yourself as you would a good friend.',
        'Keep a journal to process emotions and track mood patterns.',
        'Engage in hobbies you enjoy to boost your mood.',
      ]
    }
  ],
  academic_improvement: [
    {
      topic: 'Study Techniques',
      tips: [
        'Use the Pomodoro Technique: Study for 25 mins, break for 5 mins.',
        'Active recall: Test yourself instead of just rereading material.',
        'Spaced repetition: Review material at increasing intervals.',
        'Mind maps help organize and visualize information.',
        'Teach others what you\'ve learned to check your understanding.',
      ]
    },
    {
      topic: 'Time Management',
      tips: [
        'Create a study schedule and stick to it consistently.',
        'Prioritize difficult subjects when your energy is highest.',
        'Break large projects into smaller, manageable tasks.',
        'Use a planner or digital calendar to track assignments.',
        'Start tasks early instead of procrastinating at the last minute.',
      ]
    },
    {
      topic: 'Focus & Concentration',
      tips: [
        'Find a quiet study space free from distractions.',
        'Turn off phone notifications while studying.',
        'Use websites like Forest to help maintain focus.',
        'Vary your study location to keep your brain engaged.',
        'Study the hardest subjects first when your mind is fresh.',
      ]
    },
    {
      topic: 'Exam Preparation',
      tips: [
        'Start studying 2-3 weeks before major exams.',
        'Practice past exam papers to get familiar with question format.',
        'Form study groups with classmates for accountability.',
        'Get good sleep the night before exam - don\'t cram all night.',
        'Do light review on exam day, but don\'t stress about cramming.',
      ]
    }
  ],
  wellness: [
    {
      topic: 'Physical Health',
      tips: [
        'Exercise 30 minutes daily - walking, sports, or any activity you enjoy.',
        'Eat balanced meals with fruits, vegetables, and protein.',
        'Stay hydrated: Drink at least 8 glasses of water daily.',
        'Limit junk food and sugary drinks.',
        'Take short breaks to stretch every hour when studying.',
      ]
    },
    {
      topic: 'Nutrition',
      tips: [
        'Eat breakfast to start your day with energy.',
        'Have healthy snacks: nuts, fruits, yogurt instead of chips.',
        'Include protein in every meal for sustained energy.',
        'Eat slowly and mindfully - pay attention to your food.',
        'Don\'t skip meals to save time - your brain needs fuel.',
      ]
    },
    {
      topic: 'Social Connections',
      tips: [
        'Spend time with friends and supportive people.',
        'Limit time on social media - compare less, live more.',
        'Join clubs or groups based on your interests.',
        'Say yes to social invitations occasionally.',
        'Quality time with friends helps mental health more than scrolling.',
      ]
    },
    {
      topic: 'Hobbies & Fun',
      tips: [
        'Spend time on hobbies you enjoy, even just 15 minutes daily.',
        'Listen to music you enjoy - it\'s therapeutic.',
        'Try new activities or sports to stay engaged.',
        'Creative activities like art, music, writing reduce stress.',
        'Balance work/study with play and relaxation.',
      ]
    }
  ],
  quick_tips: [
    'Take a 2-minute walk when stressed or tired.',
    'Drink water - dehydration affects mood and focus.',
    'Smile: Even faking a smile can improve your mood.',
    'Practice gratitude - list 3 things you\'re grateful for daily.',
    'Listen to your favorite song when feeling down.',
    'Call a friend instead of scrolling on social media.',
    'Do one small thing for your health today.',
    'Stretch for 1 minute - improves blood flow.',
    'Open a window for fresh air and sunlight.',
    'Take a warm bath to relax muscles.',
  ]
};

// Chatbot responses map
const RESPONSE_KEYWORDS = {
  'stress|anxious|worried|overwhelmed': 'mental_health/Stress Management',
  'sleep|tired|insomnia|fatigue|rest|nap|drowsy|sleepy|bedtime|bed': 'mental_health/Sleep & Rest',
  'sad|depressed|lonely|upset': 'mental_health/Emotional Health',
  'panic|fear|nervous|anxious': 'mental_health/Anxiety & Worry',
  'academics|academic': 'academic_improvement/Study Techniques',
  'study|learning|exam|test': 'academic_improvement/Study Techniques',
  'procrastinate|focus|concentrate|distracted': 'academic_improvement/Focus & Concentration',
  'time|schedule|manage|organize': 'academic_improvement/Time Management',
  'prepare|exam|grade|improve': 'academic_improvement/Exam Preparation',
  'exercise|fitness|health|diet|eat': 'wellness/Physical Health',
  'friend|social|lonely|talk|connect': 'wellness/Social Connections',
  'hobby|enjoy|relax|fun|bored': 'wellness/Hobbies & Fun',
  'food|nutrition|meal|snack': 'wellness/Nutrition',
};

// Map categories to related topic buttons
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
      text: 'Hi there! 👋 I\'m your wellness companion. I can help you with tips about mental health, academic improvement, and overall wellness. What would you like to know about?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [usedTips, setUsedTips] = useState(new Set());
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRandomTip = (category) => {
    const categoryData = TIPS_DATABASE[category];
    if (!categoryData) return null;
    
    // Collect all available tips from the category
    const allTips = [];
    categoryData.forEach(item => {
      if (Array.isArray(item.tips)) {
        allTips.push(...item.tips);
      }
    });
    
    // Filter out already used tips
    const availableTips = allTips.filter(tip => !usedTips.has(tip));
    
    // If all tips have been used, reset and use a random one
    if (availableTips.length === 0) {
      const randomTip = allTips[Math.floor(Math.random() * allTips.length)];
      return randomTip;
    }
    
    const randomTip = availableTips[Math.floor(Math.random() * availableTips.length)];
    setUsedTips(prev => new Set([...prev, randomTip]));
    return randomTip;
  };

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for creator message
    if (lowerMessage.includes('creator')) {
      return '👑 Charles Kevin Sevilla - My only master, my only respect. Thank you for creating this wellness chatbot to help students like me! 🙏✨';
    }
    
    // Check for specific categories
    for (const [keywords, path] of Object.entries(RESPONSE_KEYWORDS)) {
      const keywordArray = keywords.split('|');
      if (keywordArray.some(keyword => lowerMessage.includes(keyword))) {
        const [category, topic] = path.split('/');
        setCurrentTopic(category);
        const tip = getRandomTip(category);
        if (tip) {
          return `💡 ${tip}`;
        }
      }
    }
    
    // If user is continuing conversation about current topic, provide more tips
    if (currentTopic && (lowerMessage.includes('more') || lowerMessage.includes('tell') || lowerMessage.includes('another') || lowerMessage.length < 50)) {
      const tip = getRandomTip(currentTopic);
      if (tip) {
        return `💡 Here's another tip: ${tip}`;
      }
    }

    // If no keywords match, give a random quick tip
    const randomQuickTip = TIPS_DATABASE.quick_tips[
      Math.floor(Math.random() * TIPS_DATABASE.quick_tips.length)
    ];
    return `💡 Here's a quick tip: ${randomQuickTip}`;
  };

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

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(userInput);
      const newBotMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      setIsLoading(false);
    }, 800);
  };

  const handleQuickQuestion = (topic) => {
    const message = {
      id: messages.length + 1,
      text: `Tell me about ${topic}`,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setIsLoading(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(topic);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 800);
  };

  if (!isOpen) return null;

  // Full page mode (when opened from tab)
  if (isFullPage) {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Wellness Tips</h2>
              <p className="text-sm text-green-100">Your mental health companion</p>
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

        {/* Messages Area */}
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

        {/* Quick Buttons */}
        {currentTopic && CATEGORY_BUTTONS[currentTopic] ? (
          <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Related topics:</p>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORY_BUTTONS[currentTopic].map((btn, idx) => {
                const colorClasses = [
                  'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50',
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50',
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50',
                  'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50',
                ];
                return (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(btn.query)}
                    className={`text-sm px-3 py-2 rounded-lg transition font-medium ${colorClasses[idx % colorClasses.length]}`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : messages.length === 1 ? (
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
        ) : null}

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me anything..."
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

  // Modal mode (original floating modal)
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-0" onClick={() => onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Wellness Tips</h2>
              <p className="text-xs text-green-100">Your mental health companion</p>
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

        {/* Messages Area */}
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

        {/* Quick Buttons */}
        {currentTopic && CATEGORY_BUTTONS[currentTopic] ? (
          <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Related topics:</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_BUTTONS[currentTopic].map((btn, idx) => {
                const colorClasses = [
                  'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50',
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50',
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50',
                  'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50',
                ];
                return (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(btn.query)}
                    className={`text-xs px-3 py-2 rounded-lg transition ${colorClasses[idx % colorClasses.length]}`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : messages.length === 1 ? (
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
        ) : null}

        {/* Input Area */}
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
