import { assets } from "../assets/assets.js" // Ensure this is available
import { useShopState } from "../components/Shop/shoplogic.jsx"
import FilterSidebar from "../components/Shop/sidebarUI.jsx"
import ProductGrid from "../components/Shop/productListUI.jsx"
import { useCart } from "../components/Cart/CartLogic.jsx"

const Shop = () => {
    const shopState = useShopState()
    const { addItem, openCart } = useCart();

const handleAddToCart = () => {
    // 1. Build the single, robust item object (defaulting to quantity 1, no size)
    const itemToAdd = {
        ...product, 
        id: product.id,
        quantity: 1,         // Standardized quantity
        selectedSize: null,  // Standardized size
    };
    
    // 2. Call addItem with the single object (new style)
    addItem(itemToAdd); 
};

    const {
        showFilters,
        setShowFilters,
        ...gridProps
    } = shopState // Pass everything else as props

    return (
        <div className="min-h-screen relative">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${assets.bl9_80_60_5800})`, opacity: 0.1 }}
            />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex gap-6">
                    <FilterSidebar
                        {...gridProps}
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                    />
                    <ProductGrid 
                        {...gridProps} 
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        onAddToCart={handleAddToCart} 
                    />
                </div>
            </div>
        </div>
    )
}

export default Shop
