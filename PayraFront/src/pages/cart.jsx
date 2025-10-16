import { useCart } from '../components/Cart/CartLogic';
import { CartStyle } from '../components/Cart/CartStyle';

export const CartContainer = () => {
  // Get everything directly from the hook
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    loading, // Pass loading state to the UI
  } = useCart();

  if (!isOpen) {
    return null;
  }

  // Define simple handlers that call the functions from the context
  const handleIncrement = (id, currentQty) => updateQuantity(id, currentQty + 1);
  const handleDecrement = (id, currentQty) => updateQuantity(id, currentQty - 1);

  // Render the presentation component, passing down the data and handlers
  return (
    <CartStyle
      items={items}
      closeCart={closeCart}
      handleIncrement={handleIncrement}
      handleDecrement={handleDecrement}
      handleRemoveItem={removeItem} // Pass the function directly
      handleCheckout={() => { /* Implement checkout logic */ }}
      subtotal={getSubtotal()}
      loading={loading}
    />
  );
};

export default CartContainer;