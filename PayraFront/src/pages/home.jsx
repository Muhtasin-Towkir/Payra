import { useNavigate } from 'react-router-dom';
import Hero from '../components/Home/hero';
import BestSeller from '../components/Home/bestseller';
import Categories from '../components/Home/category';
import { HeroStats } from '../components/Home/hero stats';

// 1. Import the new, dedicated hook
import { useBestsellers } from '../hooks/usebestseller';

const Home = () => {
  // 2. Use the new hook to get only bestseller products
  const { bestsellers, loading, error } = useBestsellers();
  const navigate = useNavigate();

  const handleProductSelect = (id) => {
    navigate(`/product/${id}`);
  };

  // 3. No client-side filtering is needed anymore. The backend does the work.

  return (
    <div className="min-h-screen"> 
      <Hero />

      {loading && <p className="text-center py-10">Receiving transmissions...</p>}
      {error && <p className="text-center py-10 text-red-500">{error}</p>}
      
      {!loading && !error && (
        <BestSeller 
          products={bestsellers} // 4. Pass the direct bestseller list
          onProductSelect={handleProductSelect} 
        />
      )}
       
      <Categories />
      <HeroStats/>
    </div>
  );
};

export default Home;
