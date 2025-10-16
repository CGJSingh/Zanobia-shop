# Light-Themed Products Page - Implementation Guide

## Overview
This is a clean, light-themed product listing page with WooCommerce integration, built with React and Tailwind CSS. The page features a modern, minimal design with white backgrounds, subtle shadows, and green accent colors.

## 🎨 Design Features

### Visual Design
- **Clean White Background**: Light gray (`bg-gray-50`) base with white product cards
- **Subtle Shadows**: Product cards use `shadow-sm` with hover `shadow-md`
- **Rounded Corners**: All cards use `rounded-xl` for modern aesthetics
- **Green Accents**: Primary CTA buttons and interactive elements use `bg-green-600`
- **Responsive Grid**: 1-4 column layout depending on screen size

### Components

#### 1. **ProductsPage.jsx** (`/src/pages/ProductsPage.jsx`)
Main container component with:
- Product fetching from WooCommerce API
- Client-side filtering (categories, price, colors)
- Sorting functionality
- Pagination with "Load More" option
- Responsive layout with sidebar

**Route**: `/products-light`

#### 2. **LightProductCard.jsx** (`/src/components/LightProductCard.jsx`)
Individual product card featuring:
- Square aspect ratio product image
- Hover zoom effect on image
- Heart icon for wishlist (appears on hover)
- Green "Add to Cart" button
- Price display with sale price support
- Featured/Sale badges
- Clean white background with border

#### 3. **FiltersSidebar.jsx** (`/src/components/FiltersSidebar.jsx`)
Sticky sidebar with filters:
- **Categories**: Checkbox list (auto-populated from WooCommerce)
- **Price Range**: Slider from $0-$1000
- **Colors**: Color dot selector (only shows colors from product attributes)
- **Sort By**: Dropdown (Date, Popularity, Name, Price)
- Collapsible sections with chevron icons
- "Clear All" button

## 🚀 Setup & Usage

### 1. Access the Page
Navigate to:
```
http://localhost:3000/products-light
```

### 2. WooCommerce API Configuration
The page uses the existing WooCommerce API setup in `/src/api/woocommerce.js`:

```javascript
import { fetchProducts, fetchCategories } from '../api/woocommerce';
```

**API Configuration** (already configured in your project):
- Base URL: `https://go.zanobiaonline.com/wp-json/wc/v3`
- Consumer Key & Secret: Set in `/src/config/api.js`

### 3. Environment Variables
Ensure these are set in your `.env` file:
```env
VITE_WOOCOMMERCE_URL=https://go.zanobiaonline.com/wp-json/wc/v3
VITE_WOOCOMMERCE_CONSUMER_KEY=your_consumer_key
VITE_WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret
```

## 📋 Features

### Filtering
- **Categories**: Multi-select checkboxes
- **Price Range**: Slider with live updates
- **Colors**: Only displays colors that exist in product attributes
- **Real-time Updates**: Filters apply instantly without page reload

### Sorting Options
- Newest First (default)
- Most Popular
- Name A-Z
- Price: Low to High
- Price: High to Low

### Pagination
- **Load More**: Shows more products when clicked (12 per page)
- **Page Numbers**: Traditional pagination after all products loaded
- Auto-scroll to top on page change

### Responsive Behavior
- **Mobile (< 640px)**: 1 column grid, filters in mobile drawer
- **Tablet (640px - 1024px)**: 2 columns
- **Desktop (1024px - 1280px)**: 3 columns
- **Large Desktop (> 1280px)**: 4 columns

## 🎯 Key Differences from Dark Theme Page

| Feature | Dark Page (`/products`) | Light Page (`/products-light`) |
|---------|-------------------------|--------------------------------|
| Background | Dark gray (`#121212`) | Light gray (`#f9fafb`) |
| Cards | Dark with glow effects | White with subtle shadows |
| Text | White/Light gray | Dark gray/Black |
| Buttons | Dark with green glow | Clean green (`bg-green-600`) |
| Filters | Glassy dark theme | Clean white sidebar |
| Icons | Neon/glow effects | Simple, clean SVGs |

## 🛠️ Customization

### Change Primary Color
In `LightProductCard.jsx` and `ProductsPage.jsx`, replace `green-600` with your color:
```javascript
className="bg-green-600 hover:bg-green-700"
// Change to:
className="bg-blue-600 hover:bg-blue-700"
```

