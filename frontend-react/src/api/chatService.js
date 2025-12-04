import api from './axios';

/**
 * Send a message to the AI chatbot and get a response.
 * The backend handles the OpenAI API integration securely.
 * @param {string} message - User message
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<Object>} Response with message and metadata
 */
export const sendChatMessage = async (message, conversationHistory = []) => {
  try {
    const response = await api.post('/api/v1/chat', {
      message,
      conversation_history: conversationHistory,
      context: 'student_wellness', // Tells the backend to use wellness chatbot system prompt
    });

    return {
      success: true,
      message: response.data.reply || response.data.data?.message || response.data.message || 'No response received',
      metadata: response.data.data?.metadata || {},
      raw: response.data,
    };
  } catch (error) {
    console.error('Chat API Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to get response from AI';
    return {
      success: false,
      message: errorMessage,
      metadata: { error: true },
    };
  }
};

/**
 * Get wellness tips from AI based on a category
 * @param {string} category - wellness category (mental_health, academic, etc)
 * @returns {Promise<Object>}
 */
export const getWellnessTips = async (category) => {
  try {
    const response = await api.post('/api/v1/chat', {
      message: `Give me 3 practical wellness tips about ${category}`,
      context: 'student_wellness',
    });

    return {
      success: true,
      tips: response.data.data?.message || response.data.message,
      metadata: response.data.data?.metadata || {},
    };
  } catch (error) {
    console.error('Wellness Tips API Error:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Stream chat messages (for real-time typing effect)
 * Note: Standard axios doesn't support streaming well. This would need streaming endpoint.
 */
export const streamChatMessage = async (message, onChunk, conversationHistory = []) => {
  try {
    const response = await api.post('/api/v1/chat/stream', {
      message,
      conversation_history: conversationHistory,
      context: 'student_wellness',
    }, {
      responseType: 'text',
      onDownloadProgress: (progressEvent) => {
        const chunk = progressEvent.currentTarget.response;
        if (chunk) {
          onChunk(chunk);
        }
      }
    });

    return {
      success: true,
      message: response.data,
    };
  } catch (error) {
    console.error('Stream Chat Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
