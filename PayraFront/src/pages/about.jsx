import { Shield, Package, Lock, Truck, Heart, Sparkles, CheckCircle2 } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Core Values Section - Increased top padding to pt-24 to ensure it clears the fixed navbar */}
      <section className=" backdrop-blur-sm text-[#1a3d3d] pt-[5px] pb-12 px-4 md:pt-16 md:pb-12 rounded-e-md">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-16 text-balance leading-tight">
            Our Core Values that Drive Everything We Do
          </h1>

          {/* Reduced gap from gap-8 md:gap-12 to gap-6 md:gap-8 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Quality Craftsmanship */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Shield className="w-8 h-8" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Quality Craftsmanship</h3>
                <p className="text-[#1a3d3d] leading-relaxed">
                  We meticulously source our products from trusted suppliers, guaranteeing unparalleled quality and
                  craftsmanship.
                </p>
              </div>
            </div>

            {/* Personalized Service */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Package className="w-8 h-8" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Personalized Service</h3>
                <p className="text-[#1a3d3d] leading-relaxed">
                  Our dedicated team is committed to ensuring a personalised shopping experience, catering to your
                  individual preferences with care and attention.
                </p>
              </div>
            </div>

            {/* Secure Transactions */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Lock className="w-8 h-8" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Secure Transactions</h3>
                <p className="text-[#1a3d3d] leading-relaxed">
                  Rest assured, your transactions and personal information are safeguarded with the latest encryption
                  technology, ensuring a secure shopping environment.
                </p>
              </div>
            </div>

            {/* Swift Worldwide Shipping */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Truck className="w-8 h-8" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Swift Worldwide Shipping</h3>
                <p className="text-[#1a3d3d] leading-relaxed">
                  Experience prompt order processing and reliable shipping to your doorstep, no matter where you are in
                  the world.
                </p>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Heart className="w-8 h-8" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Customer satisfaction</h3>
                <p className="text-[#1a3d3d] leading-relaxed">
                  Happy customers are delighted because of the customer service
                </p>
              </div>
            </div>

            {/* Simplicity Interface */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Sparkles className="w-8 h-8" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Simplicity interface</h3>
                <p className="text-[#1a3d3d] leading-relaxed">
                  Simplicity is used loosely to refer to the need to minimize a process
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Tight spacing */}
      <section className=" pt-12 px-4 md:pt-16 pb-0">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl  md:text-5xl font-bold text-center text-[#1a3d3d] mb-12 text-balance leading-tight">
            We strive to provide our customers with the highest quality
          </h2>

          <div className=" backdrop-blur-sm border-2 border-white/40 rounded-2xl p-6 md:p-10 mb-16">
            <p className="text-[#1a3d3d] leading-relaxed text-base md:text-lg">
              At Payra, we're more than just a marketplace – we're your partners in cultural exploration.
              Committed to fostering enduring relationships with our customers, we continuously evolve to meet your
              dynamic needs. From staying ahead of trends to expanding our product range, we're dedicated to delivering
              excellence in every aspect of your shopping journey.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission Details - Tight spacing */}
      <section className=" pt-0 pb-20 px-4 md:pt-0 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-[#1a3d3d]">Our Mission</h2>

          <p className=" backdrop-blur-sm border-2 border-white/40 rounded-2xl p-6 md:p-10 mb-16">
            At Payra, we're on a mission to bridge the gap between cultures by offering a handpicked selection
            of premium Bangladeshi products. With a focus on quality, availability, and trust, we strive to connect
            hearts through our bespoke offerings, ensuring a seamless shopping experience that exceeds expectations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#5a9a5a] flex-shrink-0 mt-1" />
              <span className="text-lg text-[#1a3d3d]">Quality and Variety</span>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#5a9a5a] flex-shrink-0 mt-1" />
              <span className="text-lg text-[#1a3d3d]">Expert Guidance</span>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#5a9a5a] flex-shrink-0 mt-1" />
              <span className="text-lg text-[#1a3d3d]">Sustainable Practices</span>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#5a9a5a] flex-shrink-0 mt-1" />
              <span className="text-lg text-[#1a3d3d]">Experienced Team</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
