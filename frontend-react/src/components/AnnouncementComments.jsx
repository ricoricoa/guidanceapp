import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Trash2, Edit2, Send } from 'lucide-react';

const AnnouncementComments = ({ announcementId, userId, userName, userImage }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [announcementId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/v1/announcements/${announcementId}/comments`
      );

      // Handle nested data structure
      let commentsData = [];
      if (response.data?.data?.data) {
        commentsData = response.data.data.data;
      } else if (Array.isArray(response.data?.data)) {
        commentsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        commentsData = response.data;
      }

      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (newComment.length > 1000) {
      setError('Comment must be less than 1000 characters');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await api.post(
        `/api/v1/announcements/${announcementId}/comments`,
        { content: newComment }
      );

      if (response.data?.data) {
        setComments([response.data.data, ...comments]);
        setNewComment('');
        // Automatically clear success message after 2 seconds
        setTimeout(() => setError(''), 2000);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to add comment';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (editContent.length > 1000) {
      setError('Comment must be less than 1000 characters');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await api.put(`/api/v1/comments/${commentId}`, {
        content: editContent,
      });

      if (response.data?.data) {
        setComments(
          comments.map((c) =>
            c.id === commentId ? response.data.data : c
          )
        );
        setEditingId(null);
        setEditContent('');
      }
    } catch (err) {
      console.error('Error updating comment:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update comment';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setError('');
    try {
      await api.delete(`/api/v1/comments/${commentId}`);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete comment';
      setError(errorMsg);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4 py-4">
      {/* Comment Form */}
      <form onSubmit={handleAddComment} className="space-y-3">
        <div className="flex gap-3">
          {userImage && (
            <img
              src={userImage}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
            />
          )}
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
                setError('');
              }}
              placeholder="Add a comment..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="2"
              maxLength="1000"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {newComment.length} / 1000
              </span>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition text-sm font-medium"
              >
                <Send className="w-4 h-4" />
                Post
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950 p-2 rounded">
            {error}
          </div>
        )}
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              {comment.user?.profile_picture ? (
                <img
                  src={comment.user.profile_picture}
                  alt={comment.user.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {comment.user?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-900 dark:text-white">
                      {comment.user?.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDate(comment.created_at)} at{' '}
                      {formatTime(comment.created_at)}
                    </p>
                  </div>

                  {userId === comment.user_id && (
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditContent(comment.content);
                        }}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
                        title="Edit comment"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {editingId === comment.id ? (
                  <div className="mt-2 space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
                      rows="2"
                      maxLength="1000"
                    />
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {editContent.length} / 1000
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 text-sm bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          disabled={submitting}
                          className="px-2 py-1 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded transition"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 break-words">
                    {comment.content}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementComments;
