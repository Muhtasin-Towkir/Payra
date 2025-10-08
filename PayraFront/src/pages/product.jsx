import { assets } from "../assets/assets.js" 
import { useProductDetails } from "../components/Product/ProductLogic.jsx"
import ProductImage from "../components/Product/ProductZoom.jsx"
import ProductInfo from "../components/Product/ProductInfo.jsx"
import { Star, ChevronLeft } from "lucide-react"
import RelatedProductsSection from "../components/Product/RelatedProducts.jsx"
import { useCart } from "../components/Cart/CartLogic.jsx" 
import React, { useState, useEffect } from 'react';

// TabButton component definition (kept for context)
const TabButton = ({ tabName, currentTab, setTab, label }) => (
    <button
        onClick={() => setTab(tabName)}
        className={`pb-4 px-2 font-medium transition-colors relative ${
            currentTab === tabName ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
        }`}
    >
        {label}
        {currentTab === tabName && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
    </button>
)

export default function ProductPage() {
    // 1. LOCAL STATE MANAGEMENT
    const [quantity, setQuantity] = useState(1); 
    const [selectedSize, setSelectedSize] = useState(null); 
    
    const { addItem } = useCart();
    
    // 2. Destructure product details, including the CRITICAL 'isLoading' flag
    const { 
        product, 
        navigate, 
        relatedProducts,
        activeTab,
        setActiveTab,
        isLoading, //  Must be returned by useProductDetails
        ...productProps 
    } = useProductDetails()

    // 3. Effect for Size Initialization
    useEffect(() => {
        if (product && Array.isArray(product.size) && product.size.length > 0) {
            setSelectedSize(product.size[0]); 
        }
    }, [product]);


    // 4. Quantity Handlers
    const handleQuantityChange = (value) => {
        let num = parseInt(value);
        if (isNaN(num) || num < 1) num = 1;
        if (num > 100) num = 100;
        setQuantity(num);
    };

    const incrementQuantity = () => {
        handleQuantityChange(quantity + 1);
    };

    const decrementQuantity = () => {
        handleQuantityChange(quantity - 1);
    };

    // 5. Add to Cart Handler
    const handleAddToCart = () => {
        // --- Validation Check ---
        if (Array.isArray(product?.size) && !selectedSize) {
             alert("Please select a size first.");
             return;
        }
        if (quantity < 1) {
            alert("Quantity must be at least 1.");
            return;
        }

        const cartItemId = product.id + (selectedSize ? `-${selectedSize}` : ''); 

        const itemToAdd = {
            id: cartItemId, 
            quantity: quantity,
            name: product.name,
            displayName: product.name + (selectedSize ? ` (${selectedSize})` : ''), 
            category: product.category,
            price: product.price,
            image: product.image,
            availableSizes: product.size,
            selectedSize: selectedSize || (Array.isArray(product.size) ? null : product.size), 
        };

        addItem(itemToAdd); 
        
    };

    
    // If data is currently fetching, show a loading message
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-xl font-medium text-gray-700">Loading product details...</h1>
            </div>
        );
    }
    
    // If loading is complete but the product is null/undefined, show Not Found
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <button onClick={() => navigate("/shop")} className="text-blue-600 hover:underline">
                        Return to Shop
                    </button>
                </div>
            </div>
        )
    }

    // --- FULL PAGE RENDER (Only runs if product data is available) ---
    return (
        <div className="min-h-screen relative">
            {/* Background */}
            <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${assets.bl9_80_60_5800})` }}/>
            <div className="absolute inset-0 rounded-2xl z-0 bg-gray-100 opacity-60" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb (Remains the same) */}
                <div className="mb-6">
                    <nav className="flex items-center text-sm text-gray-600">
                        <button onClick={() => navigate("/shop")} className="hover:text-gray-900 flex items-center">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Shop
                        </button>
                        <span className="mx-2">/</span>
                        <span>{product.category}</span>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">{product.name}</span>
                    </nav>
                </div>

                {/* Product Details Section */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* LEFT: Product Image with Zoom */}
                        <ProductImage 
                            product={product} 
                            {...productProps}
                        />

                        {/* Right: Product Info - Passing all state and handlers */}
                        <ProductInfo 
                            product={product} 
                            {...productProps}
                            
                            // Handlers and state for Cart/Quantity
                            onAddToCart={handleAddToCart}
                            quantity={quantity}
                            handleQuantityChange={handleQuantityChange}
                            incrementQuantity={incrementQuantity}
                            decrementQuantity={decrementQuantity}

                            // Handlers and state for Size
                            selectedSize={selectedSize}
                            setSelectedSize={setSelectedSize} 
                        />
                    </div>
                </div>

                {/* Description and Reviews Section */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                    <div className="border-b border-gray-200 mb-6">
                        <div className="flex gap-8">
                            <TabButton tabName="description" currentTab={activeTab} setTab={setActiveTab} label="Description" />
                            <TabButton tabName="reviews" currentTab={activeTab} setTab={setActiveTab} label={`Reviews (${product.reviews})`} />
                        </div>
                    </div>

                    {activeTab === "description" && (
                        <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div>
                            {/* Reviews UI remains here */}
                            <div className="mb-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-4xl font-bold">{product.rating}</div>
                                    <div>
                                        <div className="flex items-center mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-600">Based on {product.reviews} reviews</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-gray-600">
                                <p>Customer reviews will be displayed here.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Related Products */}
                <RelatedProductsSection relatedProducts={relatedProducts} navigate={navigate} />
            </div>
        </div>
    )
}