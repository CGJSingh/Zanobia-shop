import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Loader, Navigation, X } from 'lucide-react';
import { searchAddress, getUserLocationAddress, formatAddressDisplay } from '../api/address';

/**
 * AddressAutocomplete Component
 * 
 * Live address search with dropdown suggestions
 * Only shows addresses from Canada and United States
 * Supports geolocation to auto-fill current address
 * 
 * @component
 */
export default function AddressAutocomplete({
  value = '',
  onChange,
  onAddressSelect,
  placeholder = 'Start typing your address...',
  country = 'CA',
  label,
  required = false,
  error = '',
  disabled = false,
  className = '',
  showUseLocation = true
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Update query when value prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Handle search with debouncing
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if query is too short
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchAddress(query, country);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (error) {
        console.error('Address search failed:', error);
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, country]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange?.(newValue);
    setSelectedIndex(-1);
  };

  const handleSelectAddress = (suggestion) => {
    const formattedAddress = formatAddressDisplay(suggestion.address);
    setQuery(formattedAddress);
    onChange?.(formattedAddress);
    onAddressSelect?.(suggestion.address);
    setShowDropdown(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectAddress(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const address = await getUserLocationAddress();
      const formattedAddress = formatAddressDisplay(address);
      setQuery(formattedAddress);
      onChange?.(formattedAddress);
      onAddressSelect?.(address);
    } catch (error) {
      console.error('Failed to get location:', error);
      alert(error.message || 'Failed to get your current location');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleClearInput = () => {
    setQuery('');
    onChange?.('');
    onAddressSelect?.(null);
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        <div className="relative">
          {/* Search Icon */}
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          
          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 3 && suggestions.length > 0 && setShowDropdown(true)}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full pl-12 pr-${showUseLocation ? '24' : '12'} py-3.5 
                       bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-white 
                       placeholder-gray-400 dark:placeholder-gray-500
                       border-2 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-offset-0
                       transition-all duration-200
                       ${error 
                         ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20' 
                         : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20'
                       }
                       ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
                       ${isSearching ? 'pr-12' : ''}`}
          />

          {/* Loading Spinner */}
          {isSearching && (
            <Loader className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 animate-spin" />
          )}

          {/* Clear Button */}
          {query && !isSearching && !disabled && (
            <button
              type="button"
              onClick={handleClearInput}
              className="absolute right-${showUseLocation ? '12' : '4'} top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}

          {/* Use Current Location Button */}
          {showUseLocation && !disabled && (
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isGettingLocation}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg 
                       text-indigo-600 dark:text-indigo-400 
                       hover:bg-indigo-50 dark:hover:bg-indigo-900/30 
                       transition-colors disabled:opacity-50"
              title="Use my current location"
            >
              {isGettingLocation ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Dropdown Suggestions */}
        <AnimatePresence>
          {showDropdown && suggestions.length > 0 && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 
                       rounded-xl shadow-xl border border-gray-200 dark:border-gray-700
                       overflow-hidden max-h-64 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleSelectAddress(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0
                             transition-colors duration-150
                             ${selectedIndex === index 
                               ? 'bg-indigo-50 dark:bg-indigo-900/30' 
                               : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                             }`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className={`w-4 h-4 mt-1 flex-shrink-0 ${
                      selectedIndex === index 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {suggestion.address.street && suggestion.address.houseNumber 
                          ? `${suggestion.address.houseNumber} ${suggestion.address.street}`
                          : suggestion.address.street || suggestion.address.city
                        }
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {[
                          suggestion.address.city,
                          suggestion.address.state,
                          suggestion.address.postalCode
                        ].filter(Boolean).join(', ')}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {suggestion.address.country === 'CA' ? '🍁 Canada' : '🇺🇸 United States'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </motion.p>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Type at least 3 characters to search for addresses in {country === 'CA' ? 'Canada' : 'United States'}
        </p>
      )}
    </div>
  );
}


