// Image utility functions for handling local and remote images

/**
 * Get the full path for a local image
 * @param {string} imagePath - Path to the image (e.g., 'products/laptop-1.jpg')
 * @returns {string} Full URL path to the image
 */
export const getLocalImage = (imagePath) => {
  if (!imagePath) return '/images/placeholders/no-image.jpg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a local path, prepend with /images/
  if (!imagePath.startsWith('/images/')) {
    return `/images/${imagePath}`;
  }
  
  return imagePath;
};

/**
 * Get a placeholder image for products
 * @param {string} category - Product category
 * @returns {string} Placeholder image path
 */
export const getPlaceholderImage = (category = 'product') => {
  const placeholders = {
    product: '/images/placeholders/product-placeholder.jpg',
    banner: '/images/placeholders/banner-placeholder.jpg',
    logo: '/images/placeholders/logo-placeholder.jpg',
    user: '/images/placeholders/user-placeholder.jpg'
  };
  
  return placeholders[category] || placeholders.product;
};

/**
 * Get optimized image URL with size parameters
 * @param {string} imagePath - Path to the image
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {string} Optimized image URL
 */
export const getOptimizedImage = (imagePath, width = 400, height = 400) => {
  const basePath = getLocalImage(imagePath);
  
  // For local images, we can add size parameters if needed
  // This is useful for future image optimization
  return `${basePath}?w=${width}&h=${height}`;
};

/**
 * Check if an image exists locally
 * @param {string} imagePath - Path to the image
 * @returns {boolean} Whether the image exists
 */
export const imageExists = (imagePath) => {
  // This is a simple check - in a real app, you might want to
  // implement a more sophisticated image existence check
  return imagePath && imagePath.length > 0;
};
