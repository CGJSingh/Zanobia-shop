/**
 * AboutPage Component
 * 
 * Comprehensive About Us page for Zanobia.
 * Tells the brand story through visually engaging, scroll-based sections.
 * 
 * Features:
 * - Hero section with immersive background
 * - Multiple content sections with alternating layouts
 * - Company timeline
 * - Mission statement highlight
 * - Call-to-action block
 * - Scroll animations throughout
 * - Theme-aware styling
 * - Fully responsive
 * 
 * @component
 */

import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import AboutSection from '../components/AboutSection';
import TimelineSection from '../components/TimelineSection';
import MissionHighlight from '../components/MissionHighlight';
import CallToAction from '../components/CallToAction';

export default function AboutPage() {
  const { isDark } = useTheme();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen pt-16 transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Hero Section */}
      <section className={`relative h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden ${
        isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      }`}>
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/banners/banner.png"
            alt="Zanobia Hookah"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        {/* Smoke Effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-floatReverse"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white mb-6 animate-fadeInUp">
            About <span className="text-green-400">Zanobia</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto animate-fadeInUp animation-delay-200">
            More than just a name — a legacy built on tradition, quality, and community
          </p>
          
          {/* Decorative Line */}
          <div className="flex justify-center mt-8 animate-fadeInUp animation-delay-400">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Introduction Section */}
      <AboutSection
        layout="centered"
        bgColor={isDark ? 'bg-gray-900' : 'bg-white'}
        animate={true}
      >
        <p className={`text-lg lg:text-xl leading-relaxed max-w-4xl mx-auto ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Zanobia has become more than just a name — it's become a <strong className="text-green-600">legacy</strong>.
          What started as a passion in Baghdad over two decades ago has grown into a global brand trusted by hookah enthusiasts everywhere.
        </p>
      </AboutSection>

      {/* Legacy Section */}
      <AboutSection
        title="Our Legacy"
        layout="split-left"
        imageSrc="/images/logos/logo.png"
        imageAlt="Zanobia Logo"
        bgColor={isDark ? 'bg-gray-800' : 'bg-gray-50'}
        animate={true}
        isLogo={true}
      >
        <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          In 1999, we opened our doors in <strong>Baghdad, Iraq</strong> — a city where hookah culture isn't just a pastime; it's a way of life.
          From day one, our mission was clear: provide the best hookah products and experiences, no compromises.
        </p>
        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
          Over the years, we've stayed true to that mission while expanding across the Middle East, North America, and beyond.
          Every product we offer reflects our commitment to <strong className="text-green-600">quality, authenticity, and customer satisfaction</strong>.
        </p>
      </AboutSection>

      {/* Global Expansion Timeline */}
      <TimelineSection />

      {/* Craftsmanship Section */}
      <AboutSection
        title="Craftsmanship & Quality"
        layout="split-right"
        imageSrc="/images/banners/banner.png"
        imageAlt="Quality Craftsmanship"
        bgColor={isDark ? 'bg-gray-900' : 'bg-white'}
        animate={true}
      >
        <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          We don't just sell hookahs — we curate experiences. Every product in our catalog is hand-selected, tested, and approved by our team.
        </p>
        <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          From <strong className="text-green-600">premium hookahs</strong> to <strong className="text-green-600">coconut shell charcoal</strong>,
          from <strong className="text-green-600">luxury bowls</strong> to <strong className="text-green-600">artisan accessories</strong> —
          we carry only what we would use ourselves.
        </p>
        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
          Quality isn't just a standard for us. It's the <strong>foundation</strong> of everything we do.
        </p>
      </AboutSection>

      {/* Mission Statement Highlight */}
      <MissionHighlight />

      {/* Community Section */}
      <AboutSection
        title="A Community, Not Just a Brand"
        layout="centered"
        bgColor={isDark ? 'bg-gray-800' : 'bg-gray-50'}
        animate={true}
      >
        <div className={`max-w-4xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <p className="text-lg mb-6">
            Zanobia is built on <strong className="text-green-600">people</strong>.
            Whether you're a first-time smoker or a seasoned hookah enthusiast, you're part of our family.
          </p>
          <p className="text-lg mb-6">
            We're here to answer your questions, guide your choices, and make sure every session you have is memorable.
            We don't just want to sell you a product — we want to be your partner in enjoying hookah the way it was meant to be enjoyed.
          </p>
          <p className="text-lg">
            That's the Zanobia difference.
          </p>
        </div>
      </AboutSection>

      {/* Values Grid */}
      <section className={`py-16 lg:py-24 ${isDark ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl lg:text-4xl font-serif font-bold text-center mb-12 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Our Core Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className={`p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold text-center mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Quality First
              </h3>
              <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Every product meets our strict standards. No shortcuts, no compromises.
              </p>
            </div>

            {/* Value 2 */}
            <div className={`p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold text-center mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Community Focus
              </h3>
              <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                You're not just a customer — you're family. We're here to serve and support.
              </p>
            </div>

            {/* Value 3 */}
            <div className={`p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold text-center mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Global Reach
              </h3>
              <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                From Baghdad to the world — delivering excellence across continents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Statement */}
      <AboutSection
        layout="centered"
        bgColor={isDark ? 'bg-gray-800' : 'bg-gray-50'}
        animate={true}
      >
        <div className="max-w-3xl mx-auto">
          <p className={`text-xl lg:text-2xl font-medium leading-relaxed ${
            isDark ? 'text-gray-200' : 'text-gray-800'
          }`}>
            Whether you're shopping for your first hookah or upgrading your setup,
            <strong className="text-green-600"> Zanobia</strong> is here to make it right.
          </p>
          <p className={`text-lg mt-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Thank you for being part of our journey.
          </p>
        </div>
      </AboutSection>

      {/* Call to Action */}
      <CallToAction />
    </div>
  );
}

