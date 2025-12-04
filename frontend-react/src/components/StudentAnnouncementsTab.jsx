import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Calendar, AlertCircle, Lightbulb, Volume2, Loader } from 'lucide-react';
import AnnouncementComments from './AnnouncementComments';
import EmojiReactions from './EmojiReactions';

const StudentAnnouncementsTab = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);
  const [announcementReactions, setAnnouncementReactions] = useState({});

  useEffect(() => {
    fetchCurrentUser();
    fetchAnnouncements();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/api/v1/user');
      setCurrentUser(response.data.data || response.data);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/v1/announcements');
      const announcements = response.data.data.data || response.data.data || [];
      setAnnouncements(announcements);

      // Fetch reactions for all announcements
      const reactionsMap = {};
      for (const announcement of announcements) {
        try {
          const reactRes = await api.get(
            `/api/v1/announcements/${announcement.id}/reactions`
          );
          reactionsMap[announcement.id] = reactRes.data.data || [];
        } catch (err) {
          console.error(
            `Error fetching reactions for announcement ${announcement.id}:`,
            err
          );
          reactionsMap[announcement.id] = [];
        }
      }
      setAnnouncementReactions(reactionsMap);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load announcements');
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'tips':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'news':
        return <Volume2 className="w-5 h-5 text-blue-500" />;
      default:
        return <Volume2 className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'tips':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'alert':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'news':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredAnnouncements = filter === 'all'
    ? announcements
    : announcements.filter(a => a.category === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Announcements
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Stay updated with important news, tips, and alerts from your counselor
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full font-medium transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('tips')}
          className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-2 ${
            filter === 'tips'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          Tips
        </button>
        <button
          onClick={() => setFilter('alert')}
          className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-2 ${
            filter === 'alert'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          Alerts
        </button>
        <button
          onClick={() => setFilter('news')}
          className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-2 ${
            filter === 'news'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          News
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <Volume2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {filter === 'all' ? 'No announcements yet' : `No ${filter} announcements`}
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
            Check back later for updates from your counselor
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map(announcement => (
            <div
              key={announcement.id}
              onClick={() => setSelectedAnnouncement(selectedAnnouncement?.id === announcement.id ? null : announcement)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg dark:hover:shadow-gray-900/50 transition cursor-pointer overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getCategoryIcon(announcement.category)}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                        {announcement.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadgeColor(announcement.category)}`}>
                          {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {formatDate(announcement.published_at || announcement.created_at)}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                {/* Content Preview / Full */}
                <div className={`text-gray-700 dark:text-gray-300 leading-relaxed mb-3 ${
                  selectedAnnouncement?.id === announcement.id ? '' : 'line-clamp-3'
                }`}>
                  {announcement.content}
                </div>

                {/* Read More */}
                {selectedAnnouncement?.id !== announcement.id && announcement.content.length > 150 && (
                  <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                    Read More
                  </button>
                )}

                {/* Full View Close */}
                {selectedAnnouncement?.id === announcement.id && (
                  <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                    Show Less
                  </button>
                )}

                {/* Counselor Info */}
                {announcement.counselor && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
                    From: <span className="font-medium">{announcement.counselor.name}</span>
                  </div>
                )}
              </div>

              {/* Expanded Section - Reactions and Comments */}
              {selectedAnnouncement?.id === announcement.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-5 space-y-6" onClick={(e) => e.stopPropagation()}>
                  {/* Reactions Section */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span>👍 Reactions</span>
                    </h4>
                    <EmojiReactions
                      announcementId={announcement.id}
                      reactions={announcementReactions[announcement.id] || []}
                      currentUserId={currentUser?.id}
                      onReactionsUpdate={(newReactions) => {
                        setAnnouncementReactions({
                          ...announcementReactions,
                          [announcement.id]: newReactions,
                        });
                      }}
                    />
                  </div>

                  {/* Comments Section */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span>💬 Comments</span>
                    </h4>
                    {currentUser && (
                      <AnnouncementComments
                        announcementId={announcement.id}
                        userId={currentUser.id}
                        userName={currentUser.name}
                        userImage={currentUser.profile_picture}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={fetchAnnouncements}
          className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition"
        >
          Refresh Announcements
        </button>
      </div>
    </div>
  );
};

export default StudentAnnouncementsTab;
