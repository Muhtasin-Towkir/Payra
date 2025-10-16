import { useNavigate } from "react-router-dom";

const RelatedProductsSection = ({ relatedProducts }) => {
    const navigate = useNavigate();

    if (!relatedProducts || relatedProducts.length === 0) {
        return null;
    }
    
    return (
        <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                    <div
                        key={product._id} // Use ._id
                        className="... cursor-pointer"
                        onClick={() => navigate(`/product/${product._id}`)}
                    >
                        <div className="relative">
                            <img src={product.images[0]?.url || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium ...">{product.name}</h3>
                            {/* ... Price, Rating UI ... */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProductsSection;