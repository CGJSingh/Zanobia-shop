import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LoginForm from '../components/auth/LoginForm';
import SEO from '../components/SEO';

/**
 * Login Page
 * 
 * Full page layout for user login
 * Redirects authenticated users to home
 * ALWAYS displays in light mode regardless of theme setting
 * 
 * @page
 */
export default function LoginPage() {
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
      const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/';
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <SEO 
        title="Login - Zanobia"
        description="Login to your Zanobia account to access your orders, wishlist, and more"
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

          {/* Login Form */}
          <LoginForm />

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Need help?{' '}
              <a 
                href="https://wa.me/6479390809?text=Hello!%20I%20need%20help%20logging%20in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline transition-colors inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

