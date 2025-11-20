import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Loader2,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

const UploadPDF = ({ isNightMode }) => {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Add missing event handlers
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setQuestions([]);
      setUploadStatus(null);
      setError(null);
      setShowQuiz(false);
      setShowResults(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
    console.log(`Answer for question ${questionIndex + 1} set to: ${answer}`);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setUploadStatus("uploading");
    setProcessingProgress(10);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("numQuestions", numQuestions.toString());
    formData.append("difficulty", difficulty);

    // Track retry attempts
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1500; // 1.5 seconds

    const attemptUpload = async () => {
      try {
        const response = axios.post(API_ENDPOINTS.PROCESS_PDF, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProcessingProgress(Math.min(progress, 90));
          },
        });

        if (response.data && response.data.questions) {
          setQuestions(response.data.questions);
          setAnswers({});
          setUploadStatus("complete");
          setShowQuiz(true);
          console.log(
            "Successfully generated",
            response.data.questions.length,
            "questions"
          );
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error uploading PDF:", error);

        // Check if we should retry
        if (
          retryCount < maxRetries &&
          (error.code === "ERR_NETWORK" ||
            error.code === "ECONNABORTED" ||
            error.response?.status >= 500)
        ) {
          retryCount++;
          setError(
            `Connection error. Retrying (${retryCount}/${maxRetries})...`
          );

          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, retryDelay));

          // Try again
          return attemptUpload();
        }

        // Format a user-friendly error message
        let errorMessage = "Failed to process PDF file. ";

        if (error.code === "ERR_NETWORK") {
          errorMessage +=
            "Please check if the server is running at http://localhost:5000";
        } else if (error.code === "ECONNABORTED") {
          errorMessage += "Request timed out. The PDF might be too large.";
        } else if (error.response) {
          errorMessage +=
            error.response.data?.error ||
            `Server error: ${error.response.status}`;
        } else {
          errorMessage += error.message;
        }

        setError(errorMessage);
        setUploadStatus("error");
      }
    };

    // Start the upload process
    await attemptUpload();
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    // Check for unanswered questions
    const unansweredQuestionIndexes = [];
    questions.forEach((_, index) => {
      if (answers[index] === undefined) {
        unansweredQuestionIndexes.push(index + 1);
      }
    });

    if (unansweredQuestionIndexes.length > 0) {
      const questionText =
        unansweredQuestionIndexes.length === 1 ? "question" : "questions";
      setError(
        `Please answer ${questionText} ${unansweredQuestionIndexes.join(", ")}`
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Submitting answers:", answers);

      // Calculate score
      let correctCount = 0;
      const gradedQuestions = questions.map((question, index) => {
        const isCorrect = answers[index] === question.correctAnswer;
        if (isCorrect) {
          correctCount++;
        }
        return {
          ...question,
          userAnswer: answers[index],
          isCorrect,
        };
      });

      const calculatedScore = Math.round(
        (correctCount / questions.length) * 100
      );
      setScore(calculatedScore);
      setShowResults(true);
      setShowQuiz(false);

      // Create quiz attempt object
      const quizAttempt = {
        topic: "PDF Upload",
        subTopic: file ? file.name : "Unknown PDF",
        questions: gradedQuestions,
        score: correctCount,
        totalQuestions: questions.length,
        difficulty,
        pdfContent: file ? file.name : null,
      };

      // Get token if available
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Save quiz attempt to MongoDB
      const response = await axios.post(
        "http://localhost:5000/api/save-quiz-attempt",
        quizAttempt,
        { headers }
      );
      console.log("Quiz results saved successfully:", response.data);
    } catch (error) {
      console.error("Error submitting answers:", error);
      setError("Failed to submit answers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to go back to dashboard
  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div
      className={`container mx-auto p-4 max-w-4xl ${
        isNightMode ? "text-white" : "text-gray-800"
      }`}
    >
      {/* Back to Dashboard Button */}
      <div className="mb-4">
        <button
          onClick={goToDashboard}
          className={`flex items-center ${
            isNightMode
              ? "text-blue-300 hover:text-blue-200"
              : "text-blue-600 hover:text-blue-800"
          } transition-colors`}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </button>
      </div>

      <h2 className="text-xl sm:text-2xl mb-4 font-semibold">
        Upload PDF for Quiz Generation
      </h2>

      {/* Upload Form */}
      {!showQuiz && !showResults && (
        <div
          className={`${
            isNightMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <div className="mb-6">
            <p
              className={`${
                isNightMode ? "text-gray-300" : "text-gray-600"
              } mb-4`}
            >
              Upload a PDF document to automatically generate quiz questions
              using AI.
            </p>

            <div
              className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed 
                            ${
                              isNightMode
                                ? "border-gray-600 bg-gray-700 hover:bg-gray-600"
                                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                            } 
                            rounded-lg cursor-pointer transition-colors`}
            >
              <Upload
                className={`w-12 h-12 ${
                  isNightMode ? "text-gray-300" : "text-gray-400"
                } mb-3`}
              />
              <p
                className={`text-sm ${
                  isNightMode ? "text-gray-400" : "text-gray-500"
                } mb-2`}
              >
                Drag and drop your PDF here or click to browse
              </p>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
                className={`block w-full text-sm ${
                  isNightMode ? "text-gray-400" : "text-gray-500"
                }
                                    file:mr-4 file:py-2 file:px-4 file:rounded-md
                                    file:border-0 file:text-sm file:font-semibold
                                    ${
                                      isNightMode
                                        ? "file:bg-blue-900 file:text-blue-300 hover:file:bg-blue-800"
                                        : "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    }`}
              />
            </div>

            {/* File Display */}
            {file && (
              <div
                className={`mt-4 p-3 ${
                  isNightMode ? "bg-blue-900" : "bg-blue-50"
                } rounded-lg flex items-center`}
              >
                <FileText
                  className={`w-5 h-5 ${
                    isNightMode ? "text-blue-300" : "text-blue-600"
                  } mr-2`}
                />
                <span
                  className={`text-sm font-medium ${
                    isNightMode ? "text-blue-200" : "text-blue-800"
                  } truncate`}
                >
                  {file.name}
                </span>
                <span
                  className={`text-xs ${
                    isNightMode ? "text-gray-400" : "text-gray-500"
                  } ml-2`}
                >
                  ({Math.round(file.size / 1024)} KB)
                </span>
              </div>
            )}
          </div>

          {/* Question Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                className={`block text-sm font-medium ${
                  isNightMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Number of Questions
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className={`w-full p-2 border ${
                  isNightMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-white text-gray-900"
                } rounded-md`}
                disabled={isLoading}
              >
                {[3, 5, 10, 15].map((num) => (
                  <option key={num} value={num}>
                    {num} Questions
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${
                  isNightMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Difficulty Level
              </label>
              <div className="flex space-x-4 mt-2">
                {["easy", "medium", "hard"].map((level) => (
                  <label key={level} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      value={level}
                      checked={difficulty === level}
                      onChange={() => setDifficulty(level)}
                      className={`h-4 w-4 ${
                        isNightMode ? "text-blue-500" : "text-blue-600"
                      } focus:ring-blue-500`}
                      disabled={isLoading}
                    />
                    <span
                      className={`ml-2 capitalize ${
                        isNightMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleUpload}
            disabled={isLoading || !file}
            className={`w-full ${
              isLoading || !file
                ? isNightMode
                  ? "bg-gray-600"
                  : "bg-gray-400"
                : isNightMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white p-3 rounded-lg transition duration-200`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {uploadStatus === "uploading"
                  ? "Uploading..."
                  : "Generating Questions..."}
              </div>
            ) : (
              "Generate Quiz from PDF"
            )}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div
          className={`mt-4 p-4 ${
            isNightMode ? "bg-red-900" : "bg-red-50"
          } rounded-lg flex items-start`}
        >
          <AlertCircle
            className={`w-5 h-5 ${
              isNightMode ? "text-red-300" : "text-red-600"
            } mr-2 flex-shrink-0 mt-0.5`}
          />
          <div>
            <h3
              className={`text-sm font-medium ${
                isNightMode ? "text-red-200" : "text-red-800"
              }`}
            >
              Error
            </h3>
            <p
              className={`text-sm ${
                isNightMode ? "text-red-200" : "text-red-700"
              } mt-1`}
            >
              {error}
            </p>
            <p
              className={`text-sm ${
                isNightMode ? "text-red-200" : "text-red-700"
              } mt-2`}
            >
              Please check if the server is running and try again.
            </p>
          </div>
        </div>
      )}

      {/* Quiz Display */}
      {showQuiz && questions.length > 0 && (
        <div
          className={`${
            isNightMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md space-y-8`}
        >
          <div className="flex justify-between items-center">
            <h3
              className={`text-xl font-semibold ${
                isNightMode ? "text-white" : "text-gray-800"
              }`}
            >
              Quiz from {file.name}
            </h3>
            <span
              className={`px-3 py-1 ${
                isNightMode
                  ? "bg-blue-900 text-blue-200"
                  : "bg-blue-100 text-blue-800"
              } rounded-full text-sm font-medium`}
            >
              {difficulty} difficulty
            </span>
          </div>

          {questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className={`${
                isNightMode ? "bg-gray-700" : "bg-gray-50"
              } p-4 rounded-lg`}
            >
              <p
                className={`font-medium mb-3 ${
                  isNightMode ? "text-white" : "text-gray-800"
                }`}
              >
                {qIndex + 1}. {question.question}
              </p>

              <div className="ml-4 space-y-2">
                {question.options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className={`flex items-start cursor-pointer p-2 rounded-md
                                            ${
                                              answers[qIndex] === option
                                                ? isNightMode
                                                  ? "bg-blue-900"
                                                  : "bg-blue-50"
                                                : isNightMode
                                                ? "hover:bg-gray-600"
                                                : "hover:bg-gray-100"
                                            }`}
                  >
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      checked={answers[qIndex] === option}
                      onChange={() => handleAnswerChange(qIndex, option)}
                      className={`h-4 w-4 mt-1 ${
                        isNightMode ? "text-blue-500" : "text-blue-600"
                      }`}
                    />
                    <span
                      className={`ml-2 ${
                        isNightMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting
                ? isNightMode
                  ? "bg-green-600"
                  : "bg-green-400"
                : isNightMode
                ? "bg-green-700 hover:bg-green-800"
                : "bg-green-600 hover:bg-green-700"
            } text-white p-3 rounded-lg transition-colors`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </span>
            ) : (
              "Submit Answers"
            )}
          </button>
        </div>
      )}

      {/* Results Display */}
      {showResults && (
        <div
          className={`${
            isNightMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md space-y-6`}
        >
          <div
            className={`p-6 rounded-lg ${
              score >= 70
                ? isNightMode
                  ? "bg-green-900"
                  : "bg-green-50"
                : score >= 40
                ? isNightMode
                  ? "bg-yellow-900"
                  : "bg-yellow-50"
                : isNightMode
                ? "bg-red-900"
                : "bg-red-50"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-2 ${
                isNightMode ? "text-white" : "text-gray-800"
              }`}
            >
              Quiz Results
            </h3>
            <p
              className={`text-3xl font-bold mb-2 ${
                isNightMode ? "text-white" : "text-gray-800"
              }`}
            >
              {score}% Score
            </p>
            <p
              className={`text-sm ${
                isNightMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              You answered {Math.round((score / 100) * questions.length)} out of{" "}
              {questions.length} questions correctly.
            </p>
          </div>

          {/* Review Section */}
          <div className="space-y-8">
            <h3
              className={`text-xl font-semibold ${
                isNightMode ? "text-white" : "text-gray-800"
              }`}
            >
              Review Your Answers
            </h3>

            {questions.map((question, qIndex) => {
              const isCorrect = question.correctAnswer === answers[qIndex];

              return (
                <div
                  key={qIndex}
                  className={`p-4 rounded-lg border-l-4 ${
                    isCorrect
                      ? isNightMode
                        ? "bg-green-900 border-green-500"
                        : "bg-green-50 border-green-500"
                      : isNightMode
                      ? "bg-red-900 border-red-500"
                      : "bg-red-50 border-red-500"
                  }`}
                >
                  <p
                    className={`font-medium mb-3 ${
                      isNightMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {qIndex + 1}. {question.question}
                  </p>

                  <div className="ml-4 space-y-2">
                    {question.options.map((option, oIndex) => {
                      const isUserAnswer = answers[qIndex] === option;
                      const isCorrectAnswer = question.correctAnswer === option;

                      return (
                        <div
                          key={oIndex}
                          className={`p-2 rounded ${
                            isUserAnswer && isCorrectAnswer
                              ? isNightMode
                                ? "bg-green-800"
                                : "bg-green-100"
                              : isUserAnswer && !isCorrectAnswer
                              ? isNightMode
                                ? "bg-red-800"
                                : "bg-red-100"
                              : !isUserAnswer && isCorrectAnswer
                              ? isNightMode
                                ? "bg-green-800"
                                : "bg-green-100"
                              : ""
                          }`}
                        >
                          <span
                            className={`${
                              isCorrectAnswer ? "font-medium" : ""
                            } ${isNightMode ? "text-white" : "text-gray-800"}`}
                          >
                            {option}
                            {isUserAnswer && isCorrectAnswer && " ✓"}
                            {isUserAnswer && !isCorrectAnswer && " ✗"}
                            {!isUserAnswer &&
                              isCorrectAnswer &&
                              " (Correct Answer)"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setShowResults(false);
                setShowQuiz(false);
                setQuestions([]);
                setFile(null);
                setUploadStatus(null);
              }}
              className={`flex-1 ${
                isNightMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              } 
                                py-3 px-6 rounded-lg transition-colors`}
            >
              Upload New PDF
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className={`flex-1 ${
                isNightMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } 
                                text-white py-3 px-6 rounded-lg transition-colors`}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPDF;
