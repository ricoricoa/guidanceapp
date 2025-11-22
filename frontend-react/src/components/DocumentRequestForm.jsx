import React, { useState } from 'react';
import { X, Send, FileText } from 'lucide-react';
import api from '../api/axios';

export const DocumentRequestForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    request_type: 'good_moral',
    purpose: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const requestTypes = [
    { value: 'good_moral', label: 'Good Moral Certificate' },
    { value: 'referral', label: 'Referral/Recommendation Letter' },
    { value: 'certificate', label: 'Certificate of Completion' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage('');

    try {
      const response = await api.post('/api/v1/documents', formData);
      
      if (response.status === 201 || response.status === 200) {
        setMessage('✅ Document request submitted successfully! Waiting for counselor approval.');
        setMessageType('success');
        
        // Reset form
        setFormData({
          request_type: 'good_moral',
          purpose: '',
          notes: ''
        });
        
        // Close after 2 seconds
        setTimeout(() => {
          onClose();
          if (onSubmit) onSubmit();
        }, 2000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
      setMessage(err.response?.data?.message || 'Failed to submit document request');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Request Document</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded mb-4 text-sm font-medium ${
            messageType === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Request Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Document Type *
            </label>
            <select
              name="request_type"
              value={formData.request_type}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.request_type ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {requestTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.request_type && <p className="text-red-500 text-xs mt-1">{errors.request_type}</p>}
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Purpose/Reason
            </label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="e.g., For scholarship application"
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.purpose ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information for the counselor..."
              rows="3"
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.notes ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
