import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeading from '../ui/SectionHeading';
import ProductCard from '../ui/ProductCard';
import Skeleton from '../ui/Skeleton';
import Reveal from '../ui/Reveal';
import { getFeaturedProducts } from '../../services/productService';

export default function FeaturedProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts(8).then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, []);

  return (
    <section className="container-x py-12">
      <SectionHeading
        title={t('home.popularProducts')}
        viewAllLink="/products"
        viewAllLabel={t('common.viewAll')}
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} variant="card" />)
          : products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.08}>
                <ProductCard product={p} />
              </Reveal>
            ))}
      </div>
    </section>
  );
}
