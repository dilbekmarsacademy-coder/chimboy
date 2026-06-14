import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { useWishlistStore } from '../store/wishlistStore';
import { getProductsByIds } from '../services/productService';

export default function Wishlist() {
  const { t } = useTranslation();
  const ids = useWishlistStore((s) => s.items);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductsByIds(ids).then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, [ids]);

  return (
    <div className="container-x py-10">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold sm:text-3xl">
        <Heart className="fill-primary text-primary" /> {t('profile.wishlist')}
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title={t('profile.emptyWishlist')}
          message={t('cart.emptyMessage')}
          action={<Button to="/products" size="lg">{t('common.startShopping')}</Button>}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
