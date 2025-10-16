import { useNavigate } from 'react-router-dom';

import Hero from '../components/Home/hero';
import BestSeller from '../components/Home/bestseller';
import Categories from '../components/Home/category';
import { HeroStats } from '../components/Home/hero stats';

// 1. Import the powerful, refactored hook from your shop logic
import { useShopState } from '../components/Shop/shoplogic.jsx';

const Home = () => {
  // 2. Use the hook to receive the live data stream and its status
  const { products, loading, error } = useShopState();
  const navigate = useNavigate();

  const handleProductSelect = (id) => {
    navigate(`/product/${id}`);
  };

  // 3. Filter the live data stream to find the featured records (bestsellers)
  const bestsellerProducts = products.filter(product => product.isBestSeller === true).slice(0, 4);

  return (
    <div className="min-h-screen"> 
      <Hero />

      {/* 4. Conditionally render the BestSeller component based on the data stream's status */}
      {loading && <p className="text-center py-10">Receiving transmissions from the archives...</p>}
      
      {error && <p className="text-center py-10 text-red-500">{error}</p>}
      
      {!loading && !error && (
        <BestSeller 
          products={bestsellerProducts} // Pass the filtered LIVE data
          onProductSelect={handleProductSelect} 
        />
      )}
       
      <Categories />
      <HeroStats/>
    </div>
  );
};

export default Home;