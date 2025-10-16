/**
 * TimelineSection Component
 * 
 * Displays company milestones in a vertical timeline layout.
 * Shows the journey from Baghdad to global expansion.
 * 
 * Features:
 * - Vertical timeline with animated entries
 * - Fade-in on scroll for each milestone
 * - Responsive design
 * - Theme-aware styling
 * 
 * @component
 */

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function TimelineSection() {
  const { isDark } = useTheme();
  const [visibleItems, setVisibleItems] = useState([]);
  const timelineRef = useRef(null);

  const milestones = [
    {
      year: '1999',
      title: 'Founded in Baghdad',
      description: 'Zanobia was born in the heart of Iraq, where hookah culture runs deep and quality is non-negotiable.'
    },
    {
      year: '2005',
      title: 'Expansion to UAE',
      description: 'Bringing premium hookah experiences to the Middle East, establishing our reputation for excellence.'
    },
    {
      year: '2012',
      title: 'Entered USA Market',
      description: 'Bringing authentic hookah culture to America, serving communities coast to coast.'
    },
    {
      year: '2018',
      title: 'Arrived in Canada',
      description: 'Expanding our reach to serve hookah enthusiasts across North America with the same dedication to quality.'
    },
    {
      year: 'Today',
      title: 'Global Legacy',
      description: 'A trusted name in hookah culture worldwide, serving thousands of satisfied customers daily.'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute('data-index');
            setVisibleItems((prev) => [...new Set([...prev, parseInt(index)])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const items = timelineRef.current?.querySelectorAll('.timeline-item');
    items?.forEach((item) => observer.observe(item));

    return () => {
      items?.forEach((item) => observer.unobserve(item));
    };
  }, []);

  return (
    <section className={`py-16 lg:py-24 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl lg:text-5xl font-serif font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Our Journey
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            From Baghdad to the world — a legacy built on quality and tradition
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Vertical Line */}
          <div className={`absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 ${
            isDark ? 'bg-green-500/30' : 'bg-green-500/20'
          }`}></div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                data-index={index}
                className={`timeline-item relative transition-all duration-700 ${
                  visibleItems.includes(index)
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-10'
                }`}
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${
                  index % 2 === 0 ? '' : 'lg:text-right'
                }`}>
                  {/* Left side (odd items) */}
                  <div className={`${index % 2 === 0 ? 'lg:pr-12' : 'lg:order-2 lg:pl-12'}`}>
                    <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-3xl font-bold font-serif text-green-500">
                          {milestone.year}
                        </span>
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {milestone.title}
                      </h3>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-8 lg:left-1/2 top-6 transform -translate-x-1/2">
                    <div className={`w-6 h-6 rounded-full border-4 ${
                      isDark ? 'bg-gray-800 border-green-500' : 'bg-white border-green-500'
                    } shadow-lg`}></div>
                  </div>

                  {/* Right side (even items) - empty on mobile */}
                  <div className={`hidden lg:block ${index % 2 === 0 ? 'lg:order-2' : ''}`}>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

