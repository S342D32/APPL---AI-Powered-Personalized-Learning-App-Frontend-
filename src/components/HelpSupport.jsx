import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Globe, Mic, MicOff, Volume2, Sparkles, Brain, Book, Gamepad, Heart, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  { id: 'homework', name: 'Homework Help', icon: <Book className="w-4 h-4" />, color: 'bg-blue-500' },
  { id: 'mental', name: 'Mental Health', icon: <Heart className="w-4 h-4" />, color: 'bg-pink-500' },
  { id: 'games', name: 'Word Games', icon: <Gamepad className="w-4 h-4" />, color: 'bg-purple-500' },
  { id: 'general', name: 'General Chat', icon: <MessageSquare className="w-4 h-4" />, color: 'bg-green-500' }
];

const suggestions = {
  homework: [
    "Can you help me understand photosynthesis?",
    "I'm stuck on this math problem: 3x + 5 = 17",
    "How do I write a persuasive essay?"
  ],
  mental: [
    "I'm feeling stressed about exams",
    "How can I improve my focus while studying?",
    "Tips for balancing school and social life"
  ],
  games: [
    "Let's play hangman",
    "Can we do a word association game?",
    "Tell me a riddle to solve"
  ],
  general: [
    "Tell me something interesting about space",
    "What books would you recommend for a 10th grader?",
    "How can AI help with education?"
  ]
};

