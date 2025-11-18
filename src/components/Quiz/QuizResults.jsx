import React from 'react';
import Badge from './Badge';

const QuizResults = ({ userName, score, questions, selectedAnswers, resetQuiz, isNightMode }) => {
  return (
    <div className={`w-full px-4 rounded-lg sm:px-6 lg:px-8 ${isNightMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-xl sm:text-2xl mb-4 font-semibold text-center font-serif">Quiz Results</h2>

      <div className={`mb-6 ${isNightMode ? 'bg-gray-700' : ''}`}>
        <Badge score={score} totalQuestions={questions.length} isNightMode={isNightMode} />
      </div>
      <div className="space-y-4">
        {questions.map((question, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${selectedAnswers[index] === question.correctAnswer
              ? isNightMode ? 'bg-green-700 border-green-400' : 'bg-green-50 border-green-200'
              : isNightMode ? 'bg-red-700 border-red-400' : 'bg-red-50 border-red-200'}`}
          >
            <p className={`text-sm sm:text-base mb-2 ${isNightMode ? 'text-white' : 'text-black'}`}>{question.question}</p>
            <p className={`text-sm sm:text-base ${isNightMode ? 'text-white' : 'text-black'}`}>Your Answer: {selectedAnswers[index]}</p>
            <p className={`font-semibold text-sm sm:text-base ${isNightMode ? 'text-green-400' : 'text-green-600'}`}>
              Correct Answer: {question.correctAnswer}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        <button
          onClick={resetQuiz}
          className={`w-full p-3 rounded-lg text-sm sm:text-base ${isNightMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Start New Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
