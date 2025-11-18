import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

import Dashboard from "./components/Dashboard";
import "./App.css";

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    <p className="ml-3 text-blue-500">Loading...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      
        <Route path="/" element={<Dashboard />} />
        
        {/* Catch-all route for 404s */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold text-red-500">404</h1>
            <p className="text-xl mt-4">Page not found</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go Home
            </button>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
