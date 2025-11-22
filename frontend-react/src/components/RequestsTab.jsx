import React, { useState, useEffect } from 'react';
import { FileText, Plus, Send, X, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import api from '../api/axios';

export const RequestsTab = () => {
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    request_type: 'good_moral',
    purpose: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch document requests on component mount
  useEffect(() => {
    fetchDocumentRequests();
  }, []);

  const fetchDocumentRequests = async () => {
    try {
      const response = await api.get('/api/v1/documents');
      if (response.data?.data?.requests) {
        setRequests(response.data.data.requests);
      }
    } catch (error) {
      console.error('Error fetching document requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const documentTypes = [
    { value: 'good_moral', label: 'Good Moral Certificate', description: 'Certificate of good moral character' },
    { value: 'referral', label: 'Referral Letter', description: 'Letter for referral purposes' },
    { value: 'certificate', label: 'Certificate of Attendance', description: 'Certificate of attendance' },
  ];

  const getTypeLabel = (type) => {
    const doc = documentTypes.find(d => d.value === type);
    return doc ? doc.label : type;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!formData.request_type) {
      setMessage({ type: 'error', text: 'Please select a document type.' });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/v1/documents', {
        request_type: formData.request_type,
        purpose: formData.purpose,
        notes: formData.notes
      });

      if (response.status === 201 || response.status === 200) {
        // Refresh the requests list
        await fetchDocumentRequests();
        setFormData({ request_type: 'good_moral', purpose: '', notes: '' });
        setShowForm(false);
        setMessage({ type: 'success', text: '✅ Request submitted successfully! Waiting for counselor approval.' });
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      const errorMsg = error.response?.data?.message || 'Failed to submit request. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Document Requests</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Request certificates, referrals, and other documents</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          New Request
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-start gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* Request Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Request New Document
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Fill in the details for your request</p>
            </div>
            <button
              onClick={() => {
                setShowForm(false);
                setFormData({ request_type: 'good_moral', purpose: '', notes: '' });
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitRequest} className="space-y-4">
            {/* Document Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Document Type *
              </label>
              <select
                name="request_type"
                value={formData.request_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
              >
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Purpose (Optional)
              </label>
              <input
                type="text"
                name="purpose"
                placeholder="e.g., School transfer, Scholarship application"
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                placeholder="Any additional information..."
                rows="3"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ request_type: 'good_moral', purpose: '', notes: '' });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Requests</h3>
        
        {loadingRequests ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No requests yet. Create your first request!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {requests.map(request => (
              <div
                key={request.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">{getTypeLabel(request.request_type)}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || 'Pending'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Submitted Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {request.submitted_at ? new Date(request.submitted_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Remarks</p>
                        <p className="font-medium text-gray-900 dark:text-white">{request.remarks || 'Awaiting processing'}</p>
                      </div>
                    </div>

                    {request.purpose && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Purpose</p>
                        <p className="text-gray-900 dark:text-white">{request.purpose}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
