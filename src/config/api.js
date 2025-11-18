// Centralized API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
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
};

export default API_BASE_URL;