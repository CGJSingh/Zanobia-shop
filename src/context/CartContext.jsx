import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Cart context
const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      console.log('ADD_TO_CART reducer called with:', action.payload); // Debug log
      const existingItem = state.items.find(item => item.id === action.payload.id);
      const quantityToAdd = action.payload.quantity || 1;
      
      if (existingItem) {
        console.log('Updating existing item:', existingItem); // Debug log
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + quantityToAdd }
              : item
          )
        };
      }
      console.log('Adding new item to cart'); // Debug log
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: quantityToAdd }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case 'LOAD_CART':
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
  isOpen: false,
  userId: null
};

// Helper function to get cart storage key for user
const getCartKey = (userId) => {
  return userId ? `cart_user_${userId}` : 'cart_guest';
};

// Cart provider component - Inner component that has access to auth
const CartProviderInner = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Get current user ID
  const currentUserId = isAuthenticated && user?.id ? user.id : null;

  // Load cart from localStorage when user changes
  useEffect(() => {
    const cartKey = getCartKey(currentUserId);
    const savedCart = localStorage.getItem(cartKey);
    
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        dispatch({ type: 'LOAD_CART', payload: [] });
      }
    } else {
      dispatch({ type: 'LOAD_CART', payload: [] });
    }

    dispatch({ type: 'SET_USER_ID', payload: currentUserId });
  }, [currentUserId]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const cartKey = getCartKey(currentUserId);
    localStorage.setItem(cartKey, JSON.stringify(state.items));
  }, [state.items, currentUserId]);

  // Calculate total items
  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const totalPrice = state.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Cart actions
  const addToCart = (product) => {
    console.log('Adding to cart:', product); // Debug log
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const value = {
    ...state,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    userId: currentUserId
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Wrapper component that doesn't need auth
export const CartProvider = ({ children }) => {
  return <CartProviderInner>{children}</CartProviderInner>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
