import { useProductDetails } from "../components/Product/ProductLogic.jsx";
import ProductImage from "../components/Product/ProductZoom.jsx";
import ProductInfo from "../components/Product/ProductInfo.jsx";
import RelatedProductsSection from "../components/Product/RelatedProducts.jsx";

// --- TabButton defined ---
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
);

export default function ProductPage() {
    const productDetails = useProductDetails();
    const { product, loading, error, navigate, activeTab, setActiveTab } = productDetails;

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading product details...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center">{error}</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product Not Found.</div>;

    return (
        <div className="min-h-screen relative">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-6">
                    {/* ... Breadcrumb UI ... */}
                </div>
                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <ProductImage {...productDetails} />
                        <ProductInfo {...productDetails} />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                    <div className="border-b border-gray-200 mb-6">
                        <div className="flex gap-8">
                            <TabButton tabName="description" currentTab={activeTab} setTab={setActiveTab} label="Description" />
                            <TabButton tabName="reviews" currentTab={activeTab} setTab={setActiveTab} label={`Reviews (${product.reviews || 0})`} />
                        </div>
                    </div>
                    {activeTab === "description" && (
                        <div className="prose max-w-none"><p>{product.description}</p></div>
                    )}
                    {activeTab === "reviews" && (
                        <div><p>Customer reviews will be displayed here.</p></div>
                    )}
                </div>
                <RelatedProductsSection {...productDetails} />
            </div>
        </div>
    );
}