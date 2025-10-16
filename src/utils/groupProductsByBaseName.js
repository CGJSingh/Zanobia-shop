/**
 * Group Products by Base Name
 * 
 * Groups WooCommerce products that share the same base name but differ by color variants.
 * Extracts color information from product names and organizes them into product families.
 * 
 * @module groupProductsByBaseName
 */

/**
 * Common color patterns to detect in product names
 */
const COLOR_PATTERNS = [
  'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Black', 
  'White', 'Gray', 'Grey', 'Brown', 'Beige', 'Navy', 'Teal', 'Cyan',
  'Magenta', 'Gold', 'Silver', 'Bronze', 'Copper', 'Rose', 'Mint',
  'Lime', 'Indigo', 'Violet', 'Turquoise', 'Crimson', 'Maroon',
  'Olive', 'Coral', 'Peach', 'Ivory', 'Cream', 'Charcoal', 'Slate',
  'Emerald', 'Sapphire', 'Ruby', 'Amber', 'Jade', 'Onyx', 'Pearl',
  // Multi-word colors
  'Light Blue', 'Dark Blue', 'Sky Blue', 'Royal Blue',
  'Light Green', 'Dark Green', 'Forest Green', 'Lime Green',
  'Hot Pink', 'Light Pink', 'Dark Red', 'Bright Red'
];

/**
 * Extract color from product name
 * Looks for common color patterns with various separators (-, /, |, etc.)
 * 
 * @param {string} name - Product name
 * @returns {string|null} - Extracted color or null
 */
const extractColor = (name) => {
  if (!name) return null;

  // Try to find color with common separators
  const separators = [' - ', ' / ', ' | ', ' – ', ' — ', ' (', ')'];
  
  for (const separator of separators) {
    const parts = name.split(separator);
    for (const part of parts) {
      const trimmed = part.trim();
      // Check for exact color match (case-insensitive)
      const matchedColor = COLOR_PATTERNS.find(
        color => trimmed.toLowerCase() === color.toLowerCase()
      );
      if (matchedColor) {
        return matchedColor;
      }
    }
  }

  // If no separator found, check if name ends with a color
  for (const color of COLOR_PATTERNS) {
    const regex = new RegExp(`\\b${color}\\b$`, 'i');
    if (regex.test(name)) {
      return color;
    }
  }

  return null;
};

/**
 * Remove color suffix from product name to get base name
 * 
 * @param {string} name - Full product name
 * @param {string} color - Color to remove
 * @returns {string} - Base product name
 */
const getBaseName = (name, color) => {
  if (!color) return name;

  // Remove color with common separators
  const patterns = [
    ` - ${color}`,
    ` / ${color}`,
    ` | ${color}`,
    ` – ${color}`,
    ` — ${color}`,
    ` (${color})`,
    ` ${color}`
  ];

  let baseName = name;
  for (const pattern of patterns) {
    const regex = new RegExp(pattern + '$', 'i');
    baseName = baseName.replace(regex, '');
  }

  return baseName.trim();
};

/**
 * Get color-specific images from product images array
 * 
 * @param {Array} images - Product images array
 * @param {string} color - Color to filter by
 * @returns {Array} - Filtered images
 */
const getColorImages = (images, color) => {
  if (!images || images.length === 0) return [];
  if (!color) return images;

  const filtered = images.filter(img => {
    const imgName = (img.name || '').toLowerCase();
    const imgSrc = (img.src || '').toLowerCase();
    const colorLower = color.toLowerCase();
    
    return imgName.includes(colorLower) || imgSrc.includes(colorLower);
  });

  // If no color-specific images found, return first image as fallback
  return filtered.length > 0 ? filtered : [images[0]];
};

