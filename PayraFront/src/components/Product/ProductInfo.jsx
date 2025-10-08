import { Heart, ShoppingCart, Plus, Minus, Star } from "lucide-react"

const ProductInfo = ({
    product,
    // Quantity State/Handlers
    quantity,
    incrementQuantity,
    decrementQuantity,
    handleQuantityChange,
    // Size State/Handlers
    selectedSize,
    setSelectedSize,
    // Other Props
    selectedPayment,
    setSelectedPayment,
    onAddToCart,
}) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {/* Category, Rating, Price/Status (JSX is already correct here) */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span className="bg-gray-100 px-3 py-1 rounded-full">{product.category}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full">{product.subcategory}</span>
            </div>

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
                    {product.rating} ({product.reviews} Reviews)
                </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div>
                    <span className="text-3xl font-bold text-gray-900">{product.price} BDT</span>
                    {product.originalPrice > product.price && (
                        <span className="ml-3 text-xl text-gray-500 line-through">{product.originalPrice} BDT</span>
                    )}
                </div>
                <div className="flex gap-2">
                    {product.sale && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Sale</span>
                    )}
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                            product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                </div>
            </div>

            {/* Size Selector - FULLY WIRED */}
            {Array.isArray(product.size) && product.size.length > 0 && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Size: 
                        <span className="font-bold ml-1">{selectedSize}</span>
                    </label>
                    <div className="flex gap-3">
                        {product.size.map(sizeOption => (
                            <button
                                key={sizeOption}
                                // CRITICAL: Uses the setSelectedSize prop to update state
                                onClick={() => setSelectedSize(sizeOption)}
                                className={`
                                    px-4 py-2 border rounded-md text-sm font-medium transition-colors
                                    ${selectedSize === sizeOption 
                                        ? "bg-gray-900 text-white border-gray-900" // Active state
                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                                    }
                                `}
                                disabled={!product.inStock}
                            >
                                {sizeOption}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Fallback for single size string (optional) */}
            {!Array.isArray(product.size) && product.size && (
                 <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size: {product.size}</label>
                 </div>
              )}
            
            {/* Quantity Selector & Cart - FULLY WIRED (Resolves Issue #4) */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                            // CRITICAL: Uses the decrementQuantity handler
                            onClick={decrementQuantity}
                            className="p-2 hover:bg-gray-100 transition-colors"
                            disabled={!product.inStock || quantity <= 1}
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <input
                            type="number"
                            // CRITICAL: Uses the quantity state
                            value={quantity}
                            // CRITICAL: Uses the handleQuantityChange handler
                            onChange={(e) => handleQuantityChange(e.target.value)}
                            className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                            min="1"
                            max="100"
                            disabled={!product.inStock}
                        />
                        <button
                            // CRITICAL: Uses the incrementQuantity handler
                            onClick={incrementQuantity}
                            className="p-2 hover:bg-gray-100 transition-colors"
                            disabled={!product.inStock || quantity >= 100}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Add to Cart Button (Correctly wired to onAddToCart prop) */}
                    <button
                        className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                            product.inStock
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={onAddToCart} 
                        disabled={!product.inStock}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Add To Cart
                    </button>

                    {/* Wishlist Button */}
                    <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="flex gap-4">
                    <button
                        onClick={() => setSelectedPayment("stripe")}
                        className={`flex-1 py-3 px-6 rounded-md border-2 font-medium transition-all ${
                            selectedPayment === "stripe"
                                ? "border-blue-600 bg-blue-50 text-blue-700"
                                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                    >
                        Stripe
                    </button>
                    <button
                        onClick={() => setSelectedPayment("cod")}
                        className={`flex-1 py-3 px-6 rounded-md border-2 font-medium transition-all ${
                            selectedPayment === "cod"
                                ? "border-green-600 bg-green-50 text-green-700"
                                : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                        }`}
                    >
                        Cash on Delivery
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductInfo