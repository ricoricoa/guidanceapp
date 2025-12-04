import React, { useState } from 'react';
import api from '../api/axios';
import { Smile, Users } from 'lucide-react';

const POPULAR_EMOJIS = [
  { emoji: '👍', label: 'Like' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '😂', label: 'Funny' },
  { emoji: '😍', label: 'Awesome' },
  { emoji: '🔥', label: 'Hot' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '🎉', label: 'Party' },
  { emoji: '👏', label: 'Clap' },
  { emoji: '💯', label: 'Perfect' },
];

const EmojiReactions = ({ announcementId, reactions = [], onReactionsUpdate, currentUserId }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if current user already has a reaction
  const userReaction = reactions.find(reaction => 
    reaction.users.some(user => user.id === currentUserId)
  );

  const handleReaction = async (emoji) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post(`/api/v1/announcements/${announcementId}/reactions`, {
        emoji: emoji,
      });

      if (response.data?.data) {
        onReactionsUpdate(response.data.data);
        setShowEmojiPicker(false);
      }
    } catch (err) {
      console.error('Error adding reaction:', err);
      setError(err.response?.data?.message || 'Failed to add reaction');
    } finally {
      setLoading(false);
    }
  };

  // Group reactions for display
  const groupedReactions = reactions || [];

  return (
    <div className="space-y-3 py-3">
      {error && (
        <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {groupedReactions.map((reaction, idx) => (
          <div key={idx} className="relative group">
            <button
              onClick={() => handleReaction(reaction.emoji)}
              className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 border border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-600 rounded-full transition text-sm font-medium"
            >
              <span className="text-lg">{reaction.emoji}</span>
              <span className="text-xs text-gray-700 dark:text-gray-300 font-semibold">
                {reaction.count}
              </span>
            </button>
            
            {/* Tooltip showing who reacted */}
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 dark:bg-gray-950 text-white text-xs rounded-lg p-3 whitespace-nowrap z-20 shadow-lg min-w-max">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-3 h-3" />
                <span className="font-semibold">Reacted with {reaction.emoji}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 space-y-1">
                {reaction.users.map((user) => (
                  <div key={user.id} className="text-gray-300">
                    {user.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition"
            disabled={loading}
            title="Add reaction"
          >
            <Smile className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 grid grid-cols-5 gap-3 z-10 w-64">
              {userReaction && (
                <div className="col-span-5 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Your reaction: <span className="text-lg">{userReaction.emoji}</span> (click to remove)
                  </p>
                </div>
              )}
              {POPULAR_EMOJIS.map((item) => (
                <button
                  key={item.emoji}
                  onClick={() => handleReaction(item.emoji)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg transition group ${
                    userReaction?.emoji === item.emoji
                      ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-500'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={item.label}
                >
                  <span className={`text-3xl ${userReaction?.emoji === item.emoji ? 'scale-125' : 'group-hover:scale-125'} transition transform`}>
                    {item.emoji}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmojiReactions;
