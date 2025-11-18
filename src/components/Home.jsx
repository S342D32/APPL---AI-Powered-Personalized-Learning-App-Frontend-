import React from 'react';
import { ArrowRight, Brain, FileQuestion, Upload, BarChart3, Clock, BookOpen, Zap } from 'lucide-react';

const Home = ({ isNightMode, onNavigate }) => {
  // Team members data
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'AI Engineer',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Sarah Chen',
      role: 'UX Designer',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Full Stack Developer',
      image: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    {
      name: 'Priya Patel',
      role: 'Data Scientist',
      image: 'https://randomuser.me/api/portraits/women/63.jpg'
    },
    {
      name: 'David Kim',
      role: 'Product Manager',
      image: 'https://randomuser.me/api/portraits/men/91.jpg'
    }
  ];

  // Features data
  const features = [
    {
      icon: <FileQuestion className={`w-10 h-10 ${isNightMode ? 'text-blue-400' : 'text-blue-600'}`} />,
      title: 'MCQ Generator',
      description: 'Instantly create multiple-choice questions for smarter learning.',
      id: 'mcq'
    },
    {
      icon: <Upload className={`w-10 h-10 ${isNightMode ? 'text-green-400' : 'text-green-600'}`} />,
      title: 'Upload PDF for Questions',
      description: 'Turn your documents into interactive exercises.',
      id: 'upload'
    },
    {
      icon: <Brain className={`w-10 h-10 ${isNightMode ? 'text-purple-400' : 'text-purple-600'}`} />,
      title: 'Agentic AI',
      description: 'Unleash AI that acts with purpose and adapts to your needs.',
      id: 'chatbot'
    },
    {
      icon: <BookOpen className={`w-10 h-10 ${isNightMode ? 'text-yellow-400' : 'text-yellow-600'}`} />,
      title: 'Summarization',
      description: 'Quickly condense lengthy texts into key takeaways.',
      id: 'summarize'
    },
    {
      icon: <BarChart3 className={`w-10 h-10 ${isNightMode ? 'text-red-400' : 'text-red-600'}`} />,
      title: 'Analytics',
      description: 'Visualize data and trends for smarter decisions.',
      id: 'analytics'
    }
  ];

  // How it works steps
  const steps = [
    {
      number: '01',
      title: 'Select a Feature',
      description: 'Choose from our powerful AI-driven tools to match your needs.'
    },
    {
      number: '02',
      title: 'Upload Content',
      description: 'Provide your text, PDF, or input parameters.'
    },
    {
      number: '03',
      title: 'Get Results',
      description: 'Receive AI-generated questions, summaries, or insights instantly.'
    }
  ];

  // Benefits
  const benefits = [
    {
      icon: <Clock className={`w-8 h-8 ${isNightMode ? 'text-blue-400' : 'text-blue-600'}`} />,
      title: 'Save Time with AI',
      description: 'Automate question generation and content analysis.'
    },
    {
      icon: <BookOpen className={`w-8 h-8 ${isNightMode ? 'text-green-400' : 'text-green-600'}`} />,
      title: 'Simplify Learning',
      description: 'Transform complex materials into digestible formats.'
    },
    {
      icon: <Zap className={`w-8 h-8 ${isNightMode ? 'text-yellow-400' : 'text-yellow-600'}`} />,
      title: 'Boost Productivity',
      description: 'Focus on what matters with AI handling the rest.'
    }
  ];

  // Handle navigation
  const handleNavigation = (componentId) => {
    if (onNavigate) {
      onNavigate(componentId);
    }
  };

  return (
    <div className={`w-full ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
      {/* Hero Section */}
      <section className={`relative overflow-hidden ${isNightMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} rounded-xl shadow-lg mb-12`}>
        <div className="absolute inset-0 opacity-10 bg-pattern"></div>
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className={`text-4xl md:text-5xl font-bold leading-tight mb-4 ${isNightMode ? 'text-blue-400' : 'text-blue-700'}`}>
                Transforming Your Learning and Analytics Experience!
              </h1>
              <p className={`text-lg md:text-xl mb-8 ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                From intelligent question generation to PDF-powered insights, let AI elevate your productivity.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => handleNavigation('mcq')}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center ${isNightMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
                >
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleNavigation('upload')}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center ${isNightMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} ${isNightMode ? 'text-white' : 'text-gray-800'} border ${isNightMode ? 'border-gray-600' : 'border-gray-300'} transition-colors`}
                >
                  Explore Features
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className={`relative w-full max-w-md ${isNightMode ? 'bg-gray-800' : 'bg-white'} p-2 rounded-xl shadow-xl`}>
                <img 
                  src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="AI Learning Platform" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-12 ${isNightMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg mb-12`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isNightMode ? 'text-blue-400' : 'text-blue-700'}`}>Powerful Features</h2>
            <p className={`max-w-2xl mx-auto ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Our platform offers a suite of AI-powered tools designed to enhance your learning and productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-xl transition-transform hover:scale-105 ${isNightMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} cursor-pointer`}
                onClick={() => handleNavigation(feature.id)}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className={`text-xl font-semibold mb-2 ${isNightMode ? 'text-blue-300' : 'text-blue-700'}`}>{feature.title}</h3>
                <p className={isNightMode ? 'text-gray-300' : 'text-gray-600'}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`py-12 ${isNightMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl shadow-lg mb-12`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isNightMode ? 'text-blue-400' : 'text-blue-700'}`}>How It Works</h2>
            <p className={`max-w-2xl mx-auto ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Get started in just a few simple steps and experience the power of AI-assisted learning.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex-1 relative">
                <div className={`text-6xl font-bold opacity-20 absolute -top-6 -left-2 ${isNightMode ? 'text-blue-500' : 'text-blue-300'}`}>
                  {step.number}
                </div>
                <div className="relative z-10 mt-6">
                  <h3 className={`text-xl font-semibold mb-3 ${isNightMode ? 'text-blue-300' : 'text-blue-700'}`}>{step.title}</h3>
                  <p className={isNightMode ? 'text-gray-300' : 'text-gray-600'}>{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className={`w-8 h-8 ${isNightMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`py-12 ${isNightMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg mb-12`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isNightMode ? 'text-blue-400' : 'text-blue-700'}`}>Why Choose Us</h2>
            <p className={`max-w-2xl mx-auto ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Our platform offers unique advantages that set us apart from traditional learning tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-xl ${isNightMode ? 'bg-gray-700' : 'bg-gray-50'} flex flex-col items-center text-center`}
              >
                <div className="mb-4 p-3 rounded-full bg-opacity-20 bg-current">
                  {benefit.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${isNightMode ? 'text-blue-300' : 'text-blue-700'}`}>{benefit.title}</h3>
                <p className={isNightMode ? 'text-gray-300' : 'text-gray-600'}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className={`py-12 ${isNightMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl shadow-lg mb-12`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isNightMode ? 'text-blue-400' : 'text-blue-700'}`}>Meet Our Team</h2>
            <p className={`max-w-2xl mx-auto ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
              The talented individuals behind this innovative learning platform.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center text-center transition-transform hover:scale-105`}
              >
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 ${isNightMode ? 'border-blue-600' : 'border-blue-500'} mb-4`}>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className={`text-lg font-semibold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>{member.name}</h3>
                <p className={`text-sm ${isNightMode ? 'text-gray-400' : 'text-gray-600'}`}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Simple Footer */}
      <footer className={`py-8 ${isNightMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-xl`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className={`text-xl font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>AI Learning System</h3>
              <p className={`text-sm ${isNightMode ? 'text-gray-400' : 'text-gray-600'}`}>© 2025 All Rights Reserved</p>
            </div>
            <div className="flex space-x-6">
              <button 
                onClick={() => handleNavigation('mcq')}
                className={`text-sm ${isNightMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                MCQ Generator
              </button>
              <button 
                onClick={() => handleNavigation('upload')}
                className={`text-sm ${isNightMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Upload PDF
              </button>
              <button 
                onClick={() => handleNavigation('analytics')}
                className={`text-sm ${isNightMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Analytics
              </button>
              <button 
                onClick={() => handleNavigation('home')}
                className={`text-sm ${isNightMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                About
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 