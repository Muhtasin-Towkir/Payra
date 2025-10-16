import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api'; //axios
import ProductCard from './Shop/productCard';

const SearchResults = () => {
  const { keyword } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword) return;
      setLoading(true);
      try {
        const { data } = await API.get(`/products/search?keyword=${keyword}`);
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
      }
      setLoading(false);
    };

    fetchResults();
  }, [keyword]);

  if (loading) {
    return <div className="text-center p-10">Searching the archives...</div>;
  }

  return (
    <div className="my-12">
      <h1 className="text-2xl font-semibold mb-6">Results for: "{keyword}"</h1>
      
      {products.length > 0 ? (
        // same grid as shop
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center p-10">
          <p className="text-gray-600">No transmissions found matching that frequency.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;