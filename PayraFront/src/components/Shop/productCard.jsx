import React from 'react';
import { useCart } from '../Cart/CartLogic';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from "lucide-react";
// --- 1. Import Wishlist and Auth hooks ---
import { useWishlist } from '../../context/wishListContext';
import { useAuth } from '../../context/authContext.jsx';

const ProductCard = ({ product }) => {
  if (!product) {
    return null; 
  }

  const { addItem } = useCart();
  const navigate = useNavigate();
  // --- 2. Get Wishlist state and Auth state ---
  const { wishlistIds, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();

  // Check if this product is in the user's wishlist
  const isWishlisted = wishlistIds.has(product._id);

  const handleQuickAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click
    
    const itemToAdd = {
      id: product._id,
      quantity: 1,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url,
    };
    
    addItem(itemToAdd);
    // You should use a toast notification here instead of console.log
    // addToast(`${itemToAdd.name} added to cargo hold!`, "success");
    console.log(`${itemToAdd.name} added to cargo hold!`);
  };

  // --- 3. New handler for Wishlist button ---
  const handleWishlistToggle = (e) => {
    e.stopPropagation(); // Prevent card click
    
    if (!user) {
      // addToast("Please log in to use your wishlist.", "error");
      console.error("Please log in to use your wishlist.");
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* --- IMAGE SECTION --- */}
      <div className="relative">
        <img 
          src={product.images[0]?.url || 'https://placehold.co/300x300/eee/ccc?text=No+Image'} 
          alt={product.name} 
          className="w-full h-64 object-cover"
          onError={(e) => e.target.src = 'https://placehold.co/300x300/eee/ccc?text=No+Image'}
        />
        {product.sale && (
          <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Sale
          </span>
        )}
        {/* --- 4. MODIFICATION: Use inStock as a Number --- */}
        <span
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
            product.inStock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {product.inStock > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* --- DETAILS SECTION --- */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-gray-900 mb-1 flex-grow">{product.name}</h3>
        {/* This field 'author' might not exist on all products, check your model */}
        <p className="text-sm text-gray-600 mb-2 h-10">{product.details?.author || product.subcategory}</p>

        {/* --- RATING / REVIEWS UI --- */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-1 text-sm text-gray-600">
              {product.rating || 0} ({product.reviews || 0} Reviews)
            </span>
          </div>
        </div>

        {/* --- PRICE UI  --- */}
        <div className="mb-4"> 
          <span className="text-lg font-bold text-gray-900">{product.price} BDT</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="ml-2 text-sm text-gray-500 line-through">{product.originalPrice} BDT</span>
          )}
        </div>
        
        <div className="flex-grow" />

        {/* --- ACTION BUTTONS (ADD TO CART & WISHLIST) --- */}
        <div className="flex items-center space-x-2 mt-auto">
          <button
            onClick={handleQuickAddToCart}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              product.inStock > 0
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!(product.inStock > 0)}
          >
            + Add To Cart
          </button>
          
          {/* --- 5. WISHLIST BUTTON (Updated) --- */}
          <button 
            className={`p-2 border rounded-md transition-colors ${
              isWishlisted 
                ? "bg-red-50 border-red-300" 
                : "border-gray-300 hover:bg-gray-50"
            }`}
            onClick={handleWishlistToggle}
            disabled={!user} // Disable if not logged in
            title={!user ? "Log in to add to wishlist" : (isWishlisted ? "Remove from wishlist" : "Add to wishlist")}
          >
            <Heart className={`w-4 h-4 ${
              isWishlisted 
                ? "text-red-500 fill-current" 
                : "text-gray-600"
            }`} />
          </button>
          {/* --- END OF UPDATE --- */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

