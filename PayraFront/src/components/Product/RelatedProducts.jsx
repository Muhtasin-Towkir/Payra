import { Star } from "lucide-react"

const RelatedProductsSection = ({ relatedProducts, navigate }) => {
    if (!relatedProducts || relatedProducts.length === 0) {
        return null // Don't render if there are no related products
    }
    
    return (
        <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                    <div
                        key={relatedProduct.id}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        // Use navigate for React Router transition
                        onClick={() => navigate(`/product/${relatedProduct.id}`)}
                    >
                        <div className="relative">
                            <img
                                src={relatedProduct.image || "/placeholder.svg"}
                                alt={relatedProduct.name}
                                className="w-full h-48 object-cover"
                            />
                            {relatedProduct.sale && (
                                <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                    Sale
                                </span>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                            <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                            i < Math.floor(relatedProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                        }`}
                                    />
                                ))}
                                <span className="ml-1 text-xs text-gray-600">({relatedProduct.reviews})</span>
                            </div>
                            <div className="text-center">
                                <span className="text-lg font-bold text-gray-900">{relatedProduct.price} BDT</span>
                                {relatedProduct.originalPrice > relatedProduct.price && (
                                    <span className="ml-2 text-sm text-gray-500 line-through">
                                        {relatedProduct.originalPrice} BDT
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RelatedProductsSection