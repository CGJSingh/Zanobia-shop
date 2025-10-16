// Generate placeholder images for development and testing

/**
 * Generate a placeholder image URL
 * @param {string} text - Text to display on placeholder
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} bgColor - Background color (hex without #)
 * @param {string} textColor - Text color (hex without #)
 * @returns {string} Placeholder image URL
 */
export const generatePlaceholder = (text = 'Image', width = 400, height = 400, bgColor = 'f3f4f6', textColor = '6b7280') => {
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
};

/**
 * Generate product placeholder images
 */
export const productPlaceholders = {
  default: generatePlaceholder('Product', 400, 400, 'e5e7eb', '374151'),
  electronics: generatePlaceholder('Electronics', 400, 400, 'dbeafe', '1e40af'),
  audio: generatePlaceholder('Audio', 400, 400, 'fef3c7', 'd97706'),
  fitness: generatePlaceholder('Fitness', 400, 400, 'dcfce7', '16a34a'),
  computers: generatePlaceholder('Computers', 400, 400, 'f3e8ff', '7c3aed'),
  gaming: generatePlaceholder('Gaming', 400, 400, 'fce7f3', 'be185d')
};

/**
 * Generate banner placeholder images
 */
export const bannerPlaceholders = {
  hero: generatePlaceholder('Hero Banner', 1920, 600, '1e40af', 'ffffff'),
  promotional: generatePlaceholder('Promotional', 1200, 400, '059669', 'ffffff'),
  category: generatePlaceholder('Category', 800, 300, '7c3aed', 'ffffff')
};

/**
 * Get placeholder image for a specific category
 * @param {string} category - Product category
 * @returns {string} Placeholder image URL
 */
export const getCategoryPlaceholder = (category) => {
  const categoryKey = category?.toLowerCase() || 'default';
  return productPlaceholders[categoryKey] || productPlaceholders.default;
};
