import React from 'react';
import { Award, FileText, BookOpen, Plus } from 'lucide-react';

export const RequestTypeSelector = ({ onSelectType, onClose }) => {
  const requestTypes = [
    {
      id: 'good_moral',
      title: 'Good Moral Certificate',
      description: 'Certificate of good moral character',
      icon: Award,
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'referral',
      title: 'Referral Letter',
      description: 'Letter for referral purposes',
      icon: FileText,
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      id: 'certificate',
      title: 'Certificate of Attendance',
      description: 'Certificate of attendance or completion',
      icon: BookOpen,
      color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Documents</h2>
        <p className="text-gray-600 dark:text-gray-400">Select the document you want to request</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {requestTypes.map(type => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => onSelectType(type.id, type.title)}
              className={`p-6 border-2 rounded-lg transition transform hover:scale-105 hover:shadow-lg ${type.color}`}
            >
              <div className="flex flex-col items-center text-center">
                <Icon className={`w-12 h-12 mb-3 ${type.iconColor}`} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {type.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {type.description}
                </p>
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Request Now</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
