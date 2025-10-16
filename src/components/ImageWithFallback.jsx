import React, { useState, forwardRef } from 'react';
import { getLocalImage, getPlaceholderImage } from '../utils/imageUtils';

const ImageWithFallback = forwardRef(({ 
  src, 
  alt, 
  className = '', 
  fallback = null,
  placeholder = 'product',
  ...props 
}, ref) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleLoad = () => {
    setImageLoading(false);
  };

  const getImageSrc = () => {
    if (imageError) {
      return fallback || getPlaceholderImage(placeholder);
    }
    return getLocalImage(src);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      <img
        ref={ref}
        src={getImageSrc()}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        className={`transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        {...props}
      />
    </div>
  );
});

ImageWithFallback.displayName = 'ImageWithFallback';

export default ImageWithFallback;
