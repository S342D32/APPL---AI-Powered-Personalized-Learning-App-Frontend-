import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Menu, 
  FileText, 
  Upload, 
  MessageSquare, 
  BarChart2,
  Home,
  BookOpen,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  Library
} from 'lucide-react';
import UserService from '../services/api'; // Import the API service
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { 
  useAuth, 
  useUser, 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  UserButton 
} from "@clerk/clerk-react";

// Import new components
import UploadPDF from './UploadPDF';
import Analytics from './Analytics';
import EnhancedSummarizeText from './SummarizeText';
import HelpSupport from './HelpSupport';
import MCQGenerator from './MCQGenerator';
import ErrorBoundary from './ErrorBoundary';
import HomeComponent from './Home'; // Import the new Home component

// Mobile-friendly button with larger touch targets
const SidebarButton = ({ icon, children, onClick, isActive, isNightMode, isCollapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-4 md:p-3 rounded-md transition-colors min-h-[48px] ${
      isActive 
        ? 'bg-blue-900 text-blue-200' 
        : isNightMode 
          ? 'text-gray-300 hover:bg-gray-700' 
          : 'text-gray-700 hover:bg-gray-100'
    }`}
    title={isCollapsed ? children : ''}
  >
    {icon}
    <span className={`ml-3 ${isCollapsed ? 'hidden' : 'block'}`}>{children}</span>
  </button>
);

const Dashboard = () => {
  // Initialize state variables - sidebar open on desktop, closed on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeComponent, setActiveComponent] = useState('home');
  const [userStats, setUserStats] = useState({
    testsAttempted: 0,
    averageScore: 0,
    totalQuestionsAnswered: 0,
    correctAnswers: 0,
    recentTests: [],
    topicPerformance: []
  });
  const [isNightMode, setIsNightMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
 
  
  // Get navigation
  const navigate = useNavigate();

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true); // Always open on desktop
      } else {
        setIsSidebarOpen(false); // Closed by default on mobile
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Try to get Clerk auth - with error handling
  let auth = null;
  let user = null;
  let isLoaded = false;
  
  try {
    // Use optional chaining to gracefully handle missing Clerk context
    auth = useAuth?.();
    user = useUser?.();
    isLoaded = auth?.isLoaded && user?.isLoaded;
  } catch (e) {
    console.log("Clerk not available:", e.message);
  }

  // Sync user with backend when Clerk user is loaded
  useEffect(() => {
    const syncUser = async () => {
      if (user?.user && isLoaded) {
        try {
          const response = await axios.post(API_ENDPOINTS.SYNC_USER, {
            clerkId: user.user.id,
            email: user.user.primaryEmailAddress?.emailAddress,
            name: user.user.fullName || user.user.firstName || 'User',
            profileImage: user.user.imageUrl
          });
          console.log('User synced:', response.data);
        } catch (error) {
          console.error('Failed to sync user:', error);
        }
      }
    };
    
    syncUser();
  }, [user?.user, isLoaded]);
  
  // Toggle night mode
  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
    localStorage.setItem('nightMode', JSON.stringify(!isNightMode));
  };

  // Handle user logout
  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      
      // Try to use Clerk signOut if available but don't redirect
      if (auth?.signOut) {
        auth.signOut({ redirectUrl: window.location.href });
      }
      
      // Update state to show sign-in button, stay on dashboar
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoggedIn(false);
    }
  };
  
  // Menu items
  const menuItems = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'mcq', label: 'MCQ Generator', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'summarize', label: 'Summarize Text', icon: <FileText className="w-5 h-5" /> },
    { id: 'upload', label: 'Upload PDF', icon: <Upload className="w-5 h-5" /> },
    { id: 'chatbot', label: 'Agentic AI', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> }
  ];

  return (
    <div className={`min-h-screen ${isNightMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} flex relative`}>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Left Sidebar - Responsive */}
      <div className={`${
        isMobile 
          ? (isSidebarOpen ? 'w-64' : 'w-0') 
          : (isSidebarOpen ? 'w-64' : 'w-20')
      } ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 ${
        isMobile ? 'fixed' : 'relative'
      } z-50 h-screen overflow-hidden`}>
        <div className="p-4 flex justify-between items-center">
          <h2 className={`font-bold text-xl font-serif ${!isSidebarOpen && isMobile ? 'hidden' : !isSidebarOpen ? 'hidden' : 'block'} ${isNightMode ? 'text-white' : 'text-black'}`}>SIGMA LEARN</h2>
          <button 
            onClick={() => {
              if (isMobile) {
                setIsSidebarOpen(!isSidebarOpen);
              } else {
                setIsSidebarOpen(!isSidebarOpen);
              }
            }}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Menu className={`w-6 h-6 ${isNightMode ? 'text-white' : 'text-black'}`} />
          </button>
        </div>
        
        {/* Main Navigation - Changes based on night mode */}
        <div className={`p-4 rounded-lg ${isNightMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <SidebarButton
                key={item.id}
                icon={item.icon}
                onClick={() => {
                  setActiveComponent(item.id);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                isActive={activeComponent === item.id}
                isNightMode={isNightMode}
                isCollapsed={!isSidebarOpen && !isMobile}
              >
                {item.label}
              </SidebarButton>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden min-h-screen">
        <header className={`${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden p-2 rounded-md mr-3"
                >
                  <Menu className={`w-6 h-6 ${isNightMode ? 'text-white' : 'text-black'}`} />
                </button>
                <h1 className={`text-xl md:text-2xl font-bold ${isNightMode ? 'text-white' : 'text-gray-900'}`}>
                  {menuItems.find(item => item.id === activeComponent)?.label}
                </h1>
              </div>
              <div className="flex items-center">
                {/* Night mode toggle - mobile friendly */}
                <button
                  onClick={toggleNightMode}
                  className={`flex items-center px-3 md:px-8 py-2 rounded-md min-h-[44px] ${isNightMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  {isNightMode ? <Sun className="w-4 h-4 md:mr-2" /> : <Moon className="w-4 h-4 md:mr-2" />}
                  <span className="hidden md:inline">{isNightMode ? 'Day Mode' : 'Night Mode'}</span>
                </button>
                
                {/* Auth section - mobile spacing */}
                <div className="ml-2 md:ml-8 flex items-center">
                  <SignedOut>
                    <SignInButton mode="modal" afterSignInUrl="/dashboard">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium">
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                  
                  <SignedIn>
                    <div className="flex items-center space-x-4">
                      <UserButton 
                        userProfileMode="modal"
                        appearance={{
                          elements: {
                            userButtonAvatarBox: {
                              width: '2rem',
                              height: '2rem'
                            }
                          }
                        }}
                      />
                    </div>
                  </SignedIn>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          {activeComponent === 'home' && <HomeComponent isNightMode={isNightMode} onNavigate={setActiveComponent} />}
          {activeComponent === 'mcq' && <MCQGenerator isNightMode={isNightMode} user={user} />}
          {activeComponent === 'upload' && <UploadPDF isNightMode={isNightMode} />}
          {activeComponent === 'summarize' && <EnhancedSummarizeText isNightMode={isNightMode} />}
          {activeComponent === 'chatbot' && <HelpSupport isNightMode={isNightMode} />}
          {activeComponent === 'analytics' && 
            <SignedIn>
              <ErrorBoundary>
                <Analytics 
                  isNightMode={isNightMode}
                  userId={user?.user?.id}
                />
              </ErrorBoundary>
            </SignedIn>
          }
          {activeComponent === 'analytics' && 
            <SignedOut>
              <div className={`text-center py-12 ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <BarChart2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Sign In Required</h3>
                <p className="mb-4">Please sign in to view your analytics and progress.</p>
                <SignInButton mode="modal" afterSignInUrl="/dashboard">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 font-medium">
                    Sign In to View Analytics
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
          }
        </main>
      </div>
    </div>
  );
};

export default Dashboard;