"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

// Helper for conditional styling 
const cn = (...classes) => classes.filter(Boolean).join(' ')

export default function BestSeller({ products, onProductSelect }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4) 
  const [isTransitioning, setIsTransitioning] = useState(true)
  const transitionRef = useRef(null)

  // 1. Filter products and ensure data integrity
  const bestSellerProducts = useMemo(() => {
    const productArray = products || [];
    return productArray.filter((product) => 
        product.isBestSeller && product.image && product.price
    ); 
  }, [products]);

  // 2. Infinite array
  const infiniteProducts = useMemo(() => {
    return [...bestSellerProducts, ...bestSellerProducts, ...bestSellerProducts]
  }, [bestSellerProducts]);

  // Re-add nextSlide/prevSlide definitions
  const nextSlide = () => setCurrentIndex((prev) => prev + 1)
  const prevSlide = () => setCurrentIndex((prev) => prev - 1)

  // 3. Responsive items per view logic 
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1) 
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2) 
      } else if (window.innerWidth < 1280) {
        setItemsPerView(3) 
      } else {
        setItemsPerView(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // 4. Infinite loop logic 
  useEffect(() => {
    if (!isTransitioning) return
    const productCount = bestSellerProducts.length

    if (transitionRef.current) {
      clearTimeout(transitionRef.current)
    }

    transitionRef.current = setTimeout(() => {
      if (currentIndex >= productCount * 2) {
        setIsTransitioning(false)
        setCurrentIndex(productCount)
        setTimeout(() => setIsTransitioning(true), 50)
      } else if (currentIndex < productCount) {
        setIsTransitioning(false)
        setCurrentIndex(productCount * 2 - 1)
        setTimeout(() => setIsTransitioning(true), 50)
      }
    }, 300)

    return () => {
      if (transitionRef.current) {
        clearTimeout(transitionRef.current)
      }
    }
  }, [currentIndex, bestSellerProducts.length, isTransitioning])

  // Start at the middle set (Unchanged)
  useEffect(() => {
    if (bestSellerProducts.length > 0) {
      setCurrentIndex(bestSellerProducts.length)
    }
  }, [bestSellerProducts.length])

  // 5. Redirection Logic (Unchanged)
  const handleProductClick = (id) => {
    if (onProductSelect) {
      onProductSelect(id) 
    } else {
      console.error("onProductSelect handler not provided to BestSeller.")
    }
  }

  // 6. Conditional Render (If no products are found)
  if (bestSellerProducts.length === 0) {
    return (
      <section className="py-16 px-4 backdrop-blur-sm bg-white/1"> 
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-[#1a4d3e]">Best Sellers</h2>
          <p className="text-gray-500">No best seller products available or data is inaccessible.</p>
        </div>
      </section>
    )
  }

  // 7. Main Render (The JSX)
  return (
    <section className="py-16 px-4 backdrop-blur-sm bg-white/5"> 
      <div className="max-w-7xl mx-auto relative">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Best Sellers</h2>

        {/* Navigation Arrows  */}
        <button
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-md border border-gray-200",
            "transition-colors -ml-4" 
          )}
          onClick={prevSlide}
          aria-label="Previous products"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>

        <button
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-md border border-gray-200",
            "transition-colors -mr-4" 
          )}
          onClick={nextSlide}
          aria-label="Next products"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>

        {/* Products Container  */}
        <div className="overflow-hidden mx-6">
          <div
            className={cn("flex gap-4")}
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              transition: isTransitioning ? "transform 300ms ease-in-out" : "none",
            }}
          >
            {infiniteProducts.map((product, index) => (
              <div 
                key={`${product.id}-${index}`} 
                className="flex-shrink-0" 
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="relative overflow-hidden">
                    <img
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 sm:h-56 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                      Best Seller
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                    </h3>
                    <p className="text-lg font-bold text-green-700">{product.price} BDT</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots (unchanged) */}
        <div className="flex justify-center mt-6 gap-2">
          {bestSellerProducts.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                index === (currentIndex - bestSellerProducts.length) % bestSellerProducts.length 
                  ? "bg-green-600" 
                  : "bg-gray-300 hover:bg-gray-400",
              )}
              onClick={() => setCurrentIndex(bestSellerProducts.length + index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}