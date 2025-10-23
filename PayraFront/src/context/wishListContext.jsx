import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api.js'; // This path is correct. Default export assumed based on last check.
import { useAuth } from './authContext.jsx'; 
import { useToast } from '../components/ToastSystem.jsx'; // Corrected path assumption

// 1. Create the Context
const WishlistContext = createContext();

// 2. Create the Provider Component
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set()); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([]);
      setWishlistIds(new Set());
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/wishlist');
      if (data && Array.isArray(data.products)) {
        setWishlistItems(data.products);
        setWishlistIds(new Set(data.products.map(item => item._id)));
      } else {
        setWishlistItems([]);
        setWishlistIds(new Set());
      }
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      setError("Could not retrieve your wishlist.");
    } finally {
      setLoading(false);
    }
  }, [user]); 

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    if (!user) {
      addToast("You must be logged in to add to wishlist.", "error");
      return;
    }
    if (wishlistIds.has(productId)) {
      addToast("Item is already in your wishlist.", "info");
      return;
    }

    // --- DIAGNOSTIC LOG ---
    console.log(`[WishlistContext] Attempting to ADD product ID: ${productId}`); 
    // --- END DIAGNOSTIC ---

    try {
      const { data } = await API.post(`/wishlist/${productId}`);
      
      if (data && Array.isArray(data.products)) {
        setWishlistItems(data.products);
        setWishlistIds(new Set(data.products.map(item => item._id)));
      }
      addToast("Added to wishlist!", "success");

    } catch (err) {
      console.error("Failed to add to wishlist:", err);
      addToast("Could not add item to wishlist.", "error");
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!wishlistIds.has(productId)) return; 

    // --- DIAGNOSTIC LOG ---
    console.log(`[WishlistContext] Attempting to REMOVE product ID: ${productId}`); 
    // --- END DIAGNOSTIC ---

    try {
      const { data } = await API.delete(`/wishlist/${productId}`);
      
      if (data && Array.isArray(data.products)) {
        setWishlistItems(data.products);
        setWishlistIds(new Set(data.products.map(item => item._id)));
      }
      addToast("Removed from wishlist", "success");

    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      addToast("Could not remove item.", "error");
    }
  };

  const value = {
    wishlistItems,    
    wishlistIds,      
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    fetchWishlist     
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