### Adjust Products Per Page
In `ProductsPage.jsx`:
```javascript
const [productsPerPage] = useState(12); // Change to 16, 20, etc.
```

### Modify Price Range
In `ProductsPage.jsx` and `FiltersSidebar.jsx`:
```javascript
const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
// Change max to 2000, 5000, etc.
```

### Add More Filters
To add a new filter (e.g., size):
1. Add state in `ProductsPage.jsx`
2. Add filter logic in `applyFilters()`
3. Add UI in `FiltersSidebar.jsx`
4. Pass props through component hierarchy

## 📱 Mobile Optimization

The page is fully responsive with:
- Touch-friendly tap targets (minimum 44x44px)
- Optimized image loading
- Smooth scroll behavior
- Mobile-friendly filter sidebar (can be converted to drawer)

### Add Mobile Filter Drawer (Optional)
To convert sidebar to a mobile drawer, wrap `FiltersSidebar` in a conditional:
```jsx
{isMobileFilterOpen && (
  <div className="fixed inset-0 z-50 lg:hidden">
    <div className="bg-black/50" onClick={closeMobileFilter} />
    <div className="bg-white h-full w-80 p-6 overflow-y-auto">
      <FiltersSidebar {...props} />
    </div>
  </div>
)}
```

## 🔧 Technical Details

### State Management
- Uses React `useState` and `useEffect` hooks
- Context API for Cart and Wishlist (shared with dark theme)
- Client-side filtering for instant updates

### Performance Optimizations
- Fetches all products once on mount
- Client-side filtering (no API calls on filter change)
- Image lazy loading with `ImageWithFallback` component
- Debounced filter updates (can be added if needed)

### Accessibility
- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast meets WCAG AA standards

## 🐛 Troubleshooting

### Products Not Loading
1. Check WooCommerce API credentials in `.env`
2. Verify API endpoint is accessible
3. Check browser console for CORS errors
4. Ensure WooCommerce REST API is enabled

### Colors Not Showing
- Colors are extracted from product attributes with name containing "color" or "colour"
- Ensure your WooCommerce products have color attributes set
- Check console for extracted colors: `console.log(availableColors)`

### Filters Not Working
1. Check that products have categories assigned
2. Verify price values are numbers
3. Check filter state in React DevTools
4. Ensure `applyFilters()` is called on state changes

## 📚 Component Props

### ProductsPage
No props (standalone page component)

### LightProductCard
```typescript
interface Props {
  product: {
    id: number;
    name: string;
    price: string;
    regular_price?: string;
    sale_price?: string;
    images: Array<{ src: string }>;
    categories: Array<{ id: number; name: string }>;
    stock_status: 'instock' | 'outofstock';
    featured?: boolean;
    on_sale?: boolean;
  }
}
```

### FiltersSidebar
```typescript
interface Props {
  products: Product[];
  selectedCategories: string[];
  selectedColors: string[];
  priceRange: { min: number; max: number };
  sortBy: string;
  onCategoryChange: (categoryId: string) => void;
  onColorChange: (color: string) => void;
  onPriceChange: (range: { min: number; max: number }) => void;
  onSortChange: (sortBy: string) => void;
  onClearFilters: () => void;
}
```

## 🎨 Tailwind Classes Reference

### Primary Colors
- Background: `bg-green-600`
- Hover: `hover:bg-green-700`
- Text: `text-green-600`
- Border: `border-green-600`

### Grays (Light Theme)
- Page Background: `bg-gray-50`
- Card Background: `bg-white`
- Border: `border-gray-200`
- Text Primary: `text-gray-900`
- Text Secondary: `text-gray-600`

## 🚀 Future Enhancements

Potential improvements:
- [ ] Add search functionality
- [ ] Implement category-based filters from attributes
- [ ] Add product quick view modal
- [ ] Implement infinite scroll
- [ ] Add breadcrumb navigation
- [ ] Add "Compare Products" feature
- [ ] Add product ratings/reviews display
- [ ] Implement URL-based filter state (deep linking)
- [ ] Add filter animations
- [ ] Add skeleton loaders

## 📞 Support

For questions or issues:
1. Check existing documentation
2. Review WooCommerce REST API docs
3. Check console for errors
4. Verify API connectivity with Postman/curl

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-07  
**Author**: ZANOBIA Development Team

