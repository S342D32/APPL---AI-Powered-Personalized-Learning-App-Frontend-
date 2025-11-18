// File: MCQGenerator.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import QuizSetup from './Quiz/QuizSetup';
import QuizQuestion from './Quiz/QuizQuestion';
import QuizResults from './Quiz/QuizResults';
import BadgeSystem from './BadgeSystem';

const MCQGenerator = ({ user, isNightMode }) => {
  const [topic, setTopic] = useState('');
  const [subTopic, setSubTopic] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [retryMode, setRetryMode] = useState(false);
  const [score, setScore] = useState(0);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userScore, setUserScore] = useState(0);

  // Topics data
  const topics = {
    "Mathematics": ["Algebra", "Geometry", "Calculus", "Statistics"],
    "Science": ["Physics", "Chemistry", "Biology", "Earth Science"],
    "Programming": ["JavaScript", "Python", "Java", "React"],
    "History": ["World War I", "World War II", "Ancient Rome", "Medieval Period"]
  };

 

  
  const fetchMCQQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(API_ENDPOINTS.GENERATE_MCQ, {
        topic,
        subTopic,
        numberOfQuestions
      });

      if (response.data && response.data.questions) {
        setQuestions(response.data.questions);
        setSelectedAnswers(new Array(response.data.questions.length).fill(null));
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      let errorMessage = 'Failed to generate questions. Please try again.';

      if (error.response) {
        // Server responded with an error
        if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later or contact support.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to reach the server. Please check your connection.';
      }

      setError(errorMessage);
      console.error('Error fetching MCQ questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelection = (questionIndex, selectedOption) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = selectedOption;
    setSelectedAnswers(newSelectedAnswers);
  };

  const calculateScore = async () => {
    const correctAnswers = questions.map(q => q.correctAnswer);
    const userScore = selectedAnswers.reduce((acc, answer, index) =>
      answer === correctAnswers[index] ? acc + 1 : acc, 0);
    setScore(userScore);
    setShowResults(true);

    // Create a quiz attempt object with detailed question data
    const quizAttempt = {
      userId: user?.user?.id || 'anonymous',
      topic,
      subTopic,
      questions: questions.map((question, index) => ({
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        userAnswer: selectedAnswers[index],
        isCorrect: selectedAnswers[index] === question.correctAnswer
      })),
      score: userScore,
      totalQuestions: questions.length,
      difficulty: 'medium'
    };

    // Only save if user is authenticated
    if (user?.user?.id) {
      try {
        // Save quiz attempt to MongoDB
        const response = await axios.post(API_ENDPOINTS.SAVE_QUIZ_ATTEMPT, quizAttempt);
        console.log('Quiz attempt saved successfully:', response.data);
      } catch (error) {
        console.error('Error saving quiz attempt:', error);
        // Continue showing results even if saving fails
      }
    } else {
      console.log('User not authenticated, quiz not saved');
    }
  };





  const resetQuiz = () => {
    setTopic('');
    setSubTopic('');
    setQuestions([]);
    setSelectedAnswers([]);
    setShowResults(false);
    setRetryMode(false);
    setScore(0);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      {!questions.length ? (
        <>
          <QuizSetup
            userName={userName}
            setUserName={setUserName}
            topic={topic}
            setTopic={setTopic}
            subTopic={subTopic}
            setSubTopic={setSubTopic}
            numberOfQuestions={numberOfQuestions}
            setNumberOfQuestions={setNumberOfQuestions}
            fetchMCQQuestions={fetchMCQQuestions}
            isLoading={isLoading}
            error={error}
            topics={topics}
            isNightMode={isNightMode}
          />
          <div className="mt-8">
            {BadgeSystem()}
          </div>
        </>
      ) : !showResults ? (
        <QuizQuestion
          currentQuestionIndex={currentQuestionIndex}
          questions={questions}
          selectedAnswers={selectedAnswers}
          handleAnswerSelection={handleAnswerSelection}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          calculateScore={calculateScore}
        />
      ) : (
        <QuizResults
          userName={user?.name || userName}
          score={score}
          questions={questions}
          selectedAnswers={selectedAnswers}
          resetQuiz={resetQuiz}
          
        />
      )}
    </div>
  );
};

export default MCQGenerator;