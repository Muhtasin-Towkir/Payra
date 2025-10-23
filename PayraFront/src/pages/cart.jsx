import { useCart } from '../components/Cart/CartLogic';
import { CartStyle } from '../components/Cart/CartStyle';
import { useNavigate } from 'react-router-dom';

export const CartContainer = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    loading,
  } = useCart();
  
  const navigate = useNavigate(); 

  if (!isOpen) {
    return null;
  }

  const handleIncrement = (id, currentQty) => updateQuantity(id, currentQty + 1);
  const handleDecrement = (id, currentQty) => updateQuantity(id, currentQty - 1);

  // This function will now close the cart and navigate to the Place Order page.
  const handleCheckout = () => {
    closeCart();
    navigate('/placeOrder');
  };

  return (
    <CartStyle
      items={items}
      closeCart={closeCart}
      handleIncrement={handleIncrement}
      handleDecrement={handleDecrement}
      handleRemoveItem={removeItem}
      handleCheckout={handleCheckout}
      subtotal={getSubtotal()}
      loading={loading}
    />
  );
};

export default CartContainer;
