// Centralized API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Base URL
  BASE_URL: API_BASE_URL,
  
  // Auth endpoints
  SYNC_USER: `${API_BASE_URL}/api/sync-user`,
  
  // Quiz endpoints
  GENERATE_MCQ: `${API_BASE_URL}/api/generate-mcq`,
  SAVE_QUIZ_ATTEMPT: `${API_BASE_URL}/api/save-quiz-attempt`,
  QUIZ_ATTEMPTS: (userId) => `${API_BASE_URL}/api/quiz-attempts/${userId}`,
  
  // AI endpoints
  PROCESS_PDF: `${API_BASE_URL}/api/process-pdf`,
  SUMMARIZE: `${API_BASE_URL}/api/summarize`,
  CHAT: `${API_BASE_URL}/api/chat`,
  
  // User endpoints
  USER_PROFILE: `${API_BASE_URL}/api/user/profile`,
  USER_STATS: `${API_BASE_URL}/api/user/stats`,
  USER_FEEDBACK: `${API_BASE_URL}/api/user/feedback`,
  USER_QUIZ_HISTORY: `${API_BASE_URL}/api/user/quiz-history`,
};

export default API_BASE_URL;