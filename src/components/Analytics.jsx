import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const Analytics = ({ userId, isNightMode }) => {
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [filter, setFilter] = useState({
    topic: '',
    subTopic: ''
  });
  const [topics, setTopics] = useState([]);
  const [subTopics, setSubTopics] = useState([]);
  const navigate = useNavigate();

  // Fetch quiz attempts when component mounts or filter changes
  useEffect(() => {
    fetchQuizAttempts();
  }, [filter]);

  // Extract unique topics and subtopics for filtering
  useEffect(() => {
    if (quizAttempts.length) {
      const uniqueTopics = [...new Set(quizAttempts.map(attempt => attempt.topic))];
      setTopics(uniqueTopics);
      
      // If a topic is selected, get its subtopics
      if (filter.topic) {
        const topicAttempts = quizAttempts.filter(attempt => attempt.topic === filter.topic);
        const uniqueSubTopics = [...new Set(topicAttempts.map(attempt => attempt.subTopic))];
        setSubTopics(uniqueSubTopics);
      } else {
        setSubTopics([]);
      }
    }
  }, [quizAttempts, filter.topic]);

  const fetchQuizAttempts = async () => {
    setIsLoading(true);
    setAuthError(false);
    try {
      if (!userId) {
        setError('User not authenticated');
        return;
      }

      const response = await axios.get(API_ENDPOINTS.QUIZ_ATTEMPTS(userId));
      setQuizAttempts(response.data.quizAttempts || []);
      
      // Update stats if provided
      if (response.data.statistics) {
        // Statistics are now calculated on the backend
      }
    } catch (err) {
      console.error('Error fetching quiz attempts:', err);
      
      // Check if it's an authentication error
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setAuthError(true);
        setError('Authentication required. Please log in to view your quiz attempts.');
      } else {
        setError('Failed to load quiz data. Please try again later.');
      }
      
      // Set empty quiz attempts to avoid showing stale data
      setQuizAttempts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAttempt = async (attemptId) => {
    if (window.confirm('Are you sure you want to delete this quiz attempt? This action cannot be undone.')) {
      try {
        // Get token if available
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        await axios.delete(`http://localhost:5000/api/quiz-attempts/${attemptId}`, { headers });
        // Remove the deleted attempt from state
        setQuizAttempts(quizAttempts.filter(attempt => attempt._id !== attemptId));
      } catch (err) {
        console.error('Error deleting quiz attempt:', err);
        
        // Check if it's an authentication error
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setAuthError(true);
          setError('Authentication required. Please log in to delete quiz attempts.');
        } else {
          setError('Failed to delete quiz attempt. Please try again.');
        }
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => {
      // If topic changes, reset subTopic
      if (name === 'topic') {
        return { ...prev, [name]: value, subTopic: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const resetFilters = () => {
    setFilter({ topic: '', subTopic: '' });
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Calculate statistics
  const calculateStats = () => {
    if (!quizAttempts.length) return null;
    
    const totalAttempts = quizAttempts.length;
    const totalQuestions = quizAttempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
    const totalCorrect = quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const averageScore = totalQuestions > 0 ? (totalCorrect / totalQuestions * 100) : 0;
    
    return {
      totalAttempts,
      totalQuestions,
      totalCorrect,
      averageScore: averageScore.toFixed(2)
    };
  };

  const stats = calculateStats();

  return (
    <div className={`container mx-auto p-4 max-w-6xl ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
      <div className={`mb-8 ${isNightMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <h1 className="text-2xl font-bold mb-4">Quiz Analytics</h1>
        
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`${isNightMode ? 'bg-blue-900' : 'bg-blue-50'} p-4 rounded-lg text-center`}>
              <p className={`${isNightMode ? 'text-blue-300' : 'text-gray-600'}`}>Total Attempts</p>
              <p className="text-2xl font-bold">{stats.totalAttempts}</p>
            </div>
            <div className={`${isNightMode ? 'bg-green-900' : 'bg-green-50'} p-4 rounded-lg text-center`}>
              <p className={`${isNightMode ? 'text-green-300' : 'text-gray-600'}`}>Questions Answered</p>
              <p className="text-2xl font-bold">{stats.totalQuestions}</p>
            </div>
            <div className={`${isNightMode ? 'bg-yellow-900' : 'bg-yellow-50'} p-4 rounded-lg text-center`}>
              <p className={`${isNightMode ? 'text-yellow-300' : 'text-gray-600'}`}>Correct Answers</p>
              <p className="text-2xl font-bold">{stats.totalCorrect}</p>
            </div>
            <div className={`${isNightMode ? 'bg-purple-900' : 'bg-purple-50'} p-4 rounded-lg text-center`}>
              <p className={`${isNightMode ? 'text-purple-300' : 'text-gray-600'}`}>Average Score</p>
              <p className="text-2xl font-bold">{stats.averageScore}%</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className={`block text-sm font-medium ${isNightMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Topic</label>
            <select
              name="topic"
              value={filter.topic}
              onChange={handleFilterChange}
              className={`w-full rounded-md ${
                isNightMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'border-gray-300 focus:border-indigo-500'
              } shadow-sm focus:ring-1 focus:ring-opacity-50 ${
                isNightMode ? 'focus:ring-blue-500' : 'focus:ring-indigo-500'
              }`}
            >
              <option value="">All Topics</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className={`block text-sm font-medium ${isNightMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Subtopic</label>
            <select
              name="subTopic"
              value={filter.subTopic}
              onChange={handleFilterChange}
              className={`w-full rounded-md ${
                isNightMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'border-gray-300 focus:border-indigo-500'
              } shadow-sm focus:ring-1 focus:ring-opacity-50 ${
                isNightMode ? 'focus:ring-blue-500' : 'focus:ring-indigo-500'
              }`}
              disabled={!filter.topic}
            >
              <option value="">All Subtopics</option>
              {subTopics.map(subTopic => (
                <option key={subTopic} value={subTopic}>{subTopic}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className={`px-4 py-2 ${
                isNightMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } rounded-md transition-colors`}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className={`text-center py-10 ${isNightMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="mt-2">Loading quiz data...</p>
        </div>
      ) : authError ? (
        <div className={`text-center py-10 ${isNightMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
          <p className={`${isNightMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            You need to be logged in to view your quiz attempts.
          </p>
          <button
            onClick={handleLogin}
            className={`px-4 py-2 ${
              isNightMode 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white rounded-md transition-colors`}
          >
            Log In
          </button>
        </div>
      ) : error ? (
        <div className={`${isNightMode ? 'bg-red-900 border-red-800 text-red-300' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-3 rounded border`} role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : quizAttempts.length === 0 ? (
        <div className={`text-center py-10 ${isNightMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
          <p className={isNightMode ? 'text-gray-400' : 'text-gray-500'}>No quiz attempts found. Take some quizzes to see your analytics!</p>
        </div>
      ) : (
        <div className={`${isNightMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${isNightMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={isNightMode ? 'bg-gray-900' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isNightMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Date</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isNightMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Topic</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isNightMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Subtopic</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isNightMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Score</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isNightMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Questions</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isNightMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`${isNightMode ? 'bg-gray-800' : 'bg-white'} divide-y ${isNightMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {quizAttempts.map((attempt) => (
                  <tr key={attempt._id} className={isNightMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(attempt.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {attempt.topic}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {attempt.subTopic}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${attempt.score / attempt.totalQuestions >= 0.7 
                          ? isNightMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800' 
                          : attempt.score / attempt.totalQuestions >= 0.4 
                            ? isNightMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800' 
                            : isNightMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'}`}>
                        {attempt.score} / {attempt.totalQuestions} ({Math.round(attempt.score / attempt.totalQuestions * 100)}%)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {attempt.totalQuestions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteAttempt(attempt._id)}
                        className={isNightMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;