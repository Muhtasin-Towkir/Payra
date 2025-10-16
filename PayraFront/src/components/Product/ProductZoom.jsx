const ProductImage = ({ product, imageRef, handleMouseMove, isZooming, setIsZooming, zoomPosition }) => {
    if (!product) return null;

    return (
        <div className="relative">
            <div
                ref={imageRef}
                className="relative overflow-hidden rounded-lg border border-gray-200 cursor-crosshair"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
            >
                <img
                    src={product.images[0]?.url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-[500px] object-cover transition-transform"
                    style={{
                        transform: isZooming ? "scale(2)" : "scale(1)",
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                />

                {/* --- BADGES --- */}
                {product.sale && (
                    <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Sale
                    </span>
                )}
                <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                        product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
            </div>
        </div>
    );
};

export default ProductImage;