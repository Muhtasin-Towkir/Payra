import { X, Plus, Minus } from 'lucide-react';

// This component receives ALL data and handlers via props.
export const CartStyle = ({
  items,
  closeCart,
  handleQuantityChange,
  handleIncrement,
  handleDecrement,
  handleRemoveItem,
  handleCheckout,
  quantities,
  subtotal,
}) => {

  const getPanelWidthClasses = items.length === 0 
    ? 'w-full md:w-[400px]' 
    : 'w-full md:w-[500px] lg:w-[600px]';

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-white/30 z-40 animate-fade-in md:block hidden"
        onClick={closeCart}
      />

      {/* Cart Panel */}
      <div
        className={`fixed right-0 top-0 h-full bg-[#edf8ee] z-50 shadow-2xl flex flex-col animate-slide-in-right ${getPanelWidthClasses}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Shopping Cart</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground text-lg mb-2">Your cart is empty</p>
              <p className="text-muted-foreground text-sm">Add some products to get started!</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-background rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0 mr-2">
                        <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 hover:bg-destructive/10 rounded transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </button>
                    </div>

                    {/* Quantity Controls and Price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDecrement(item.id, item.quantity)}
                          disabled={item.quantity <= 1}
                          className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4 text-foreground" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          // Use the local quantity state for controlled input
                          value={quantities[item.id] ?? item.quantity} 
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className="w-16 text-center"
                        />
                        <button
                          onClick={() => handleIncrement(item.id, item.quantity)}
                          disabled={item.quantity >= 100}
                          className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4 text-foreground" />
                        </button>
                      </div>
                      <p className="font-semibold text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Subtotal and Checkout */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4 bg-background">
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold text-foreground">Subtotal:</span>
              <span className="font-bold text-primary text-xl">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};