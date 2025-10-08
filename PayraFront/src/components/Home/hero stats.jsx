import { Truck, ShoppingCart } from "lucide-react"

export function HeroStats() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Stats Section */}
          <div className="flex gap-16">
            {/* Countries Covered */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4">
                <Truck className="w-full h-full text-[#1a4d3e]" strokeWidth={1.5} />
              </div>
              <div className="text-5xl font-bold text-[#1a4d3e] mb-2">40+</div>
              <div className="text-lg font-semibold text-[#1a4d3e]">Countries Covered</div>
            </div>

            {/* Orders Completed */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4">
                <ShoppingCart className="w-full h-full text-[#1a4d3e]" strokeWidth={1.5} />
              </div>
              <div className="text-5xl font-bold text-[#1a4d3e] mb-2">200+</div>
              <div className="text-lg font-semibold text-[#1a4d3e]">Orders Completed</div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a4d3e] mb-6 leading-tight">
              Your Premier Destination for All things <span className="inline-block">Bangladeshi</span>.
            </h1>
            <p className="text-base md:text-lg text-[#1a4d3e]/90 leading-relaxed">
              Experience Bangladesh wherever you are: We bring you the finest authentic products from the heart of
              Bangladesh. Bringing a piece of home to your doorstep. No matter where you are, discover and celebrate
              Bangladeshi heritage with us.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}