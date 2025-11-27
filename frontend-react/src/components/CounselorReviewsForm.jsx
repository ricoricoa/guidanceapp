import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Star, Send, AlertCircle, CheckCircle } from 'lucide-react';

export const CounselorReviewsForm = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [existingReview, setExistingReview] = useState(null);

  // Fetch all counselors on component mount
  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await api.get('/api/v1/reviews/counselors');
        console.log('Counselors API response:', res.data);
        
        // Handle response - check for data array or direct array
        const counselorData = res.data?.data || res.data || [];
        const counselorsArray = Array.isArray(counselorData) ? counselorData : [];
        
        if (counselorsArray.length > 0) {
          setCounselors(counselorsArray);
          console.log('Counselors loaded:', counselorsArray.length);
        } else {
          console.warn('No counselors in response');
          setCounselors([]);
        }
      } catch (err) {
        console.error('Error fetching counselors:', err.response?.data || err.message);
        setMessage('Failed to load counselors: ' + (err.response?.data?.message || err.message));
        setMessageType('error');
        setCounselors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCounselors();
  }, []);

  // Fetch existing review when counselor is selected
  useEffect(() => {
    if (!selectedCounselor) return;

    const fetchExistingReview = async () => {
      try {
        const res = await api.get(`/api/v1/reviews/counselor/${selectedCounselor.id}`);
        if (res.data?.data) {
          setExistingReview(res.data.data);
          setRating(res.data.data.rating);
          setComment(res.data.data.comment || '');
        } else {
          setExistingReview(null);
          setRating(0);
          setComment('');
        }
      } catch (err) {
        console.error('Error fetching existing review:', err);
        setExistingReview(null);
        setRating(0);
        setComment('');
      }
    };

    fetchExistingReview();
  }, [selectedCounselor]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!selectedCounselor) {
      setMessage('Please select a counselor');
      setMessageType('error');
      return;
    }

    if (rating === 0) {
      setMessage('Please select a rating');
      setMessageType('error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/api/v1/reviews/store', {
        counselor_id: selectedCounselor.id,
        rating,
        comment,
      });

      console.log('Review submission response:', res.data);
      setMessage(res.data?.message || 'Review submitted successfully!');
      setMessageType('success');
      setRating(0);
      setComment('');
      setSelectedCounselor(null);

      // Refresh counselors list to update rating
      const counselorsRes = await api.get('/api/v1/reviews/counselors');
      const counselorData = counselorsRes.data?.data || counselorsRes.data || [];
      const counselorsArray = Array.isArray(counselorData) ? counselorData : [];
      if (counselorsArray.length > 0) {
        setCounselors(counselorsArray);
      }
    } catch (err) {
      console.error('Error submitting review:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Failed to submit review');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading counselors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Counselor Reviews</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Share your feedback about your counseling experience to help improve our guidance services.
        </p>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              messageType === 'success'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700'
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'
            }`}
          >
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Counselors List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Select a Counselor
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {counselors.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No counselors available</p>
              ) : (
                counselors.map(counselor => (
                  <button
                    key={counselor.id}
                    onClick={() => setSelectedCounselor(counselor)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                      selectedCounselor?.id === counselor.id
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-green-100 dark:hover:bg-green-900/30'
                    }`}
                  >
                    <div className="font-semibold">{counselor.name}</div>
                    <div className="text-sm opacity-75">{counselor.email}</div>
                    {counselor.review_count > 0 && (
                      <div className="text-sm mt-2 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(counselor.average_rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="opacity-75">
                          {counselor.average_rating.toFixed(1)} ({counselor.review_count})
                        </span>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Review Form */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {selectedCounselor ? `Rate ${selectedCounselor.name}` : 'Select a counselor to review'}
            </h2>

            {selectedCounselor && (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Counselor Info */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {selectedCounselor.name}
                  </div>
                  {selectedCounselor.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedCounselor.bio}
                    </p>
                  )}
                  {existingReview && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                      ✎ You previously reviewed this counselor
                    </p>
                  )}
                </div>

                {/* Rating Stars */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    How would you rate this counselor?
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoveredRating || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      You rated: <span className="font-semibold">{rating}/5 stars</span>
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Your Feedback (Optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Share details about your experience with this counselor..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500 resize-none"
                    rows="4"
                    maxLength="1000"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {comment.length}/1000 characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || rating === 0}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition duration-300 ${
                    submitting || rating === 0
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  {submitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
                </button>
              </form>
            )}

            {!selectedCounselor && (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center text-gray-600 dark:text-gray-400">
                <p>Select a counselor from the list to write a review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorReviewsForm;
