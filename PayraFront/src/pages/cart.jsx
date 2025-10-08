import { useCart } from '../components/Cart/CartLogic';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartStyle } from '../components/Cart/CartStyle'; // Import the UI component

export const CartContainer = () => {
  //CORE HOOKS: MUST BE AT THE TOP
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeItem, 
    updateQuantity, 
    getSubtotal 
  } = useCart();

  console.log("CartContainer Rendering. isOpen:", isOpen);

  
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState({}); 

  // HANDLERS (useCallback): MUST BE BEFORE CONDITIONAL RETURN

  const handleQuantityChange = useCallback((id, value) => {
    setQuantities(prev => ({ ...prev, [id]: value }));
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
      updateQuantity(id, numValue);
    }
  }, [updateQuantity]); // Depend on updateQuantity from context

  const handleIncrement = useCallback((id, currentQty) => {
    if (currentQty < 100) {
      updateQuantity(id, currentQty + 1);
    }
  }, [updateQuantity]);

  const handleDecrement = useCallback((id, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  }, [updateQuantity]);

  const handleRemoveItem = useCallback((id) => {
    removeItem(id);
  }, [removeItem]);

  const handleCheckout = useCallback(() => {
    closeCart();
    navigate('/checkout');
  }, [closeCart, navigate]);

  // --- CALCULATE VALUES ---
  const subtotal = getSubtotal();

  // --- CONDITIONAL RETURN: AFTER ALL HOOKS ---
  if (!isOpen) {
    return null;
  }

  // --- Render Presentation Component ---
  return (
    <CartStyle // Assuming CartStyle was a typo for CartStyle
      items={items}
      closeCart={closeCart}
      handleQuantityChange={handleQuantityChange}
      handleIncrement={handleIncrement}
      handleDecrement={handleDecrement}
      handleRemoveItem={handleRemoveItem}
      handleCheckout={handleCheckout}
      quantities={quantities}
      subtotal={subtotal}
    />
  );
};

export default CartContainer;