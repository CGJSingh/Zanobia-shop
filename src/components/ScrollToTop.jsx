/**
 * ScrollToTop Component
 * 
 * Automatically scrolls the window to the top when the route changes.
 * This improves UX by ensuring users start at the top of each new page.
 * 
 * Usage:
 * Place this component inside <Router> in App.jsx
 * 
 * @component
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  /**
   * Scroll to top whenever pathname changes
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Smooth scroll for better UX
    });
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop;

