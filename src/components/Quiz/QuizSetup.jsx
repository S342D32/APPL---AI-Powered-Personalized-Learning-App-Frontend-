import React from 'react';

const QuizSetup = ({
  userName,
  setUserName,
  topic,
  setTopic,
  subTopic,
  setSubTopic,
  numberOfQuestions,
  setNumberOfQuestions,
  fetchMCQQuestions,
  isLoading,
  error,
  topics,
  isNightMode,
  badges // Add this prop to receive badge data or any other relevant information.
}) => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl sm:text-2xl mb-4 font-semibold">MCQ Quiz</h2>
      <div className="space-y-4">
        {/* Your Name Input (Currently commented out) */}
        {/* 
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className={`w-full p-2 border rounded-lg focus:ring-2 ${isNightMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'} focus:border-blue-500`}
            placeholder="Enter your name"
            required
          />
        </div> 
        */}
        <div>
          <label className="block text-sm font-medium mb-1">Select Topic:</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={`w-full p-2 border rounded-lg focus:ring-2 ${isNightMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'} focus:border-blue-500`}
          >
            <option value="" disabled>Select Topic</option>
            {Object.keys(topics).map(t => (
              <option
                key={t}
                value={t}
                className={isNightMode ? 'bg-black text-white' : ''}
              >
                {t}
              </option>
            ))}
          </select>
        </div>
        {topic && (
          <div>
            <label className="block text-sm font-medium mb-1">Select Subtopic:</label>
            <select
              value={subTopic}
              onChange={(e) => setSubTopic(e.target.value)}
              className={`w-full p-2 border rounded-lg focus:ring-2 ${isNightMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'} focus:border-blue-500`}
            >
              <option value="">Select Subtopic</option>
              {topics[topic].map(st => (
                <option
                  key={st}
                  value={st}
                  className={isNightMode ? 'bg-black text-white' : ''}
                >
                  {st}
                </option>
              ))}
            </select>
          </div>
        )}
        {subTopic && (
          <div>
            <label className="block text-sm font-medium mb-1">Number of Questions:</label>
            <input
              type="number"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
              min="1"
              max="20"
              className={`w-full p-2 border rounded-lg focus:ring-2 ${isNightMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'} focus:border-blue-500`}
            />
          </div>
        )}
        {subTopic && (
          <div>
            <button
              onClick={fetchMCQQuestions}
              disabled={isLoading}
              className={`w-full ${
                isLoading ? 'bg-gray-400' : isNightMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-500 hover:bg-blue-600'
              } text-white p-3 rounded-lg transition duration-200 text-sm sm:text-base`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Questions...
                </div>
              ) : (
                'Generate Quiz'
              )}
            </button>
            {error && (
              <p className="mt-2 text-red-500 text-sm">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSetup;
