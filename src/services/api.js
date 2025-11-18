// services/api.js
import axios from 'axios';

// Create an axios instance with default config
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// Add a request interceptor to include the auth token in all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User related API calls
const UserService = {
  // Get user profile
  getProfile: () => API.get('/user/profile'),
  
  // Update user profile
  updateProfile: (data) => API.put('/user/profile', data),
  
  // Upload profile picture
  uploadProfilePicture: (formData) => {
    return API.post('/user/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Get user stats
  getUserStats: () => API.get('/user/stats'),
  
  // Submit feedback
  submitFeedback: (data) => API.post('/user/feedback', data),
  
  // Get quiz history
  getQuizHistory: () => API.get('/user/quiz-history'),
  
  // Delete quiz attempt
  deleteQuizAttempt: (id) => API.delete(`/user/quiz-history/${id}`),
  
  // Change password
  changePassword: (data) => API.put('/user/change-password', data)
};

export default UserService;