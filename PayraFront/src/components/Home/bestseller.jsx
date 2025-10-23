"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const cn = (...classes) => classes.filter(Boolean).join(' ')

export default function BestSeller({ products, onProductSelect }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const slideRef = useRef(null);

  const bestSellerProducts = useMemo(() => products || [], [products]);

  const infiniteProducts = useMemo(() => {
    if (bestSellerProducts.length === 0) return [];
    const productCount = bestSellerProducts.length;
    if (productCount <= itemsPerView) return bestSellerProducts;
    return [...bestSellerProducts.slice(-itemsPerView), ...bestSellerProducts, ...bestSellerProducts.slice(0, itemsPerView)];
  }, [bestSellerProducts, itemsPerView]);

  // --- HANDLERS ---
  const nextSlide = () => {
    if (!isTransitioning) return;
    setCurrentIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (!isTransitioning) return;
    setCurrentIndex(prev => prev - 1);
  };


  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else if (window.innerWidth < 1280) setItemsPerView(3);
      else setItemsPerView(4);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set initial position
  useEffect(() => {
    if (bestSellerProducts.length > itemsPerView) {
      setCurrentIndex(itemsPerView);
    }
  }, [bestSellerProducts.length, itemsPerView]);

  // --- STABILIZED INFINITE JUMP LOGIC ---
  useEffect(() => {
    const productCount = bestSellerProducts.length;
    if (productCount <= itemsPerView) return;

    const handleTransitionEnd = () => {
      // Jump from the cloned end back to the real end
      if (currentIndex === productCount + itemsPerView) {
        setIsTransitioning(false);
        setCurrentIndex(itemsPerView);
      }
      
      // Jump from the cloned start back to the real start
      if (currentIndex === itemsPerView - 1) {
        setIsTransitioning(false);
        setCurrentIndex(productCount + itemsPerView - 1);
      }
    };

    const slider = slideRef.current;
    slider?.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      slider?.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [currentIndex, bestSellerProducts.length, itemsPerView]);

  // Re-enable transition after the jump
  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
    }
  }, [isTransitioning]);

  const handleProductClick = (id) => {
    if (onProductSelect) onProductSelect(id);
  };

  if (bestSellerProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 backdrop-blur-sm bg-white/5"> 
      <div className="max-w-7xl mx-auto relative">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Best Sellers</h2>

        <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-md border border-gray-200 transition-colors -ml-4" onClick={prevSlide}><ChevronLeft className="h-5 w-5 text-gray-700" /></button>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-md border border-gray-200 transition-colors -mr-4" onClick={nextSlide}><ChevronRight className="h-5 w-5 text-gray-700" /></button>

        <div className="overflow-hidden mx-6">
          <div
            ref={slideRef}
            className="flex gap-4"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              transition: isTransitioning ? "transform 300ms ease-in-out" : "none",
            }}
          >
            {infiniteProducts.map((product, index) => (
              <div 
                key={`${product._id}-${index}`}
                className="flex-shrink-0" 
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                  onClick={() => handleProductClick(product._id)}
                >
                  <div className="relative overflow-hidden">
                    <img
                        src={product.images[0]?.url || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-48 sm:h-56 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                      Best Seller
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-lg font-bold text-green-700">{product.price} BDT</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {bestSellerProducts.map((_, index) => {
            const productCount = bestSellerProducts.length;
            const activeIndex = (currentIndex - itemsPerView) % productCount;
            const correctedIndex = activeIndex < 0 ? activeIndex + productCount : activeIndex;

            return (
              <button
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  index === correctedIndex ? "bg-green-600" : "bg-gray-300 hover:bg-gray-400",
                )}
                onClick={() => setCurrentIndex(itemsPerView + index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            )
          })}
        </div>
      </div>
    </section>
  );
}

