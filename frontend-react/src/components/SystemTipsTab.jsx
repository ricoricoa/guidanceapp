import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Lightbulb, BookOpen, Zap, Users, FileText, Settings } from 'lucide-react';
import { TipsCard } from './StudentDashboardPartials';

/**
 * SystemTipsTab Component
 * Provides help and tips about the guidance system
 */
export const SystemTipsTab = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I request a counseling appointment?',
      answer:
        'Navigate to the "Appointments" section of your dashboard and click the "Request" button. Fill in your preferred date, time, and select your counselor. Your request will be sent for approval.',
      icon: Calendar,
    },
    {
      id: 2,
      question: 'How long does it take to get a character referral?',
      answer:
        'Character referrals typically take 5-10 business days to prepare. The counselor will review your request and notify you when it\'s ready. Plan ahead, especially for college applications.',
      icon: Clock,
    },
    {
      id: 3,
      question: 'Can I message my counselor directly?',
      answer:
        'Yes! Use the "Chat with Counselor" section to send messages directly to your assigned counselor. They will respond during their working hours.',
      icon: MessageSquare,
    },
    {
      id: 4,
      question: 'What if I need to reschedule my appointment?',
      answer:
        'Go to your appointment details and look for the reschedule option (if the appointment is still pending). Alternatively, you can message your counselor to request a reschedule.',
      icon: Calendar,
    },
    {
      id: 5,
      question: 'How do I access my academic records?',
      answer:
        'Your academic records and documents are available in the "Resources" section. You can view, download, or print them as needed.',
      icon: FileText,
    },
    {
      id: 6,
      question: 'Who can I contact if I have technical issues?',
      answer:
        'If you experience technical problems, please use the help chat at the bottom right of the page or contact the IT Support team at support@school.edu',
      icon: Settings,
    },
  ];

  const features = [
    {
      title: 'Schedule Appointments',
      description: 'Book counseling sessions with your preferred counselor',
      tips: [
        'Choose a time that works best for you',
        'Be specific about your concerns',
        'Plan at least 24 hours in advance',
      ],
      icon: Calendar,
    },
    {
      title: 'Request Character Referrals',
      description: 'Get character and moral referrals for applications',
      tips: [
        'Allow 1-2 weeks for preparation',
        'Choose the right subject area',
        'Specify your purpose clearly',
      ],
      icon: Award,
    },
    {
      title: 'Direct Messaging',
      description: 'Chat with counselors for quick questions',
      tips: [
        'Check messages regularly',
        'Include all relevant details',
        'Be professional and respectful',
      ],
      icon: MessageSquare,
    },
    {
      title: 'View Resources',
      description: 'Access guidance materials and documents',
      tips: [
        'Browse available resources',
        'Download for offline use',
        'Share with parents if needed',
      ],
      icon: BookOpen,
    },
    {
      title: 'Track Progress',
      description: 'Monitor your guidance goals and achievements',
      tips: [
        'Set realistic goals',
        'Review progress regularly',
        'Update your profile information',
      ],
      icon: TrendingUp,
    },
    {
      title: 'Get Help',
      description: 'Access tips and tutorials about the system',
      tips: [
        'Read the FAQs section',
        'Watch tutorial videos',
        'Contact support if needed',
      ],
      icon: HelpCircle,
    },
  ];

  const tips = [
    {
      title: 'Getting the Most from Your Counselor',
      icon: Users,
      tips: [
        'Prepare a list of questions or topics before your appointment',
        'Be honest about your concerns and challenges',
        'Take notes during your session',
        'Follow up on action items discussed',
        'Schedule regular check-ins to maintain progress',
      ],
    },
    {
      title: 'Making Effective Requests',
      icon: Zap,
      tips: [
        'Be specific and clear about what you need',
        'Provide sufficient notice (at least 48 hours)',
        'Include all relevant details in your request',
        'Respect the counselor\'s availability',
        'Follow up if you don\'t receive a response',
      ],
    },
    {
      title: 'Professional Communication',
      icon: FileText,
      tips: [
        'Use proper grammar and spelling in messages',
        'Be respectful and courteous',
        'Avoid using ALL CAPS (it appears as shouting)',
        'Keep messages concise and focused',
        'Don\'t share confidential information via chat',
      ],
    },
    {
      title: 'System Navigation Tips',
      icon: Lightbulb,
      tips: [
        'Use the sidebar to navigate between sections',
        'Check your notifications regularly',
        'Update your profile information',
        'Download and save important documents',
        'Use the search feature to find resources',
      ],
    },
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
          System Tips & Help
        </h2>
      </div>

      {/* Features Grid */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Key Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition"
              >
                <Icon className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {feature.description}
                </p>
                <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                  {feature.tips.slice(0, 2).map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips Cards */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Helpful Tips
        </h3>
        <div className="grid gap-4">
          {tips.map((section, idx) => {
            const Icon = section.icon;
            return (
              <TipsCard
                key={idx}
                icon={Icon}
                title={section.title}
                tips={section.tips}
                variant="info"
              />
            );
          })}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {faqs.map(faq => (
            <div
              key={faq.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-4 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div className="flex items-start gap-3 text-left flex-1">
                  <faq.icon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                </div>
                {expandedFAQ === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
              </button>
              {expandedFAQ === faq.id && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Need More Help?
        </h3>
        <p className="text-blue-800 dark:text-blue-300 mb-4">
          If you can't find the answer to your question, our support team is here to help.
        </p>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <p>
            <span className="font-semibold">Email:</span> support@school.edu
          </p>
          <p>
            <span className="font-semibold">Phone:</span> (555) 123-4567
          </p>
          <p>
            <span className="font-semibold">Office Hours:</span> Monday - Friday, 8:00 AM - 4:00 PM
          </p>
        </div>
      </div>
    </div>
  );
};

// Missing icons
const Calendar = ({ className = '' }) => (
  <svg className={`${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Clock = ({ className = '' }) => (
  <svg className={`${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MessageSquare = ({ className = '' }) => (
  <svg className={`${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const Award = ({ className = '' }) => (
  <svg className={`${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const TrendingUp = ({ className = '' }) => (
  <svg className={`${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default SystemTipsTab;
