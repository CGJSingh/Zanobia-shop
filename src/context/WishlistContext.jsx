import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Wishlist context
const WishlistContext = createContext();

// Wishlist reducer
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state; // Item already in wishlist
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: []
      };

    case 'LOAD_WISHLIST':
      return {
        ...state,
        items: action.payload || []
      };

    case 'SET_USER_ID':
      return {
        ...state,
        userId: action.payload
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
  userId: null
};

// Helper function to get wishlist storage key for user
const getWishlistKey = (userId) => {
  return userId ? `wishlist_user_${userId}` : 'wishlist_guest';
};

// Wishlist provider component - Inner component that has access to auth
const WishlistProviderInner = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Get current user ID
  const currentUserId = isAuthenticated && user?.id ? user.id : null;

  // Load wishlist from localStorage when user changes
  useEffect(() => {
    const wishlistKey = getWishlistKey(currentUserId);
    const savedWishlist = localStorage.getItem(wishlistKey);
    
    if (savedWishlist) {
      try {
        const wishlistData = JSON.parse(savedWishlist);
        dispatch({ type: 'LOAD_WISHLIST', payload: wishlistData });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
        dispatch({ type: 'LOAD_WISHLIST', payload: [] });
      }
    } else {
      dispatch({ type: 'LOAD_WISHLIST', payload: [] });
    }

    dispatch({ type: 'SET_USER_ID', payload: currentUserId });
  }, [currentUserId]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    const wishlistKey = getWishlistKey(currentUserId);
    localStorage.setItem(wishlistKey, JSON.stringify(state.items));
  }, [state.items, currentUserId]);

  // Wishlist actions
  const addToWishlist = (product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const isInWishlist = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const value = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    userId: currentUserId
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Wrapper component that doesn't need auth
export const WishlistProvider = ({ children }) => {
  return <WishlistProviderInner>{children}</WishlistProviderInner>;
};

// Custom hook to use wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
