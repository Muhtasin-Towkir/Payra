import { useState, useEffect } from 'react';
import API from '../api';

export const useBestsellers = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoading(true);
        setError(null);
        // This transmission requests only the records marked as bestsellers
        const { data } = await API.get('/products/bestsellers');
        setBestsellers(data.products || []);
      } catch (err) {
        setError('Failed to fetch bestseller data from the archives.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []); // This probe is sent only once when the hook is first used

  // The hook provides the intelligence to any component that summons it
  return { bestsellers, loading, error };
};

