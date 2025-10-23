import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../../api'; // Axios
import { useAuth } from '../../context/authContext'; // Get logged user

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // This effect fetches the user's cart from the backend when they log in
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const { data } = await API.get('/cart');
        setItems(data.cart || []);
      } catch (error) {
        console.error("Failed to fetch user's cart.", error);
        setItems([]);
      }
      setLoading(false);
    };

    if (user) {
      fetchCart(); // If a user is logged in, fetch their cart
    } else {
      setItems([]); // If user logs out, clear the cart from the state
    }
  }, [user]); // This runs every time the user logs in or out

  // Now communicate with the backend ---

  const addItem = async (itemToAdd) => {
    if (!user) {
      // Replaced alert with console warning as per your request
      console.warn("You must be logged in to add items to your cargo hold.");
      // You might want to trigger a login modal here
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/cart', {
        productId: itemToAdd.id,
        quantity: itemToAdd.quantity,
        // Send size if it exists
        ...(itemToAdd.size && { size: itemToAdd.size }),
      });
      setItems(data.cart); // Update frontend state with the new cart from the backend
    } catch (error) {
      console.error("Failed to add item to cart.", error);
    }
    setLoading(false);
  };

  const removeItem = async (productId) => {
    setLoading(true);
    try {
      const { data } = await API.delete(`/cart/${productId}`);
      setItems(data.cart);
    } catch (error) {
      console.error("Failed to remove item from cart.", error);
    }
    setLoading(false);
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.put(`/cart/${productId}`, { quantity });
      setItems(data.cart);
    } catch (error) {
      console.error("Failed to update item quantity.", error);
    }
    setLoading(false);
  };

  const clearCart = () => {
    setItems([]);
  };

  // UI control functions
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  // Calculated values can also remain
  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };
  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = {
    items, isOpen, loading,
    addItem, removeItem, updateQuantity,
    openCart, closeCart, toggleCart,
    getSubtotal, getItemCount,
    clearCart, // <-- Export the new function
  };

  return (
    <CartContext.Provider value={value}>
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

