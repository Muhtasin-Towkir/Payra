import React from 'react'

const ProductImage = ({ product, imageRef, handleMouseMove, isZooming, setIsZooming, zoomPosition }) => {
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
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-[500px] object-cover transition-transform"
                    style={{
                        transform: isZooming ? "scale(2)" : "scale(1)",
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                />
            </div>
        </div>
    )
}

export default ProductImage