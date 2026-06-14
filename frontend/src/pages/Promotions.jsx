import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Tag, Check } from 'lucide-react';
import PromotionCard from '../components/ui/PromotionCard';
import Skeleton from '../components/ui/Skeleton';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import { getPromotions, validatePromoCode } from '../services/promotionService';
import { getProductsByIds } from '../services/productService';

const TABS = ['all', 'seasonal', 'weekly', 'ending'];

export default function Promotions() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('all');
  const [promos, setPromos] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPromotions(tab).then(async (list) => {
      setPromos(list);
      const products = await getProductsByIds(list.map((p) => p.productId));
      setProductMap(Object.fromEntries(products.map((p) => [p.id, p])));
      setLoading(false);
    });
  }, [tab]);

  const checkCode = async (e) => {
    e.preventDefault();
    const percent = await validatePromoCode(code);
    if (percent) {
      setApplied({ code: code.toUpperCase(), percent });
      toast.success(t('promotions.codeApplied', { discount: percent }));
    } else {
      setApplied(null);
      toast.error(t('promotions.codeInvalid'));
    }
  };

  const tabLabel = { all: t('promotions.all'), seasonal: t('promotions.seasonal'), weekly: t('promotions.weekly'), ending: t('promotions.endingSoon') };

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-dark to-primary py-14 text-center text-white">
        <div className="container-x">
          <h1 className="text-3xl font-extrabold sm:text-4xl">{t('promotions.title')}</h1>
          <p className="mt-3 text-white/90">{t('promotions.subtitle')}</p>
        </div>
      </div>

      <div className="container-x py-10">
        {/* Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {TABS.map((tb) => (
            <button
              key={tb}
              onClick={() => setTab(tb)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                tab === tb ? 'bg-primary text-white shadow-sm' : 'bg-surface text-muted shadow-card hover:text-text'
              }`}
            >
              {tabLabel[tb]}
            </button>
          ))}
        </div>

        {/* Promo code section */}
        <div className="mx-auto mb-10 max-w-xl rounded-2xl bg-surface p-6 text-center shadow-card">
          <h2 className="flex items-center justify-center gap-2 text-lg font-bold">
            <Tag size={20} className="text-primary" /> {t('promotions.promoCode')}
          </h2>
          <form onSubmit={checkCode} className="mt-4 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('promotions.enterCode')}
              className="flex-1 rounded-lg border border-black/10 px-4 py-2.5 text-sm uppercase outline-none focus:border-primary"
            />
            <Button type="submit">{t('common.apply')}</Button>
          </form>
          {applied && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-success">
              <Check size={16} /> {t('promotions.codeApplied', { discount: applied.percent })}
            </div>
          )}
          <p className="mt-3 text-xs text-muted">CHIMBOY10 · CHIMBOY15 · SUMMER20</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="card" />)
            : promos.map((promo, i) => (
                <Reveal key={promo.id} delay={(i % 4) * 0.08}>
                  <PromotionCard promotion={promo} product={productMap[promo.productId]} />
                </Reveal>
              ))}
        </div>
      </div>
    </div>
  );
}
