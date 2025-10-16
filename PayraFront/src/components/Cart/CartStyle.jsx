import { X, Plus, Minus } from 'lucide-react';

export const CartStyle = ({
  items,
  closeCart,
  handleIncrement,
  handleDecrement,
  handleRemoveItem,
  handleCheckout,
  subtotal,
  loading, 
}) => {

  const getPanelWidthClasses = items.length === 0 
    ? 'w-full md:w-[400px]' 
    : 'w-full md:w-[500px] lg:w-[600px]';

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40 animate-fade-in"
        onClick={closeCart}
      />

      {/* Cart Panel */}
      <div
        className={`fixed right-0 top-0 h-full bg-[#edf8ee] z-50 shadow-2xl flex flex-col animate-slide-in-right ${getPanelWidthClasses}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-gray-800" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && <div className="text-center">Updating Cargo Hold...</div>}
          {!loading && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-600 text-lg mb-2">Your cargo hold is empty.</p>
              <p className="text-gray-500 text-sm">Add some items from the marketplace!</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product._id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <img
                    src={item.product.images[0]?.url} // Path to image
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0 mr-2">
                        <h3 className="font-semibold text-gray-800 truncate">{item.product.name}</h3> {/* Path to name */}
                        <p className="text-sm text-gray-500">{item.product.category}</p> {/* Path to category */}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.product._id)} // Pass product ID
                        className="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>

                    {/* Quantity Controls and Price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDecrement(item.product._id, item.quantity)} // Pass product ID
                          disabled={item.quantity <= 1 || loading}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        {/* Display the quantity directly from the state */}
                        <span className="w-10 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleIncrement(item.product._id, item.quantity)} // Pass product ID
                          disabled={item.quantity >= 100 || loading}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ${(item.product.price * item.quantity).toFixed(2)} {/* Path to price */}
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
          <div className="border-t border-gray-300 p-6 space-y-4 bg-white">
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold text-gray-800">Subtotal:</span>
              <span className="font-bold text-green-700 text-xl">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full h-12 text-base font-semibold bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};