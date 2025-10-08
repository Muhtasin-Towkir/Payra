import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const CartContext = createContext(undefined);

const CART_STORAGE_KEY = 'cart';

export const CartProvider = ({ children }) => {
  // 1. CONSOLIDATED INITIALIZATION: Load items from localStorage ONLY ONCE
  const [items, setItems] = useState(() => {
    try {
        const storedItems = localStorage.getItem(CART_STORAGE_KEY);
        // Returns saved items or an empty array
        return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  
  // Ref to track the initial mount
  const isInitialMount = useRef(true);

  // 2. SAVE EFFECT: Saves cart only when 'items' changes AND after initial mount
  useEffect(() => {
    // Skip the first execution of this effect (the initial load)
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return; 
    }

    // Only save the cart if the state has truly been modified post-load
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    
  }, [items]);

  const addItem = (itemToAdd) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === itemToAdd.id);
      
      if (existingItem) {
        // Corrected: Increment the quantity
        return prevItems.map((i) =>
          i.id === itemToAdd.id
            ? { ...i, quantity: i.quantity + itemToAdd.quantity }
            : i
        );
      }
      
      // New item: add it
      return [...prevItems, itemToAdd];
    });
  };

  const removeItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1 || quantity > 100) return;
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addItem,
        removeItem,
        updateQuantity,
        openCart,
        closeCart,
        toggleCart,
        getSubtotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};