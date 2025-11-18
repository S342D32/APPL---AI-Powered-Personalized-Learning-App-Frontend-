import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';

const ProtectedRoute = ({ children }) => {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded } = useUser();
  const location = useLocation();
  
  // Wait for both auth and user data to load
  const isFullyLoaded = authLoaded && userLoaded;
  
  if (!isFullyLoaded) {
    // Show loading indicator while Clerk loads
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-blue-500">Loading authentication...</p>
      </div>
    );
  }
  
  if (!isSignedIn) {
    // Redirect to login page if not signed in, preserving the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute; 