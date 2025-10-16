# Coding Standards & Documentation Guide

## 📝 Code Documentation Requirements

All code in this project **MUST** include comprehensive comments following the standards outlined below.

---

## 🎯 Component Documentation

### Component Header Comment

Every React component must start with a JSDoc-style comment block:

```jsx
/**
 * ComponentName Component
 * 
 * Brief description of what the component does.
 * Mention any important design/theme decisions (e.g., "Always uses dark theme").
 * 
 * Features:
 * - Feature 1 description
 * - Feature 2 description
 * - Feature 3 description
 * - etc.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Type} props.propName - Description of prop
 * @param {Type} props.anotherProp - Description of another prop
 * @example
 * <ComponentName propName="value" anotherProp={123} />
 */
```

### Example:

```jsx
/**
 * ProductCard Component
 * 
 * Displays a single product in a card layout with modern light theme design.
 * Used in product listing pages and carousels.
 * 
 * Features:
 * - White card background with subtle shadow
 * - Product image with fallback handling
 * - Hover effects (slight scale up)
 * - Wishlist heart icon (top right corner)
 * - Product name, category, and price display
 * - Green "Add to Cart" button
 * - Responsive height using relative units
 * - Stock status handling (disables button if out of stock)
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.product - Product object from WooCommerce API
 * @param {number} props.product.id - Product ID
 * @param {string} props.product.name - Product name
 * @param {string} props.product.price - Product price
 * @param {Array} props.product.images - Array of product images
 * @param {string} props.product.stock_status - Stock status (instock/outofstock)
 */
```

---

## 📦 State & Variables

### State Variables

Always comment the purpose of state variables, especially when they're not immediately obvious:

```jsx
const ComponentName = () => {
  // Track hover state for animations
  const [isHovered, setIsHovered] = useState(false);
  
  // Wishlist functionality
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Cart functionality
  const { addToCart } = useCart();
  
  // Theme context (not used here as card is always light, but kept for future flexibility)
  const { isDark } = useTheme();
  
  // Product data state
  const [product, setProduct] = useState(null);
  const [variations, setVariations] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
};
```

### Constants

```jsx
// API endpoint for product data
const API_URL = 'https://api.example.com/products';

// Maximum number of products to load per page
const PRODUCTS_PER_PAGE = 12;

// Debounce delay for search input (in milliseconds)
const SEARCH_DEBOUNCE_MS = 300;
```

---

## 🔧 Function Documentation

### Function Comments

Every function should have a JSDoc comment explaining:
- What it does
- What parameters it accepts
- What it returns
- Any side effects

```jsx
/**
 * Format price to USD currency
 * @param {string|number} price - Price value
 * @returns {string} Formatted price string (e.g., "$29.99")
 */
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

/**
 * Toggle product in wishlist
 * Prevents event propagation to avoid triggering card click navigation
 * @param {Event} e - Click event
 */
const handleWishlistToggle = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (isInWishlist(product.id)) {
    removeFromWishlist(product.id);
  } else {
    addToWishlist(product);
  }
};

/**
 * Fetch products from WooCommerce API with optional filters
 * @param {Object} filters - Filter options
 * @param {string} filters.category - Category ID to filter by
 * @param {number} filters.per_page - Number of products per page
 * @param {string} filters.search - Search term
 * @returns {Promise<Array>} Array of product objects
 * @throws {Error} If API request fails
 */
const fetchProducts = async (filters = {}) => {
  const response = await api.get('/products', { params: filters });
  return response.data;
};
```

---

## 🎨 Inline Comments

### When to Use Inline Comments

Use inline comments to explain:
- Complex logic or algorithms
- Non-obvious code decisions
- Workarounds or hacks
- TODO items

```jsx
// Hide header when scrolling down, show when scrolling up
if (currentScrollY > lastScrollY && currentScrollY > 100) {
  setIsVisible(false);
} else {
  setIsVisible(true);
}

// Add scrolled class for styling (backdrop blur, border)
setIsScrolled(currentScrollY > 50);

// Load more products for better client-side filtering
fetchProducts({ per_page: 100 })

// Add minimum loading time to showcase skeleton loading
const [data] = await Promise.all([
  fetchProducts({ per_page: 100 }),
  new Promise(resolve => setTimeout(resolve, 500)) // Minimum 500ms loading
]);

// TODO: Add pagination support for large product catalogs
// TODO: Implement product comparison feature
```

---

## 🎯 useEffect Documentation

Always comment what each useEffect does and its dependencies:

```jsx
/**
 * Scroll effect handler
 * Hides header when scrolling down (after 100px), shows it when scrolling up
 * Also adds a scrolled state for styling changes (after 50px)
 */
useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Hide header when scrolling down, show when scrolling up
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    
    // Add scrolled class for styling
    setIsScrolled(currentScrollY > 50);
    setLastScrollY(currentScrollY);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, [lastScrollY]);

// Load initial product data on component mount
useEffect(() => {
  loadProducts();
  loadCategories();
}, []); // Empty deps = run once on mount

// Update URL parameters when filters change
useEffect(() => {
  const params = new URLSearchParams();
  if (selectedCategory) params.set('category', selectedCategory);
  if (searchTerm) params.set('search', searchTerm);
  setSearchParams(params);
}, [selectedCategory, searchTerm, setSearchParams]); // Re-run when filters change
```

