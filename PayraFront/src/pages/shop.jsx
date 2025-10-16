import { useShopState } from "../components/Shop/shoplogic.jsx";
import FilterSidebar from "../components/Shop/sidebarUI.jsx";
import ProductGrid from "../components/Shop/productListUI.jsx";

const Shop = () => {
    // The General gets the full battle plan from the logic hook.
    const shopState = useShopState();

    return (
        <div className="min-h-screen relative">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex gap-6">
                    {/* The General gives orders (props) to its Commanders. */}
                    <FilterSidebar {...shopState} />
                    <ProductGrid {...shopState} />
                </div>
            </div>
        </div>
    );
}

export default Shop;