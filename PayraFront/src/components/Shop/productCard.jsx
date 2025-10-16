import React from 'react';
import { useCart } from '../Cart/CartLogic';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from "lucide-react";

const ProductCard = ({ product }) => {
  if (!product) {
    return null; 
  }

  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleQuickAddToCart = (e) => {
    e.stopPropagation(); 
    
    const itemToAdd = {
      id: product._id,
      quantity: 1,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url,
    };
    
    addItem(itemToAdd);
    console.log(`${itemToAdd.name} added to cargo hold!`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* --- IMAGE SECTION --- */}
      <div className="relative">
        <img src={product.images[0]?.url || "/placeholder.svg"} alt={product.name} className="w-full h-64 object-cover" />
        {product.sale && (
          <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Sale
          </span>
        )}
        <span
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
            product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* --- DETAILS SECTION --- */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-gray-900 mb-1 flex-grow">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 h-10">{product.details?.author}</p>

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
              product.inStock
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!product.inStock}
          >
            + Add To Cart
          </button>
          <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;