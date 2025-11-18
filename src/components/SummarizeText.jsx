import React, { useState } from 'react';
import axios from 'axios';

const EnhancedSummarizeText = ({ isNightMode }) => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('summarize');
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError("Please enter some text to process");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/summarize', { text });

      if (response.data && response.data.summary) {
        setSummary(response.data.summary);
        setMode('summarize');
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      let errorMessage = 'Failed to summarize text. Please try again.';

      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later or contact support.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to reach the server. Please check your connection.';
      }

      setError(errorMessage);
      setShowOptions(true); // Show alternative options when API fails
      console.error('Error summarizing text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeText = () => {
    const words = text.split(/\s+/).filter(word => word);
    const characters = text.replace(/\s+/g, '').length;
    setWordCount(words.length);
    setCharacterCount(characters);
    setMode('analyze');
  };

  const extractKeywords = () => {
    // Implementation of keyword extraction logic
    // This is a placeholder and should be replaced with actual keyword extraction logic
    setSummary('Extracted keywords will be displayed here.');
    setMode('keywords');
  };

  const resetForm = () => {
    setText('');
    setSummary('');
    setWordCount(0);
    setCharacterCount(0);
    setMode('summarize');
    setShowOptions(false);
    setError(null);
  };

  return (
    <div className={`container mx-auto p-4 max-w-2xl rounded-xl shadow-md ${isNightMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl mb-4 font-semibold">Text Analysis Tool</h2>
      </div>
      
      <div className="mb-4">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError(null);
          }}
          className={`w-full p-3 border rounded-lg focus:ring-2 ${isNightMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} focus:border-blue-500`}
          placeholder="Paste your text here..."
          rows="8"
        ></textarea>
        <div className="text-right text-xs mt-1">
          Characters: {text.length}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleSummarize}
          disabled={isLoading}
          className={`flex-1 ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white p-3 rounded-lg transition duration-200 text-sm sm:text-base`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            'Summarize Text'
          )}
        </button>

        {showOptions && (
          <>
            <button
              onClick={analyzeText}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition duration-200 text-sm sm:text-base"
            >
              Analyze Stats
            </button>
            <button
              onClick={extractKeywords}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg transition duration-200 text-sm sm:text-base"
            >
              Extract Keywords
            </button>
          </>
        )}
      </div>

      {error && (
        <div className={`mt-2 p-3 border text-sm rounded-lg ${isNightMode ? 'bg-red-900 text-red-200 border-red-700' : 'bg-red-50 text-red-700 border-red-200'}`}>
          <p>{error}</p>
        </div>
      )}

      {summary && (
        <div className={`mt-4 p-4 rounded-lg shadow-sm border ${isNightMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-200'}`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">
              {mode === 'summarize' ? 'Summary' : 
               mode === 'analyze' ? 'Text Analysis' : 'Keyword Extraction'}
            </h3>
            <button 
              onClick={resetForm}
              className={`text-sm ${isNightMode ? 'text-gray-400 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Reset
            </button>
          </div>
          <div className="prose max-w-none">
            {mode === 'analyze' ? (
              <div>
                <p><span className="font-medium">Word count:</span> {wordCount}</p>
                <p><span className="font-medium">Character count:</span> {characterCount}</p>
                <p><span className="font-medium">Average word length:</span> {wordCount > 0 ? (characterCount / wordCount).toFixed(1) : 0} characters</p>
                <p><span className="font-medium">Estimated reading time:</span> {Math.max(1, Math.ceil(wordCount / 200))} minute(s)</p>
              </div>
            ) : (
              <p>{summary}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSummarizeText;