---

## 📂 File Structure Comments

### Import Section

Organize imports with comments:

```jsx
// React core
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Context & hooks
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';

// Components
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Loader from '../components/Loader';

// API services
import { fetchProducts, fetchCategories } from '../api/woocommerce';

// Utilities
import { formatPrice, debounce } from '../utils/helpers';

// Styles (if using CSS modules)
import styles from './ProductListing.module.css';
```

---

## 🚫 What NOT to Comment

Don't comment obvious code:

```jsx
// ❌ BAD
// Set count to 0
const count = 0;

// Increment count by 1
setCount(count + 1);

// Call the function
handleClick();

// ✅ GOOD
// Reset counter when user completes purchase
const count = 0;

// Increment shopping cart badge count
setCount(count + 1);

// Trigger payment processing workflow
handleClick();
```

---

## 🏷️ Special Comment Tags

Use these tags for special cases:

```jsx
// TODO: Implement feature X
// FIXME: Bug in edge case when user is logged out
// HACK: Temporary workaround until API is fixed
// NOTE: This approach is required for Safari compatibility
// IMPORTANT: Do not modify without updating server-side logic
// DEPRECATED: Use newFunction() instead
```

---

## 📋 Page-Level Documentation

Every page component should document:
- Purpose of the page
- Main features
- State management approach
- API integrations
- Theme/design decisions

```jsx
/**
 * ProductListing Page
 * 
 * Main product catalog page with filtering, sorting, and search functionality.
 * Always uses light theme design (bg-gray-50).
 * 
 * Features:
 * - Fetches all products from WooCommerce API on mount
 * - Client-side filtering by category, price range, and search term
 * - Real-time search with debouncing
 * - Multiple sort options (newest, price, name, popularity)
 * - Responsive filter sidebar (desktop) / drawer (mobile)
 * - URL parameter support for deep linking
 * - Load more pagination
 * - Skeleton loading states
 * - Error handling with retry
 * - Back to top button
 * 
 * State Management:
 * - Uses React hooks (useState, useEffect, useMemo)
 * - URL search params for filter persistence
 * - Cart and Wishlist via Context API
 * 
 * API Integration:
 * - WooCommerce REST API for product data
 * - Fetches products and categories on mount
 * - Client-side filtering (no API calls on filter change)
 * 
 * @component
 */
```

---

## 🎨 CSS/Styling Comments

Comment complex Tailwind classes or custom styles:

```jsx
<div 
  className={`
    fixed top-0 left-0 right-0 z-50
    transition-all duration-300
    ${isVisible ? 'translate-y-0' : '-translate-y-full'}
    ${isScrolled 
      ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800'  // Scrolled: dark with blur
      : 'bg-gray-900/80 backdrop-blur-sm'                           // Top: semi-transparent
    }
  `}
>
  {/* Header content */}
</div>

// Complex responsive grid
<div className="
  grid
  grid-cols-1        /* Mobile: single column */
  sm:grid-cols-2     /* Tablet: two columns */
  lg:grid-cols-3     /* Desktop: three columns */
  gap-6              /* Consistent spacing */
  auto-rows-min      /* Prevent empty rows */
">
```

---

## ✅ Code Review Checklist

Before submitting code, ensure:

- [ ] Every component has a header comment
- [ ] All functions have JSDoc comments
- [ ] State variables are explained
- [ ] useEffect hooks are documented
- [ ] Complex logic has inline comments
- [ ] imports are organized and commented if needed
- [ ] No obvious code is commented
- [ ] Special tags (TODO, FIXME) are used appropriately
- [ ] Component props are documented with types
- [ ] Return values are documented

---

## 🎯 Example: Fully Documented Component

```jsx
/**
 * SearchBar Component
 * 
 * Debounced search input for product filtering.
 * Includes clear button and search icon.
 * 
 * Features:
 * - 300ms debounce delay
 * - Clear button (X) when input has value
 * - Search icon with color change on focus
 * - Green focus ring
 * - Responsive width
 * 
 * @component
 * @param {Object} props
 * @param {string} props.value - Current search term
 * @param {Function} props.onChange - Callback when search term changes
 * @param {string} props.placeholder - Placeholder text
 */
import React from 'react';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  /**
   * Handle input change with validation
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const newValue = e.target.value;
    // Prevent leading/trailing spaces
    onChange(newValue.trim());
  };

  /**
   * Clear search input
   */
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative group">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-500 group-focus-within:text-green-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
      />

      {/* Clear Button (only shown when input has value) */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-green-600 transition-colors"
          aria-label="Clear search"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
```

---

## 🚀 Benefits of Good Documentation

1. **Maintainability**: Easy to understand code months/years later
2. **Collaboration**: Team members can quickly understand your code
3. **Onboarding**: New developers can get up to speed faster
4. **Debugging**: Easier to track down issues
5. **Refactoring**: Safe to modify with clear understanding
6. **IDE Support**: Better autocomplete and type hints

---

## 📚 Additional Resources

- [JSDoc Official Documentation](https://jsdoc.app/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

---

**Remember**: Good code is self-documenting, but great code has clear comments explaining the "why" behind the "what"!

