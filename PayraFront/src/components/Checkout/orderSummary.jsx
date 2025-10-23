import React from 'react';

const OrderSummary = ({ cartItems, subtotal, shippingPrice, totalPrice, loading }) => {
  return (
    <div className="lg:col-span-1">
      <div className="border border-border rounded-lg p-6 bg-card sticky top-8">
        <h2 className="text-xl font-bold mb-6 text-foreground">Your order</h2>
        
        {/* Cart Items */}
        <div className="space-y-4 mb-6 pb-6 border-b border-border">
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{item.product.name} &times; {item.quantity}</p>
              </div>
              <p className="font-medium text-sm text-foreground">৳{(item.product.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
        
        {/* Subtotal, Shipping, Total */}
        <div className="flex justify-between mb-4 pb-4 border-b border-border"><span className="text-sm">Subtotal</span><span className="font-medium">৳{subtotal.toLocaleString()}</span></div>
        <div className="flex justify-between mb-6 pb-6 border-b border-border"><span className="text-sm">Shipping</span><span className="font-medium">৳{shippingPrice.toLocaleString()}</span></div>
        <div className="flex justify-between font-bold text-lg mb-6"><span>Total</span><span>৳{totalPrice.toLocaleString()}</span></div>

        {/* --- PAYMENT METHODS RESTORED --- */}
        <div className="space-y-3 mb-6 pb-6 border-b border-border">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="payment" value="Online" defaultChecked className="w-4 h-4 accent-accent" />
            <span className="text-sm text-foreground">Pay Online/Credit/Debit</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="payment" value="COD" className="w-4 h-4 accent-accent" />
            <span className="text-sm text-foreground">Cash on Delivery</span>
          </label>
        </div>
        {/* ---------------------------------- */}
        
        {/* SSLCommerz Badge and Privacy Notice */}
        <div className="mb-6 p-3 bg-input rounded-lg"><p className="text-xs text-muted-foreground mb-2">Pay securely by Credit/Debit card... through SSLCommerz.</p><div className="flex items-center gap-2"><span className="text-xs font-medium">Powered by</span><span className="text-xs font-bold text-accent">SSLCommerz</span></div></div>
        <p className="text-xs text-muted-foreground mb-6">Your personal data will be used to process your order...</p>
        
        {/* The submit button is now part of this component */}
        <button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 rounded-lg transition-colors" disabled={loading}>
          {loading ? "Transmitting Order..." : "Place order"}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;

