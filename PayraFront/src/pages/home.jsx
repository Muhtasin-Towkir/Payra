import Hero from '../components/Home/hero'
import BestSeller from '../components/Home/bestseller' // Renamed from BestSellerSlider
import Categories from '../components/Home/category' // Renamed import
import { sampleProducts } from '../components/Shop/shopdata' 
import { HeroStats } from '../components/Home/hero stats'

// This function handles redirection when a product is clicked on the slider
const handleProductSelect = (id) => {
  // Simulating redirection to the Shop page with the product ID filter
  window.location.href = `/shop?productId=${id}`; 
}

const home = () => {
  return (
    <div className="min-h-screen"> 
      <Hero />
      {/* Pass the products and the handler to the slider */}
      <BestSeller 
          products={sampleProducts} 
          onProductSelect={handleProductSelect} 
      /> 
      <Categories />
      <HeroStats/>
    </div>
  )
}

export default home