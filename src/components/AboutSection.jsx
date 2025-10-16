/**
 * AboutSection Component
 * 
 * Reusable section block for the About Us page.
 * Supports optional background images, gradients, and scroll animations.
 * 
 * Features:
 * - Alternating layouts (text-left, text-right)
 * - Optional background image with overlay
 * - Fade-in animations on scroll
 * - Responsive design
 * - Theme-aware styling
 * - Special logo mode (no shadows, blends with background)
 * 
 * @component
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {string} props.content - Section content (can be JSX)
 * @param {string} props.imageSrc - Optional background or side image
 * @param {string} props.imageAlt - Alt text for image
 * @param {string} props.layout - Layout type: 'full' | 'split-left' | 'split-right' | 'centered'
 * @param {string} props.bgColor - Background color class (default: 'bg-white')
 * @param {boolean} props.animate - Enable scroll animation (default: true)
 * @param {React.ReactNode} props.children - Optional children to render instead of content
 * @param {boolean} props.isLogo - If true, removes shadows and rounds, blends image naturally (default: false)
 */

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function AboutSection({
  title,
  content,
  imageSrc,
  imageAlt = '',
  layout = 'full',
  bgColor = 'bg-white',
  animate = true,
  children,
  isLogo = false
}) {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!animate) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [animate]);

  const getLayoutClasses = () => {
    switch (layout) {
      case 'split-left':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center';
      case 'split-right':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center';
      case 'centered':
        return 'flex flex-col items-center text-center';
      case 'full':
      default:
        return 'flex flex-col';
    }
  };

  const renderSplitLayout = () => {
    const textContent = (
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {title && (
          <h2 className={`text-3xl lg:text-4xl font-serif font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h2>
        )}
        {children ? (
          children
        ) : (
          <div className={`text-base lg:text-lg leading-relaxed ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {content}
          </div>
        )}
      </div>
    );

    const imageContent = imageSrc && (
      <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${isLogo ? 'flex items-center justify-center' : ''}`}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`${
            isLogo 
              ? 'w-auto h-auto max-w-md object-contain opacity-90 hover:opacity-100 hover:scale-110 hover:rotate-3 transition-all duration-500 ease-out cursor-pointer hover:drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]' 
              : 'w-full h-auto rounded-xl shadow-2xl object-cover'
          }`}
        />
      </div>
    );

    if (layout === 'split-right') {
      return (
        <>
          {textContent}
          {imageContent}
        </>
      );
    }

    return (
      <>
        {imageContent}
        {textContent}
      </>
    );
  };

  return (
    <section
      ref={sectionRef}
      className={`py-16 lg:py-24 ${bgColor} transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={getLayoutClasses()}>
          {(layout === 'split-left' || layout === 'split-right') ? (
            renderSplitLayout()
          ) : (
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {title && (
                <h2 className={`text-3xl lg:text-5xl font-serif font-bold mb-6 ${
                  layout === 'centered' ? 'text-center' : ''
                } ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {title}
                </h2>
              )}
              {children ? (
                children
              ) : (
                <div className={`text-base lg:text-lg leading-relaxed ${
                  layout === 'centered' ? 'text-center max-w-3xl mx-auto' : ''
                } ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {content}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