const HelpSupport = ({ isNightMode }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeCategory, setActiveCategory] = useState('general');
  const [isListening, setIsListening] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [speechInput, setSpeechInput] = useState('');
  const [showClearButton, setShowClearButton] = useState(false);
  
  const chatEndRef = useRef(null);
  const recognition = useRef(null);
  
  // Initialize welcome message and speech recognition
  useEffect(() => {
    // Add initial greeting if chatHistory is empty
    if (chatHistory.length === 0) {
      const greetings = [
        "Hi there! I'm your Learning Buddy. What can I help you with today?",
        "Hello! Ready to learn something new? I'm here to help!",
        "Welcome! I'm your AI study partner. What would you like to explore?",
        "Hey there! Need help with homework, mental wellness, or just want to play a game? I'm here!"
      ];
      
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      
      setChatHistory([{
        type: 'assistant',
        content: randomGreeting,
        timestamp: new Date().toISOString()
      }]);
    }
    
    // Set up speech recognition
    initSpeechRecognition();
    
    // Scroll to bottom when chat history changes
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Show clear button if there are messages
    setShowClearButton(chatHistory.length > 1);
  }, [chatHistory]);
  
  // Initialize speech recognition
  const initSpeechRecognition = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        
        recognition.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          setSpeechInput(transcript);
          setQuery(transcript);
        };
        
        recognition.current.onend = () => {
          // Only submit if we didn't manually stop
          if (isListening && speechInput.trim()) {
            handleSubmitWithSpeech();
          }
          setIsListening(false);
        };
        
        recognition.current.onerror = () => {
          setIsListening(false);
        };
      }
    } catch (error) {
      console.error('Speech recognition not supported');
    }
  };
  
  // Toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      recognition.current?.stop();
      setIsListening(false);
    } else {
      setSpeechInput('');
      recognition.current?.start();
      setIsListening(true);
    }
  };
  
  // Speak response aloud (only when explicitly requested)
  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech first
      window.speechSynthesis.cancel();
      
      // Create and play new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };
  
  // Clear chat history and reset
  const clearChat = () => {
    setChatHistory([]);
    setInteractionCount(0);
  };
  
  // Handle speech input submission
  const handleSubmitWithSpeech = () => {
    // Only process if there is speech input and recognition has ended
    if (speechInput.trim() && !isListening) {
      const inputToSubmit = speechInput.trim();
      setSpeechInput('');
      handleSubmitQuery(inputToSubmit);
    }
  };
  
  // Handle query submission (both text and speech)
  const handleSubmitQuery = async (speechText) => {
    const inputText = speechText || query;
    if (!inputText.trim()) return;
    
    // Add user message to chat history
    const userMessage = {
      type: 'user',
      content: inputText,
      timestamp: new Date().toISOString()
    };
    
    // Update chat history with user message
    setChatHistory(prev => [...prev, userMessage]);
    
    setInteractionCount(prev => prev + 1);
    setLoading(true);
    setQuery('');
    
    try {
      // Call Gemini API with interaction count for variety
      let response = await callGeminiAPI(inputText, activeCategory, interactionCount);
      
      // Add response to chat
      setChatHistory(prev => [...prev, {
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        category: activeCategory
      }]);
      
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Use the error message from callGeminiAPI
      setChatHistory(prev => [...prev, {
        type: 'assistant',
        content: error.message || "I'm having trouble connecting right now. Could you try again?",
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle suggestion click - just fill the input field, don't auto-submit
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    // Focus the input field after setting the suggestion
    document.querySelector('input[type="text"]').focus();
  };
  
  // Call Gemini API with enhanced context for more natural responses
  const callGeminiAPI = async (text, category, interactionCount) => {
    // Create a more dynamic prompt based on interaction count
    let contextPrompt = "";
    
    // Add variety based on interaction count but keep responses natural
    const tones = ["conversational", "natural", "friendly", "casual", "thoughtful"];
    const selectedTone = tones[interactionCount % tones.length];
    
    switch(category) {
      case 'homework':
        contextPrompt = `You are having a natural conversation with a student who needs help with homework. 
        Respond in a ${selectedTone}, helpful way like a real tutor would. Avoid sounding robotic or templated.`;
        break;
      case 'mental':
        contextPrompt = `You're having a supportive conversation with a student about mental wellbeing. 
        Be ${selectedTone} and genuine, as if you're a real person having a chat. Show empathy and understanding.`;
        break;
      case 'games':
        contextPrompt = `You're playing a word game with a friend. Keep the conversation ${selectedTone} and playful.
        Respond like a real person would in a casual game, with natural language and occasional humor.`;
        break;
      default:
        contextPrompt = `This is a natural, flowing conversation between friends. Respond in a ${selectedTone}, 
        casual way without sounding like an AI. Use conversational language, contractions, and a natural speaking style.`;
    }
    
    try {
      console.log(`Sending request to Gemini API for category: ${category}`);
      
      // Call to backend API that connects to Gemini
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: text,
        context: contextPrompt,
        category,
        interactionCount
      });
      
      if (!response.data || !response.data.response) {
        console.error('Empty response from API:', response);
        throw new Error('Received empty response from server');
      }
      
      return response.data.response;
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // More detailed error handling
      let errorMessage = "I'm having trouble connecting right now. Could you try again?";
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        if (error.response.status === 500) {
          errorMessage = "There's an issue with the server. Please check if the backend is running correctly.";
        } else if (error.response.data && error.response.data.details) {
          errorMessage = `Error: ${error.response.data.details}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        errorMessage = "Couldn't reach the server. Please check your connection and make sure the backend is running.";
      }
      
      throw new Error(errorMessage);
    }
  };
  
  return (
    <div className={`flex flex-col h-full ${isNightMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      {/* Category selection */}
      <div className={`p-3 border-b ${isNightMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${activeCategory === category.id 
                  ? `${category.color} text-white` 
                  : isNightMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
            >
              <span className="mr-1.5">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chat area */}
      <div className={`flex-1 overflow-y-auto p-4 ${isNightMode ? 'bg-gray-800' : 'bg-gray-50'}`} 
        style={{ backgroundImage: isNightMode 
          ? 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%232d3748" fill-opacity="0.05" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")' 
          : 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000000" fill-opacity="0.03" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")'
        }}>
        <div className="space-y-4 max-w-3xl mx-auto">
          {chatHistory.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user' 
                    ? isNightMode ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white' 
                    : message.isError
                      ? isNightMode ? 'bg-red-800 text-white' : 'bg-red-100 text-red-800'
                      : isNightMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                }`}
                style={{
                  borderRadius: message.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  
                  {message.type === 'assistant' && (
                    <button 
                      onClick={() => speakResponse(message.content)}
                      className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                      aria-label="Speak response"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className={`rounded-lg p-3 ${isNightMode ? 'bg-gray-700' : 'bg-white'}`}>
                <div className="flex space-x-1.5">
                  <div className={`w-2 h-2 rounded-full ${isNightMode ? 'bg-gray-500' : 'bg-gray-300'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                  <div className={`w-2 h-2 rounded-full ${isNightMode ? 'bg-gray-500' : 'bg-gray-300'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                  <div className={`w-2 h-2 rounded-full ${isNightMode ? 'bg-gray-500' : 'bg-gray-300'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </div>
      
      {/* Suggestions */}
      <div className={`p-2 ${isNightMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'}`}>
        <div className="flex flex-wrap gap-2 mb-2 justify-center">
          {suggestions[activeCategory].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                isNightMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Sparkles className="w-3 h-3 inline mr-1" />
              {suggestion}
            </button>
          ))}
        </div>
      </div>
      
      {/* Input area */}
      <div className={`p-3 ${isNightMode ? 'bg-gray-900 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
        <div className="flex items-center space-x-2 max-w-3xl mx-auto">
          <button
            onClick={toggleListening}
            className={`p-2 rounded-full transition-colors ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : isNightMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitQuery()}
              placeholder={isListening ? "Listening... Click mic to stop" : "Type your message..."}
              disabled={isListening}
              className={`w-full py-2 px-4 rounded-full outline-none transition-colors ${
                isListening
                  ? isNightMode 
                    ? 'bg-gray-700 text-gray-300 border border-red-500' 
                    : 'bg-gray-100 text-gray-700 border border-red-500'
                  : isNightMode 
                    ? 'bg-gray-800 text-white border border-gray-700 focus:border-blue-500' 
                    : 'bg-gray-100 text-gray-900 border border-gray-300 focus:border-blue-500'
              }`}
            />
            
            {showClearButton && (
              <button
                onClick={clearChat}
                className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                  isNightMode 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Clear chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <button
            onClick={() => handleSubmitQuery()}
            disabled={!query.trim() && !isListening}
            className={`p-2 rounded-full transition-colors ${
              !query.trim() && !isListening
                ? isNightMode 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isNightMode 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className={`text-xs mt-1 text-center ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {isListening ? 'Click the microphone again to stop listening' : 'Click the microphone to use voice input'}
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;