/**
 * Group products by base name and color variants
 * 
 * @param {Array} products - Array of WooCommerce products
 * @returns {Array} - Array of grouped product families
 * 
 * @example
 * const grouped = groupProductsByBaseName(products);
 * // Returns:
 * // [
 * //   {
 * //     baseName: "Zanobia Clay Large Glazed Top",
 * //     colors: ["Red", "Blue", "Green"],
 * //     variants: [
 * //       { ...productData, color: "Red", colorImages: [...] },
 * //       { ...productData, color: "Blue", colorImages: [...] },
 * //       { ...productData, color: "Green", colorImages: [...] }
 * //     ],
 * //     defaultVariant: { ...productData for first color }
 * //   }
 * // ]
 */
export const groupProductsByBaseName = (products) => {
  if (!products || !Array.isArray(products)) return [];

  const grouped = {};

  // First pass: organize by base name
  products.forEach(product => {
    const color = extractColor(product.name);
    const baseName = color ? getBaseName(product.name, color) : product.name;

    if (!grouped[baseName]) {
      grouped[baseName] = {
        baseName,
        colors: [],
        variants: []
      };
    }

    // Add color-specific images to variant
    const colorImages = getColorImages(product.images, color);

    grouped[baseName].variants.push({
      ...product,
      color: color || 'Default',
      colorImages
    });

    if (color && !grouped[baseName].colors.includes(color)) {
      grouped[baseName].colors.push(color);
    }
  });

  // Convert to array and add default variant
  const result = Object.values(grouped).map(group => {
    // If no colors detected, treat as single product
    if (group.colors.length === 0 && group.variants.length === 1) {
      group.colors = ['Default'];
      group.variants[0].color = 'Default';
      group.variants[0].colorImages = group.variants[0].images;
    }

    return {
      ...group,
      defaultVariant: group.variants[0]
    };
  });

  return result;
};

/**
 * Get color value for CSS rendering
 * Maps color names to CSS color values
 * 
 * @param {string} colorName - Color name
 * @returns {string} - CSS color value
 */
export const getColorValue = (colorName) => {
  const colorMap = {
    'red': '#EF4444',
    'blue': '#3B82F6',
    'green': '#10B981',
    'yellow': '#FBBF24',
    'orange': '#F97316',
    'purple': '#A855F7',
    'pink': '#EC4899',
    'black': '#000000',
    'white': '#FFFFFF',
    'gray': '#6B7280',
    'grey': '#6B7280',
    'brown': '#92400E',
    'beige': '#D2B48C',
    'navy': '#1E3A8A',
    'teal': '#14B8A6',
    'cyan': '#06B6D4',
    'magenta': '#D946EF',
    'gold': '#F59E0B',
    'silver': '#D1D5DB',
    'bronze': '#CD7F32',
    'copper': '#B87333',
    'rose': '#FB7185',
    'mint': '#6EE7B7',
    'lime': '#84CC16',
    'indigo': '#6366F1',
    'violet': '#8B5CF6',
    'turquoise': '#14B8A6',
    'crimson': '#DC2626',
    'maroon': '#7F1D1D',
    'olive': '#84CC16',
    'coral': '#FB7185',
    'peach': '#FED7AA',
    'ivory': '#FFF8DC',
    'cream': '#FFFDD0',
    'charcoal': '#374151',
    'slate': '#475569',
    'emerald': '#10B981',
    'sapphire': '#3B82F6',
    'ruby': '#DC2626',
    'amber': '#F59E0B',
    'jade': '#10B981',
    'onyx': '#000000',
    'pearl': '#F3F4F6',
    // Multi-word colors
    'light blue': '#93C5FD',
    'dark blue': '#1E40AF',
    'sky blue': '#0EA5E9',
    'royal blue': '#1D4ED8',
    'light green': '#86EFAC',
    'dark green': '#065F46',
    'forest green': '#047857',
    'lime green': '#84CC16',
    'hot pink': '#F472B6',
    'light pink': '#FBCFE8',
    'dark red': '#991B1B',
    'bright red': '#EF4444'
  };

  const lowerColor = colorName.toLowerCase();
  return colorMap[lowerColor] || '#6B7280'; // Default to gray
};

export default groupProductsByBaseName;

