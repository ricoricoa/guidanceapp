import React, { useState } from 'react';
import { MessageSquare, Send, X, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api/axios';

const StudentReportForm = ({ onClose, onReportSent }) => {
  const [formData, setFormData] = useState({
    report_type: 'bug',
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reportTypes = [
    { id: 'bug', label: 'Bug Report', icon: AlertCircle, description: 'Report a system issue' },
    { id: 'suggestion', label: 'Suggestion', icon: MessageSquare, description: 'Feature or improvement idea' },
    { id: 'feedback', label: 'General Feedback', icon: MessageSquare, description: 'Share your experience' },
    { id: 'other', label: 'Other', icon: MessageSquare, description: 'Something else' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/v1/reports', formData);
      setSubmitted(true);
      setTimeout(() => {
        if (onReportSent) onReportSent();
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting report:', err);
      alert('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Report Sent!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thank you for your feedback. Our admin team will review it shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Send Report/Feedback</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              Report Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {reportTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, report_type: type.id }))}
                  className={`p-3 rounded-lg border-2 transition ${
                    formData.report_type === type.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                      : 'border-gray-300 dark:border-gray-600 hover:border-indigo-300'
                  }`}
                >
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{type.label}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief title of your report"
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of your report, feedback, or suggestion"
              maxLength={500}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentReportForm;
