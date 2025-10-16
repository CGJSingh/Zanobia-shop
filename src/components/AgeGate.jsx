/**
 * AgeGate Component - Premium 3D Version
 * 
 * Full-screen age verification with dramatic black/white split background
 * and 3D rotating logo for a luxury brand reveal experience.
 * 
 * Features:
 * - 3D rotating logo (rotateY animation)
 * - 50/50 black/white split background
 * - Minimal, elegant design
 * - localStorage persistence
 * - Smooth transitions
 * - Premium brand feel
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onVerify - Callback when user verifies age (clicks Yes)
 */

import { useState } from 'react';

export default function AgeGate({ onVerify }) {
  const [isDenied, setIsDenied] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  /**
   * Handle user clicking "Yes" - they are 19+
   * Saves verification to localStorage and calls parent callback
   */
  const handleYes = () => {
    setIsExiting(true);
    setTimeout(() => {
      localStorage.setItem('isAgeVerified', 'true');
      onVerify();
    }, 800);
  };

  /**
   * Handle user clicking "No" - they are under 19
   * Shows denial message
   */
  const handleNo = () => {
    setIsDenied(true);
  };

  /**
   * Redirect user to external site (Google)
   */
  const handleLeave = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-800 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Split Background - 50/50 Black & White */}
      <div className="absolute inset-0">
        {/* Vertical Split */}
        <div className="absolute inset-0 flex">
          <div className="w-1/2 bg-white"></div>
          <div className="w-1/2 bg-black"></div>
        </div>
        
        {/* Center Line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-gray-400 to-transparent transform -translate-x-1/2"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {!isDenied ? (
          <div className="flex flex-col items-center text-center max-w-2xl">
            {/* 3D Rotating Logo */}
            <div className="mb-12 perspective-1000 animate-fadeInUp">
              <img
                src="/images/logos/logo.png"
                alt="ZANOBIA"
                className="w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-contain animate-spin-3d"
                style={{
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                  transformStyle: 'preserve-3d'
                }}
              />
            </div>

            {/* Glass Container for Text & Buttons */}
            <div className="bg-white/80 backdrop-blur-xl px-8 sm:px-12 py-8 sm:py-10 rounded-2xl shadow-2xl border border-white/20 ring-1 ring-black/5 w-full max-w-2xl animate-fadeInUp animation-delay-200 transition-all duration-500">
              {/* Age Question */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide mb-3 text-gray-900">
                Are you <span className="font-bold">19</span> or older?
              </h1>

              <p className="text-sm sm:text-base text-gray-700 mb-10 max-w-md mx-auto">
                You must be of legal smoking age to enter this site
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
                {/* Yes Button - Black */}
                <button
                  onClick={handleYes}
                  className="group relative flex-1 px-10 py-4 bg-black text-white font-medium text-lg tracking-wide transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden rounded-lg"
                >
                  <span className="relative z-10">Yes, Enter</span>
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </button>

                {/* No Button - White */}
                <button
                  onClick={handleNo}
                  className="group relative flex-1 px-10 py-4 bg-white text-black border-2 border-gray-300 font-medium text-lg tracking-wide transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:border-gray-400 overflow-hidden rounded-lg"
                >
                  <span className="relative z-10">No, I'm not</span>
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </button>
              </div>

              {/* Legal Text */}
              <p className="mt-8 text-xs text-gray-600 max-w-lg mx-auto">
                By entering, you confirm you are of legal smoking age in your jurisdiction
              </p>
            </div>
          </div>
        ) : (
          /* Denial Message */
          <div className="bg-white/80 backdrop-blur-xl px-8 sm:px-12 py-10 sm:py-12 rounded-2xl shadow-2xl border border-white/20 ring-1 ring-black/5 max-w-lg animate-fadeIn">
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-red-500 bg-red-50 flex items-center justify-center">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            {/* Message */}
            <h2 className="text-4xl font-light mb-4 text-gray-900">
              Access Denied
            </h2>
            <p className="text-xl text-gray-800 mb-2">
              You must be <strong className="font-bold">19+</strong> to enter
            </p>
            <p className="text-base text-gray-600 mb-10">
              Thank you for your honesty
            </p>

            {/* Leave Button */}
            <button
              onClick={handleLeave}
              className="px-10 py-4 bg-black text-white font-medium text-lg tracking-wide transition-all duration-300 transform hover:scale-105 hover:shadow-2xl rounded-lg w-full"
            >
              Exit
            </button>
          </div>
        )}
      </div>

      {/* Brand Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-xs tracking-widest uppercase text-gray-400 mix-blend-difference">
          Zanobia © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

