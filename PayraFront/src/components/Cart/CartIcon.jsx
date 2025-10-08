import { ShoppingCart } from 'lucide-react';
import { useCart } from './CartLogic';

const CartIcon = () => {
  const { getItemCount, toggleCart } = useCart();
  const itemCount = getItemCount();

  return (
    <button
      onClick={toggleCart}
      className="fixed top-6 right-6 z-30 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
      aria-label="Open cart"
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-scale-in">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
