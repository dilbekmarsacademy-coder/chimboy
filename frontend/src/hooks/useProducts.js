import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';

// Fetches products from the mock service whenever filters change.
export default function useProducts(filters) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getProducts(filters)
      .then((res) => active && setProducts(res))
      .catch((e) => active && setError(e))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { products, loading, error };
}
