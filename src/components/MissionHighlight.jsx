/**
 * MissionHighlight Component
 * 
 * Displays the company mission statement in a bold, standout block.
 * Features parallax-style animation and large typography.
 * 
 * Features:
 * - Large, bold typography
 * - Scroll-based parallax effect
 * - Animated fade-in
 * - Theme-aware styling
 * - Centered layout with decorative elements
 * 
 * @component
 */

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function MissionHighlight() {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollProgress = 1 - rect.top / window.innerHeight;
        setScrollY(scrollProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative py-24 lg:py-32 overflow-hidden ${
        isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-white to-green-50'
      } transition-colors duration-300`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl opacity-20 ${
            isDark ? 'bg-green-500' : 'bg-green-300'
          }`}
          style={{
            transform: `translateY(${scrollY * 50}px)`
          }}
        ></div>
        <div
          className={`absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            isDark ? 'bg-green-600' : 'bg-green-400'
          }`}
          style={{
            transform: `translateY(${-scrollY * 30}px)`
          }}
        ></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Statement */}
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Decorative Icon */}
          <div className="flex justify-center mb-8">
            <div className={`w-20 h-1 rounded-full bg-gradient-to-r from-transparent via-green-500 to-transparent`}></div>
          </div>

          {/* Main Quote */}
          <blockquote className="relative">
            <svg
              className={`absolute top-0 left-0 w-12 h-12 lg:w-16 lg:h-16 -mt-4 -ml-4 opacity-20 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}
              fill="currentColor"
              viewBox="0 0 32 32"
            >
              <path d="M10 8c-3.3 0-6 2.7-6 6s2.7 6 6 6c1.4 0 2.7-.5 3.7-1.3-.3 2.9-2.7 5.3-5.7 5.3v4c5.5 0 10-4.5 10-10V8h-8zm16 0c-3.3 0-6 2.7-6 6s2.7 6 6 6c1.4 0 2.7-.5 3.7-1.3-.3 2.9-2.7 5.3-5.7 5.3v4c5.5 0 10-4.5 10-10V8h-8z" />
            </svg>

            <p className={`text-2xl lg:text-4xl xl:text-5xl font-serif font-bold leading-tight mb-8 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
            style={{
              transform: `translateY(${-scrollY * 10}px)`
            }}>
              Zanobia isn't just a brand.
              <br />
              <span className="text-green-600">
                It's a community
              </span>
              {' '}built on
              <br />
              craftsmanship, culture, and connection.
            </p>

            <svg
              className={`absolute bottom-0 right-0 w-12 h-12 lg:w-16 lg:h-16 -mb-4 -mr-4 opacity-20 transform rotate-180 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}
              fill="currentColor"
              viewBox="0 0 32 32"
            >
              <path d="M10 8c-3.3 0-6 2.7-6 6s2.7 6 6 6c1.4 0 2.7-.5 3.7-1.3-.3 2.9-2.7 5.3-5.7 5.3v4c5.5 0 10-4.5 10-10V8h-8zm16 0c-3.3 0-6 2.7-6 6s2.7 6 6 6c1.4 0 2.7-.5 3.7-1.3-.3 2.9-2.7 5.3-5.7 5.3v4c5.5 0 10-4.5 10-10V8h-8z" />
            </svg>
          </blockquote>

          {/* Decorative Icon */}
          <div className="flex justify-center mt-8">
            <div className={`w-20 h-1 rounded-full bg-gradient-to-r from-transparent via-green-500 to-transparent`}></div>
          </div>
        </div>

        {/* Supporting Text */}
        <div
          className={`text-center mt-12 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className={`text-lg lg:text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Our commitment goes beyond selling products. We're here to preserve the art of hookah smoking,
            to educate new enthusiasts, and to serve those who value quality above all else.
          </p>
        </div>
      </div>
    </section>
  );
}

