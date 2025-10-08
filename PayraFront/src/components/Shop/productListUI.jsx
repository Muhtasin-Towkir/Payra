import { Heart, Star, Filter } from "lucide-react"
import { useCart } from '../Cart/CartLogic'; 

const ProductGrid = ({
    filteredProducts,
    selectedCategory,
    selectedSubcategory,
    sortBy,
    setSortBy,
    setShowFilters,
    showFilters,
}) => {
    // Call useCart hook once
    const { addItem } = useCart();

    // Helper function to determine a default size for quick-add
    const getDefaultSize = (product) => {
        if (Array.isArray(product.size) && product.size.length > 0) {
            return product.size[0]; // Select the first available size
        }
        return product.size || null; // Fallback to a single size string or null
    };

    //Define the handler for the 'Add to Cart' button
    const handleQuickAddToCart = (e, product) => {
        // Stop event propagation to prevent navigating to the product page when clicking the button
        e.stopPropagation(); 
        
        const selectedSize = getDefaultSize(product);
        const quantity = 1; // Default quantity for quick add

        // CRUCIAL:Construct the unique item ID for the cart state
        const cartItemId = product.id + (selectedSize ? `-${selectedSize}` : ''); 

        const itemToAdd = {
            id: cartItemId, 
            quantity: quantity,
            name: product.name,
            // Ensure displayName includes the size for clear cart display
            displayName: product.name + (selectedSize ? ` (${selectedSize})` : ''), 
            category: product.category,
            price: product.price,
            image: product.image,
            availableSizes: Array.isArray(product.size) ? product.size : [product.size].filter(Boolean),
            selectedSize: selectedSize, 
        };

        addItem(itemToAdd);
        console.log(`${itemToAdd.displayName} added to cart from Shop Page!`);
    };

    return (
        <div className="flex-1">
            {/* Breadcrumb */}
            <div className="mb-6">
                <nav className="text-sm text-gray-600">
                    <span>Shop</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{selectedCategory}</span>
                    {selectedSubcategory !== "All" && (
                        <>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900">{selectedSubcategory}</span>
                        </>
                    )}
                </nav>
            </div>

            {/* Sort and Filter Toggle */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden flex items-center text-gray-600 hover:text-gray-900"
                >
                    <Filter className="w-4 h-4 mr-2" /> Filters
                </button>
                <div className="flex items-center space-x-4 ml-auto">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="featured">Sort by</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Rating</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        // Handle navigation on the whole card click
                        onClick={() => (window.location.href = `/product/${product.id}`)}
                    >
                        <div className="relative">
                            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-64 object-cover" />
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
                        <div className="p-4">
                            <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{product.author}</p>
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
                                        {product.rating} ({product.reviews} Reviews)
                                    </span>
                                </div>
                            </div>
                            <div className="text-center mb-4">
                                <span className="text-lg font-bold text-gray-900">{product.price} BDT</span>
                                {product.originalPrice > product.price && (
                                    <span className="ml-2 text-sm text-gray-500 line-through">{product.originalPrice} BDT</span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                {/* 4. Wire the 'Add To Cart' button to the handler */}
                                <button
                                    onClick={(e) => handleQuickAddToCart(e, product)}
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
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No products found matching your filters.</p>
                </div>
            )}
        </div>
    )
}

export default ProductGrid