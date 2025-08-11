import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  RefreshCw, 
  Mail,  
  Lock, 
  Wifi, 
  Server,
  Lightbulb,
  Coffee,
  HelpCircle,
  Briefcase
} from 'lucide-react';

interface ErrorConfig {
  code: string;
  title: string;
  message: string;
  icon: React.ReactNode;
  color: string;
  suggestions: string[];
}

const errorConfigs: Record<string, ErrorConfig> = {
  '404': {
    code: '404',
    title: 'Page Not Found',
    message: 'Oops! The page you\'re looking for seems to have wandered off. Maybe it found a better job?',
    icon: <Search className="w-16 h-16" />,
    color: 'from-blue-500 to-purple-600',
    suggestions: [
      'Check the URL for typos',
      'Use our search feature',
      'Browse our job categories',
      'Return to homepage'
    ]
  },
  '403': {
    code: '403',
    title: 'Access Denied',
    message: 'Sorry, you don\'t have permission to access this page. It\'s like a VIP job interview - invitation only!',
    icon: <Lock className="w-16 h-16" />,
    color: 'from-red-500 to-pink-600',
    suggestions: [
      'Log in to your account',
      'Check your permissions',
      'Contact support',
      'Upgrade your plan'
    ]
  },
  '500': {
    code: '500',
    title: 'Server Error',
    message: 'Our servers are having a coffee break. We\'re working hard to get them back to work!',
    icon: <Server className="w-16 h-16" />,
    color: 'from-orange-500 to-red-600',
    suggestions: [
      'Refresh the page',
      'Try again in a few minutes',
      'Clear your browser cache',
      'Contact support if issue persists'
    ]
  },
  'network': {
    code: 'Network',
    title: 'Connection Error',
    message: 'Looks like you\'re offline or having connection issues. Even the best networks need a break sometimes!',
    icon: <Wifi className="w-16 h-16" />,
    color: 'from-gray-500 to-gray-700',
    suggestions: [
      'Check your internet connection',
      'Try refreshing the page',
      'Switch to a different network',
      'Contact your ISP'
    ]
  },
  'maintenance': {
    code: 'Maintenance',
    title: 'Under Maintenance',
    message: 'We\'re making HireHub even better! Like renovating an office, we need to close temporarily for improvements.',
    icon: <Coffee className="w-16 h-16" />,
    color: 'from-yellow-500 to-orange-600',
    suggestions: [
      'Try again in a few minutes',
      'Follow us on social media for updates',
      'Check our status page',
      'Sign up for maintenance notifications'
    ]
  }
};

const ErrorPage: React.FC = () => {
  const [currentError, setCurrentError] = useState<string>('404');
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const config = errorConfigs[currentError];

  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // In a real app, this would navigate to search results
      console.log('Searching for:', searchTerm);
    }
  };

  const ErrorSelector: React.FC = () => (
    <div className="mb-8">
      <p className="text-sm text-gray-500 mb-4">Demo: Switch between different error types</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(errorConfigs).map((errorType) => (
          <button
            key={errorType}
            onClick={() => setCurrentError(errorType)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              currentError === errorType
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {errorConfigs[errorType].code}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Demo Error Selector - Remove in production */}
        <ErrorSelector />

        {/* Main Error Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
          {/* Animated Icon */}
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r ${config.color} mb-8 text-white ${isAnimating ? 'animate-spin' : ''}`}>
            {config.icon}
          </div>

          {/* Error Code */}
          <div className={`text-8xl md:text-9xl font-black bg-gradient-to-r ${config.color} bg-clip-text text-transparent mb-4`}>
            {config.code}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {config.title}
          </h1>

          {/* Message */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {config.message}
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for jobs, companies, or help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 pl-12 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-300 font-semibold"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className={`flex items-center justify-center px-6 py-3 bg-gradient-to-r ${config.color} text-white rounded-full hover:shadow-lg transition-all duration-300 font-semibold`}
            >
              <Home className="w-5 h-5 mr-2" />
              Home Page
            </button>
            
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 font-semibold"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isAnimating ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Suggestions Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-900">Helpful Suggestions</h3>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {config.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-sm">{index + 1}</span>
                </div>
                <span className="text-gray-700">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <a href="/jobs" className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 group">
            <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-gray-900">Browse Jobs</div>
            <div className="text-sm text-gray-500">Find opportunities</div>
          </a>
          
          <a href="/companies" className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 group">
            <Search className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-gray-900">Companies</div>
            <div className="text-sm text-gray-500">Explore employers</div>
          </a>
          
          <a href="/help" className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 group">
            <HelpCircle className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-gray-900">Help Center</div>
            <div className="text-sm text-gray-500">Get support</div>
          </a>
          
          <a href="/contact" className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 group">
            <Mail className="w-8 h-8 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-gray-900">Contact Us</div>
            <div className="text-sm text-gray-500">Reach out</div>
          </a>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 mb-2">
            Still having trouble? We're here to help!
          </p>
          <div className="flex justify-center space-x-6">
            <a href="/contact" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Contact Support
            </a>
            <a href="/status" className="text-indigo-600 hover:text-indigo-800 font-medium">
              System Status
            </a>
            <a href="/faq" className="text-indigo-600 hover:text-indigo-800 font-medium">
              FAQ
            </a>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="fixed top-20 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-50 animate-bounce"></div>
        <div className="fixed bottom-20 right-10 w-12 h-12 bg-purple-200 rounded-full opacity-50 animate-pulse"></div>
        <div className="fixed top-1/2 right-20 w-8 h-8 bg-pink-200 rounded-full opacity-50 animate-ping"></div>
      </div>
    </div>
  );
};

export default ErrorPage;