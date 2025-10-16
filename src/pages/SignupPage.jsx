import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SignupForm from '../components/auth/SignupForm';
import SEO from '../components/SEO';

/**
 * Signup Page
 * 
 * Full page layout for user registration
 * Redirects authenticated users to home
 * ALWAYS displays in light mode regardless of theme setting
 * 
 * @page
 */
export default function SignupPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Force light mode on this page
  useEffect(() => {
    const htmlElement = document.documentElement;
    const hadDarkClass = htmlElement.classList.contains('dark');
    
    // Remove dark class to force light mode
    htmlElement.classList.remove('dark');
    
    // Restore original theme when leaving page
    return () => {
      if (hadDarkClass) {
        htmlElement.classList.add('dark');
      }
    };
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <SEO 
        title="Create Account - Zanobia"
        description="Create your Zanobia account to start shopping and access exclusive features"
      />
      
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header with Enhanced Logo */}
          <div className="text-center mb-12 mt-8 animate-fadeIn">
            <a 
              href="/" 
              className="inline-block mb-8 group"
            >
              <div className="relative p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:-translate-y-1">
                {/* Logo */}
                <img 
                  src="/images/logos/logo.png" 
                  alt="Zanobia" 
                  className="h-20 w-auto mx-auto filter drop-shadow-lg transition-all duration-300 group-hover:drop-shadow-xl"
                />
              </div>
            </a>
          </div>

          {/* Signup Form */}
          <SignupForm />

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              By creating an account, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:underline transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:underline transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

