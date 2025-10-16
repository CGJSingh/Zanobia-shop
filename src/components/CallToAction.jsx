/**
 * CallToAction Component
 * 
 * Closing CTA block for the About Us page.
 * Encourages visitors to explore products with a prominent button.
 * 
 * Features:
 * - Bold headline and subtext
 * - Prominent CTA button
 * - Gradient background
 * - Hover animations
 * - Theme-aware styling
 * - Responsive design
 * 
 * @component
 * @param {Object} props
 * @param {string} props.title - CTA headline (default: "Explore Our Products")
 * @param {string} props.subtitle - CTA subtext (default: "Elevate your smoke...")
 * @param {string} props.buttonText - Button label (default: "Shop Now")
 * @param {string} props.buttonLink - Button destination (default: "/products")
 */

import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function CallToAction({
  title = "Explore Our Products",
  subtitle = "Elevate your smoke. Honor the culture. Choose Zanobia.",
  buttonText = "Shop Now",
  buttonLink = "/products"
}) {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <section className={`relative py-20 lg:py-28 overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-green-600 via-green-500 to-green-600'
    } transition-colors duration-300`}>
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-floatReverse"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h2 className="text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-white mb-6 animate-fadeInUp">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-xl lg:text-2xl text-white/90 mb-10 animate-fadeInUp animation-delay-200">
          {subtitle}
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate(buttonLink)}
          className="group relative inline-flex items-center gap-3 px-10 py-4 lg:px-12 lg:py-5 text-lg lg:text-xl font-semibold text-green-600 bg-white rounded-full shadow-2xl hover:shadow-green-300/50 transition-all duration-300 transform hover:scale-105 animate-fadeInUp animation-delay-400"
        >
          <span>{buttonText}</span>
          <svg
            className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>

          {/* Button Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/0 via-white/20 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
        </button>

        {/* Secondary Links */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/80">
          <button
            onClick={() => navigate('/contact')}
            className="hover:text-white transition-colors duration-200 underline decoration-white/30 hover:decoration-white underline-offset-4"
          >
            Contact Us
          </button>
          <span className="text-white/40">•</span>
          <button
            onClick={() => navigate('/products')}
            className="hover:text-white transition-colors duration-200 underline decoration-white/30 hover:decoration-white underline-offset-4"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
}

