import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User } from 'lucide-react';
import api from '../api/axios';

export const BookAppointmentModal = ({ isOpen, onClose, onBookingSuccess }) => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    counselor_id: '',
    date: '',
    time: '',
    topic: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchCounselors();
    }
  }, [isOpen]);

  const fetchCounselors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/counselors');
      console.log('Counselors response:', res.data);
      if (res.data?.data) {
        setCounselors(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching counselors:', err);
      setError('Failed to load counselors');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.counselor_id || !formData.date || !formData.time || !formData.topic) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      console.log('Submitting appointment:', {
        counselor_id: formData.counselor_id,
        date: formData.date,
        time: formData.time,
        topic: formData.topic,
      });

      const res = await api.post('/api/v1/student/appointments', {
        counselor_id: formData.counselor_id,
        date: formData.date,
        time: formData.time,
        topic: formData.topic,
      });

      console.log('Appointment created successfully:', res.data);

      if (res.data) {
        setFormData({ counselor_id: '', date: '', time: '', topic: '' });
        onBookingSuccess?.();
        onClose();
      }
    } catch (err) {
      console.error('Error booking appointment:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Book Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Counselor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Select Counselor
            </label>
            <select
              value={formData.counselor_id}
              onChange={(e) => setFormData({ ...formData, counselor_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
              disabled={loading}
            >
              <option value="">Choose a counselor...</option>
              {counselors.map((counselor) => (
                <option key={counselor.id} value={counselor.id}>
                  {counselor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Topic
            </label>
            <textarea
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="What would you like to discuss?"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-medium"
            >
              {submitting ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
