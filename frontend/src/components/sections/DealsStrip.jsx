import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeading from '../ui/SectionHeading';
import PromotionCard from '../ui/PromotionCard';
import Skeleton from '../ui/Skeleton';
import Reveal from '../ui/Reveal';
import { getActivePromotions } from '../../services/promotionService';
import { getProductsByIds } from '../../services/productService';

export default function DealsStrip() {
  const { t } = useTranslation();
  const [promos, setPromos] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivePromotions(4).then(async (list) => {
      setPromos(list);
      const products = await getProductsByIds(list.map((p) => p.productId));
      setProductMap(Object.fromEntries(products.map((p) => [p.id, p])));
      setLoading(false);
    });
  }, []);

  return (
    <section className="bg-gradient-to-b from-accent/10 to-transparent py-12">
      <div className="container-x">
        <div className="mb-6 rounded-2xl border-2 border-dashed border-accent/40 bg-accent/5 px-5 py-3">
          <SectionHeading
            title={t('home.todaysDeals')}
            viewAllLink="/promotions"
            viewAllLabel={t('common.viewAll')}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="card" />)
          : promos.map((promo, i) => (
              <Reveal key={promo.id} delay={i * 0.08}>
                <PromotionCard promotion={promo} product={productMap[promo.productId]} />
              </Reveal>
            ))}
        </div>
      </div>
    </section>
  );
}
