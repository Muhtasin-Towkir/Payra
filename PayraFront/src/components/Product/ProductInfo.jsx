import { Heart, ShoppingCart, Plus, Minus, Star } from "lucide-react";
import { useWishlist } from "../../context/wishListContext";// <-- 1. Import new hook
import { useAuth } from '../../context/authContext.jsx'; // <-- 2. Import auth hook

const ProductInfo = ({
    product, quantity, incrementQuantity, decrementQuantity,
    handleQuantityChange, selectedSize, setSelectedSize,
    handleAddToCart,
    // --- 3. Add new props from the logic hook ---
    isWishlisted, 
    handleWishlistToggle 
}) => {
    if (!product) return null;

    const availableSizes = product.details?.size;
    const { user } = useAuth(); // Get user status

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span className="bg-gray-100 px-3 py-1 rounded-full">{product.category}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full">{product.subcategory}</span>
            </div>

            {/* --- RATING & REVIEWS --- */}
            <div className="flex items-center mb-4">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-5 h-5 ${
                                i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                        />
                    ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                    {product.rating || 0} ({product.reviews || 0} Reviews)
                </span>
            </div>

            {/* --- PRICE & STOCK STATUS --- */}
            <div className="flex items-center gap-4 mb-6">
                <div>
                    <span className="text-3xl font-bold text-gray-900">{product.price} BDT</span>
                    {product.originalPrice > product.price && (
                        <span className="ml-3 text-xl text-gray-500 line-through">{product.originalPrice} BDT</span>
                    )}
                </div>
            </div>

            {/* --- CONDITIONAL SIZE SELECTOR --- */}
            {(product.category === 'Clothes' || product.category === 'Ornaments') && Array.isArray(availableSizes) && availableSizes.length > 0 && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Size: <span className="font-bold ml-1">{selectedSize}</span>
                    </label>
                    <div className="flex gap-3">
                        {availableSizes.map(sizeOption => (
                            <button
                                key={sizeOption}
                                onClick={() => setSelectedSize(sizeOption)}
                                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                                    selectedSize === sizeOption 
                                        ? "bg-gray-900 text-white border-gray-900" 
                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                                }`}
                                disabled={!product.inStock}
                            >
                                {sizeOption}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* --- QUANTITY & ACTION BUTTONS --- */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button onClick={decrementQuantity} className="p-2 hover:bg-gray-100" disabled={!product.inStock || quantity <= 1}>
                            <Minus className="w-4 h-4" />
                        </button>
                        <input type="number" value={quantity} onChange={(e) => handleQuantityChange(e.target.value)}
                            className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                            min="1" max="100" disabled={!product.inStock}
                        />
                        <button onClick={incrementQuantity} className="p-2 hover:bg-gray-100" disabled={!product.inStock || quantity >= 100}>
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <button className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        product.inStock ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={handleAddToCart} 
                        disabled={!product.inStock}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Add To Cart
                    </button>

                    {/* --- 4. WISHLIST BUTTON (Updated) --- */}
                    <button 
                        className={`p-3 border rounded-md transition-colors ${
                            isWishlisted 
                                ? "bg-red-50 border-red-300" 
                                : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={handleWishlistToggle}
                        // Disable the button if the user is not logged in, as wishlist is user-specific
                        disabled={!user} 
                        title={!user ? "Log in to add to wishlist" : (isWishlisted ? "Remove from wishlist" : "Add to wishlist")}
                    >
                        <Heart className={`w-5 h-5 ${
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

export default ProductInfo;

