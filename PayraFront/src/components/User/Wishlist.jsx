import React, { useState, useEffect } from 'react';
import API from '/src/api.js'; 
import { useToast } from '../ToastSystem';
import { Loader2, AlertTriangle, Heart, X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

// Helper to format price
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      // This endpoint gets the user's wishlist (and populates product details)
      const { data } = await API.get('/wishlist');
      if (data && data.products) {
        setWishlistItems(data.products);
      } else {
        setWishlistItems([]); // Handle empty or unexpected response
      }
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      setError("Could not retrieve your wishlist.");
      addToast("Failed to fetch wishlist", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []); 

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await API.delete(`/wishlist/${productId}`);
      
      setWishlistItems(prevItems => prevItems.filter(item => item._id !== productId));
      
      addToast("Item removed from wishlist", "success");
    } catch (err) {
      console.error("Failed to remove item from wishlist:", err);
      addToast("Failed to remove item", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">My Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Your wishlist is empty.</p>
          <p className="text-sm mt-2">Find products you love and add them!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <div 
              key={product._id} 
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col"
            >
              <div className="relative">
                <Link to={`/product/${product._id}`} className="block">
                  <img 
                    src={product.images[0]?.url || 'https://placehold.co/300x300/eee/ccc?text=No+Image'}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                    onError={(e) => e.target.src = 'https://placehold.co/300x300/eee/ccc?text=No+Image'}
                  />
                </Link>
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition shadow-md"
                  aria-label="Remove from wishlist"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  <Link to={`/product/${product._id}`} className="hover:text-blue-600">
                    {product.name}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                
                <div className="flex-1" /> 
                
                <div className="flex justify-between items-center mt-4">
                  <p className="text-xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </p>
                  <Link 
                    to={`/product/${product._id}`}
                    className="flex items-center gap-1.5 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200 transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
