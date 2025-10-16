import React, { useState, useEffect, useCallback } from 'react';

const EnhancedSearchBar = ({ onSearch, placeholder = "Search for hookahs or accessories..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search logic
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (term) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onSearch(term);
        }, 300);
      };
    })(),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="relative z-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative">
          {/* Glassmorphism search container */}
          <div className={`relative bg-white/10 backdrop-blur-md border border-white/20 rounded-full transition-all duration-500 ${
            isFocused 
              ? 'shadow-2xl shadow-green-400/30 border-green-400/50 bg-white/15' 
              : 'shadow-lg shadow-black/20 hover:bg-white/12'
          }`}>
            
            {/* Search icon */}
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <svg 
                className={`h-6 w-6 transition-all duration-300 ${
                  isFocused ? 'text-green-400 scale-110' : 'text-white/70'
                }`} 
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
            
            {/* Search input */}
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className={`w-full pl-16 pr-16 py-4 bg-transparent text-white placeholder-white/60 focus:outline-none text-lg font-medium transition-all duration-300 ${
                isFocused ? 'placeholder-white/80' : ''
              }`}
            />
            
            {/* Clear button */}
            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-6 flex items-center text-white/60 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Search status */}
          {searchTerm && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-sm">
                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Searching for "{searchTerm}"...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearchBar;
