import React from 'react';

const QuizQuestion = ({
  currentQuestionIndex,
  questions,
  selectedAnswers,
  handleAnswerSelection,
  setCurrentQuestionIndex,
  calculateScore,
  isNightMode
}) => {
  return (
    <div className={`w-full px-4 rounded-lg sm:px-6 lg:px-8 ${isNightMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-lg sm:text-xl mb-4 font-semibold">
        Question {currentQuestionIndex + 1} of {questions.length}
      </h2>
      <div className={`p-4 sm:p-6 rounded-lg shadow-md border ${isNightMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
        <p className="mb-4 text-base sm:text-lg font-medium">
          {questions[currentQuestionIndex].question}
        </p>
        <div className="space-y-2">
          {questions[currentQuestionIndex].options.map((option, optionIndex) => (
            <div
              key={optionIndex}
              onClick={() => handleAnswerSelection(currentQuestionIndex, option)}
              className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 text-sm sm:text-base ${selectedAnswers[currentQuestionIndex] === option
                ? isNightMode ? 'bg-blue-600 border-blue-800 text-blue-200' : 'bg-blue-100 border-blue-400 text-blue-700'
                : isNightMode ? 'hover:bg-gray-600 border-gray-500' : 'hover:bg-gray-50 border-gray-200'}`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        {currentQuestionIndex > 0 && (
          <button
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base ${isNightMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-500 text-white hover:bg-gray-600'}`}
          >
            Previous
          </button>
        )}
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            disabled={selectedAnswers[currentQuestionIndex] === null}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base ${selectedAnswers[currentQuestionIndex] === null
              ? 'opacity-50 cursor-not-allowed'
              : isNightMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={calculateScore}
            disabled={selectedAnswers[currentQuestionIndex] === null}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base ${selectedAnswers[currentQuestionIndex] === null
              ? 'opacity-50 cursor-not-allowed'
              : isNightMode ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;
